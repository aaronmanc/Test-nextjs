import {pool} from "../../../lib/db.js";

export async function GET() {
    const result = await pool.query("SELECT * FROM homes");
    return Response.json(result.rows);
}

export async function POST(req) {
    const body = await req.json();
    const {name, created_by} = body;
    const result = await pool.query(
        "INSERT INTO homes (name, created_by) VALUES ($1, $2) RETURNING *",
        [name, created_by]
    );
    return Response.json(result.rows[0]);
}