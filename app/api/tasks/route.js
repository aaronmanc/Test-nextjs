
import { neon } from '@neondatabase/serverless';
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

const sql = neon(process.env.DATABASE_URL);


export async function GET() {
    try {
        const cookieStore = await cookies();
        const homeId = cookieStore.get('homeId')?.value;

        if (!homeId) {
            return NextResponse.json({ error: "Missing homeId cookie" }, { status: 400 });
        }

        const result = await sql`
            SELECT 
                a.id AS assigned_id,
                a.home_id,
                a.task_id,
                a.member_id,
                a.status,
                a.year,
                a.semana,
                d.title,
                d.category,
                d.description
            FROM assigned_tasks a
            JOIN default_tasks d
                ON a.task_id = d.id
            WHERE a.home_id = ${homeId}
            ORDER BY a.id ASC
        `;
        //assignedTasks ya no usa .id como identificador unico, ahora usa .assigned_id

        return NextResponse.json({assignedTasks: result});

    } catch(err){
        console.error('Error fetching tasks:', err);
        return NextResponse.json({error: 'Failed to load tasks'}, {status: 500});
    }

}


export async function POST(req) {
    try{
        const {homeId, taskId} = await req.json();

        if (!homeId || !taskId)
            return NextResponse.json({error: "Missing Fields"}, {status: 400});

        const result = await sql`
            INSERT INTO assigned_tasks (home_id, task_id) VALUES (${homeId}, ${taskId}) RETURNING *`;

        return NextResponse.json({assignedTask: result[0]});

        } catch (err) {
            console.error(err);
            return NextResponse.json ({error: 'Internal Server Error'}, {status: 500});
        }
}



export async function DELETE(req){
    try{
        const {taskId} = await req.json();
        
        if (!taskId){
            return NextResponse.json({error: 'Missing taskId'}, {status: 400});
        }

        const result = await sql`DELETE FROM assigned_tasks WHERE id = ${taskId} RETURNING *`;

        if (result.length== 0) {
            return NextResponse.json({error: 'task not found'}, {status: 400})
        }

        return NextResponse.json({message: 'Deleted succesfully', deleted: result[0]})
        
    } catch (err){
        console.error('Error deleting task:', err)
        return NextResponse.json({error: 'Failed to delete task'}, {status: 500})
    }
}