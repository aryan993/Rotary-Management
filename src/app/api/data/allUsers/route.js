import pool from "@/app/utils/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT 
    m.user_id AS member_id,
    m.name AS member_name,
    m.phone_number AS member_phone,
    m.email AS member_email,
    m.club AS member_club,
    m."Birthday" AS member_Birthday,
    s.user_id AS spouse_id,
    s.name AS spouse_name,
    s."Birthday" AS spouse_Birthday,
    s.phone_number AS spouse_phone,
    s.email AS spouse_email,
    s.club AS spouse_club,
    a.anniversary_date
FROM "Users" m
LEFT JOIN "Users" s ON m.partner_id = s.user_id
LEFT JOIN anniversary a 
    ON (a.user1 = m.user_id OR a.user2 = m.user_id) 
WHERE m.user_type = 'member'
ORDER BY member_id ASC;`
    );
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
