import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    const tasks = await sql`SELECT id, title FROM default_tasks ORDER BY id ASC`;
    return NextResponse.json({ tasks });

  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}