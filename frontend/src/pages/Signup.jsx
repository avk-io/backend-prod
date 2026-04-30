import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      setMsg("USER CREATED...");
      setTimeout(() => navigate("/"), 1200);
    } else {
      setMsg(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center px-4">

      <div className="w-full max-w-xl border border-green-500 p-8 shadow-[0_0_25px_rgba(34,197,94,0.25)]">

        <p className="mb-2">SYSTEM:// NEW USER PROVISIONING</p>
        <p className="mb-6 text-green-300">REGISTRATION CHANNEL OPEN</p>

        <h1 className="text-3xl mb-8">[ CREATE ACCOUNT ]</h1>

        <form onSubmit={handleSignup} className="space-y-5">

          <div>
            <label>{">"} EMAIL</label>
            <input
              type="email"
              className="w-full mt-2 bg-black border border-green-500 p-3 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>{">"} PASSWORD</label>
            <input
              type="password"
              className="w-full mt-2 bg-black border border-green-500 p-3 outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full border border-green-500 p-3 hover:bg-green-500 hover:text-black transition">
            INITIALIZE USER
          </button>
        </form>

        {msg && (
          <p className="mt-5 text-green-300">{msg}</p>
        )}

        <p className="mt-8 text-green-300">
          EXISTING ACCESS?{" "}
          <Link to="/" className="underline">
            LOGIN TERMINAL
          </Link>
        </p>

      </div>
    </div>
  );
}