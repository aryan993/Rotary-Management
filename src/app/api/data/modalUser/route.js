import pool from "@/app/utils/db";

export async function GET(request) {
  try {
    // Extract query parameters from the request URL
    const url = new URL(request.url);
    const user_id = url.searchParams.get("user_id");
    const partner_id = url.searchParams.get("partner_id");

    // Validate that both user_id and partner_id are provided
    if (!user_id || !partner_id) {
      return Response.json(
        { error: "Both user_id and partner_id are required" },
        { status: 400 }
      );
    }

    // Query the database with the provided user_id and partner_id
    const { rows } = await pool.query(
      `SELECT * FROM public."Users"
       WHERE user_id IN ($1,$2)
       ORDER BY user_id ASC`,
      [user_id, partner_id]
    );
    console.log(rows)

    // Return the filtered data
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
