'use client';
import {useState, useEffect} from 'react';
import useHome from './useHome';

export function MemberAdd ({homes, currentHome, setMembers}) {
    const {displayMember, addMember} = useHome(homes, currentHome);
    const [memberName, setMemberName] = useState('');

    async function handleAddMember() {
        await addMember(currentHome.id, memberName);
        setMemberName(''); // clear input
        const updated = await displayMember(); // refresh list
        setMembers(updated);
    }

    return (
        <d1>
            <input
            type="name"
            placeholder="Enter new member name"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            />

            <button disabled={!memberName.trim()}  onClick={handleAddMember}>Add Member</button>
        </d1>
    )

}


export function TaskAdd ({homes, currentHome, setTasks}) {
    const {displayDefaultTask, addTask, displayTask} = useHome(homes, currentHome);
    const[defaultTasks, setDefaultTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState('');


    async function handleAddTask() {
        await addTask(currentHome.id, selectedTaskId);
        setSelectedTaskId('');

        const updated = await displayTask();
        setTasks(updated);
    }

    //cargar lista de tareas pre-definidas
    useEffect(() => {
        async function loadTasks() {
            const data = await displayDefaultTask();
            setDefaultTasks(data);
        }
        loadTasks();
    }, [currentHome]);

    return (
        <div>
        <h3>Available Tasks</h3>
        <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
        >
            <option value="">-- Select a task --</option>
            {defaultTasks.map((task) => (
            <option key={task.id} value={task.id}>
                {task.title}
            </option>
            ))}
        </select>

        <button disabled={!selectedTaskId} onClick={handleAddTask}>
            Add Task
        </button>
        </div>
    );
}




export function MemberList ({homes, currentHome, members, setMembers}) {
    const {displayMember, deleteMember} = useHome(homes, currentHome);

    //Cargar miembros
    useEffect(() => {
        async function loadMembers() {
            const data = await displayMember();
            setMembers(data);
        }
        loadMembers();
    }, [currentHome]);

    async function handleDeleteMember(memberId) {
        await deleteMember(memberId);
        const updated = await displayMember();
        setMembers(updated);
    }

    return (
        <div>
            <h2>Members:</h2>
            {members.length > 0 ? (
            <ul>
                {members.map((m) => (
                <li key={m.id}>
                    {m.name} (Member ID: {m.id})
                    <button onClick={() => handleDeleteMember(m.id)}>Delete</button>
                </li>
                ))}
            </ul>
            ) : (
            <p>No members found.</p>
            )}
        </div>
    )
}

export function TaskList ({homes, currentHome, tasks, setTasks}) {
    const {displayTask, deleteTask} = useHome(homes, currentHome);

    //Cargar tareas
    useEffect(() => {
        async function loadTasks() {
            const data = await displayTask();
            setTasks(data);
        }
        loadTasks();
    }, [currentHome]);


    async function handleDeleteTask(taskId) {
        await deleteTask(taskId);
        const updated = await displayTask();
        setTasks(updated);
    }

    return (
        <div>
            <h2>Available Tasks:</h2>
            {tasks.length > 0 ? (
            <ul>
                {tasks.map((t) => (
                <li key={t.assigned_id}>
                    {t.title} (AssignedTask ID: {t.assigned_id} || Task ID: {t.task_id})
                    <button onClick={() => handleDeleteTask(t.assigned_id)}>Delete</button>
                </li>
                ))}
            </ul>
            ) : (
            <p>No tasks found.</p>
            )}
        </div>
    )
}