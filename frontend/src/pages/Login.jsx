import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("token", data.data.accessToken);
      navigate("/dashboard");
    } else {
      setMsg(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center px-4">

      <div className="w-full max-w-xl border border-green-500 p-8 shadow-[0_0_25px_rgba(34,197,94,0.25)]">

        <p className="mb-2">SYSTEM:// SECURE NODE ACCESS</p>
        <p className="mb-6 text-green-300">AUTHENTICATION REQUIRED</p>

        <h1 className="text-3xl mb-8">[ LOGIN TERMINAL ]</h1>

        <form onSubmit={handleLogin} className="space-y-5">

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
            EXECUTE LOGIN
          </button>
        </form>

        {msg && (
          <p className="mt-5 text-red-400">{msg}</p>
        )}

        <p className="mt-8 text-green-300">
          NO ACCESS KEY?{" "}
          <Link to="/signup" className="underline">
            REGISTER USER
          </Link>
        </p>

      </div>
    </div>
  );
}