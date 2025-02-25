import pool from "@/app/utils/db";

export async function POST(request) {
  const formData = await request.formData();
  
  const sanitize = (value) => (value === "" || value === "null" ? null : value);

  const member = {
    user_type: sanitize(formData.get("member_user_type")),
    phone_number: sanitize(formData.get("member_phone_number")),
    email: sanitize(formData.get("member_email")),
    club: sanitize(formData.get("member_club")),
    birthday: sanitize(formData.get("member_birthday")),
    anniversary: sanitize(formData.get("member_anniversary")),
    name: sanitize(formData.get("member_name")),
  };

  const spouse = {
    user_type: sanitize(formData.get("spouse_user_type")),
    phone_number: sanitize(formData.get("spouse_phone_number")),
    email: sanitize(formData.get("spouse_email")),
    club: sanitize(formData.get("spouse_club")),
    birthday: sanitize(formData.get("spouse_birthday")),
    name: sanitize(formData.get("spouse_name")),
  };

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const memberRes = await client.query(
      `INSERT INTO public."Users" (user_type, phone_number, email, club, partner_id, "Birthday", name)
       VALUES ($1, $2, $3, $4, NULL, $5, $6)
       RETURNING user_id`,
      [
        member.user_type,
        member.phone_number,
        member.email,
        member.club,
        member.birthday,
        member.name,
      ]
    );

    const memberId = memberRes.rows[0].user_id;

    const spouseRes = await client.query(
      `INSERT INTO public."Users" (user_type, phone_number, email, club, partner_id, "Birthday", name)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING user_id`,
      [
        spouse.user_type,
        spouse.phone_number,
        spouse.email,
        spouse.club,
        memberId,
        spouse.birthday,
        spouse.name,
      ]
    );

    const spouseId = spouseRes.rows[0].user_id;

    await client.query(
      `UPDATE public."Users"
       SET partner_id = $1
       WHERE user_id = $2`,
      [spouseId, memberId]
    );

    await client.query(
      `INSERT INTO public.anniversary(
        anniversary_date, user1, user2)
       VALUES ($1, $2, $3)`,
      [member.anniversary, memberId, spouseId]
    );

    await client.query("COMMIT");

    return new Response(JSON.stringify({ success: true, memberId, spouseId }), { status: 200 });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}