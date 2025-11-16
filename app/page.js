"use client";

import './global.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = async () => { //funciones async pueden realizar operaciones que toman tiempo sin congelar toda la app como un fetch de api
    try {
      const res = await fetch('/api/login', {
        method: 'POST',                                       //tipo de llamada
        headers: { 'Content-Type': 'application/json' },      //le dice al server el content-type, que es un json
        body: JSON.stringify({ email }),                      //la data que envio, que en este caso es data http entonces queda como '{email:test@}'
        credentials: 'include', // Guarda cookies
      });

      if (!res.ok) throw new Error('Login failed');

      router.push('/home'); // Rederigir a pagina principal

    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="center-wrapper">
      <div className="center-box">

        <h1>Enter your Gmail</h1>

        <input
          type="email"
          placeholder="Enter your Gmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>

  );
}
