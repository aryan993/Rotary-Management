import pool from "@/app/utils/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const filterType = searchParams.get("filterType"); // 'birthday' or 'anniversary'

  try {
    let query;
    let params = [];

    if (startDate && endDate && filterType) {
      // If startDate, endDate, and filterType are provided, filter based on the selected type
      if (filterType === "birthday") {
        query = `
          SELECT * FROM public."Users"
          WHERE TO_CHAR("Birthday", 'MM-DD') BETWEEN TO_CHAR($1::date, 'MM-DD') AND TO_CHAR($2::date, 'MM-DD')
          ORDER BY TO_CHAR("Birthday", 'MM-DD') ASC
        `;
      } else if (filterType === "anniversary") {
        query = `
            SELECT u.*, a."anniversary_date"
            FROM public."Users" u
            JOIN public."anniversary" a ON u."user_id" = a."user1"
            AND TO_CHAR(a.anniversary_date, 'MM-DD') BETWEEN TO_CHAR($1::date, 'MM-DD') AND TO_CHAR($2::date, 'MM-DD')
            ORDER BY TO_CHAR(a.anniversary_date, 'MM-DD') ASC;
        `;
      }
      params = [startDate, endDate];
    } else {
      // If no date range or filterType is provided, fetch all users
      query = `
          SELECT u.*, a."anniversary_date"
          FROM public."Users" u
          JOIN public."anniversary" a ON u."user_id" = a."user1" or u."user_id" = a."user2"
          ORDER BY u."user_id" ASC;
      `;
    }

    // Execute the query
    const { rows } = await pool.query(query, params);
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT (Update) member and spouse data
export async function PUT(request) {
  try {
    const {
      member_id,
      spouse_id,
      member_name,
      spouse_name,
      member_birthday,
      spouse_birthday,
      member_email,
      spouse_email,
      member_phone,
      spouse_phone,
      member_club,
      spouse_club,
      anniversary_date,
    } = await request.json();

    console.log(
      "data to fetch are" + member_id,
      spouse_id,
      member_name,
      spouse_name,
      member_birthday,
      spouse_birthday,
      member_email,
      spouse_email,
      member_phone,
      spouse_phone,
      member_club,
      spouse_club,
      anniversary_date
    );
    // Start a transaction to ensure atomicity
    await pool.query("BEGIN");

    // Update the members table
    await pool.query(
      `UPDATE "Users" 
       SET name= $1,"Birthday"=$2,email=$3,phone_number=$4,club=$5
       WHERE user_id = $6`,
      [
        member_name,
        member_birthday === "" ? null : member_birthday,
        member_email,
        member_phone,
        member_club,
        member_id,
      ]
    );

    // Update the spouse table
    await pool.query(
      `UPDATE "Users" 
       SET name= $1,"Birthday"=$2,email=$3,phone_number=$4,club=$5
       WHERE user_id = $6`,
      [
        spouse_name,
        spouse_birthday === "" ? null : spouse_birthday,
        spouse_email,
        spouse_phone,
        spouse_club,
        spouse_id,
      ]
    );

    //update anniversary
    if (anniversary_date) {
      await pool.query(
        `UPDATE anniversary 
         SET anniversary_date=$1
         WHERE user1 = $2`,
        [anniversary_date, member_id]
      );
    }

    // Commit the transaction
    await pool.query("COMMIT");

    return Response.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    // Rollback the transaction in case of error
    await pool.query("ROLLBACK");
    console.error(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
