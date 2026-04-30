import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();

    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      setTime(now);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.success) {
      setUser(data.data);
    } else {
      navigate("/");
    }
  };

  const logout = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">

      <div className="max-w-5xl mx-auto border border-green-500 p-8 shadow-[0_0_25px_rgba(34,197,94,0.20)]">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl">[ CONTROL PANEL ]</h1>

          <button
            onClick={logout}
            className="border border-red-500 text-red-400 px-4 py-2 hover:bg-red-500 hover:text-black transition"
          >
            TERMINATE SESSION
          </button>
        </div>

        {/* Status */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="border border-green-500 p-5">
            <p className="mb-3">USER STATUS</p>

            {user && (
              <>
                <p>{">"} EMAIL: {user.email}</p>
                <p>{">"} ID: {user.userId}</p>
                <p>{">"} ACCESS: GRANTED</p>
              </>
            )}
          </div>

          <div className="border border-green-500 p-5">
            <p className="mb-3">SYSTEM STATUS</p>

            <p>{">"} NODE: ACTIVE</p>
            <p>{">"} FIREWALL: ENABLED</p>
            <p>{">"} SESSION: SECURE</p>
            <p>{">"} TIME: {time}</p>
          </div>

        </div>

        {/* Logs */}
        <div className="mt-8 border border-green-500 p-5">
          <p className="mb-3">LIVE TERMINAL</p>

          <p>{">"} Connection established...</p>
          <p>{">"} Credentials verified...</p>
          <p>{">"} Access privileges loaded...</p>
          <p>{">"} Awaiting command...</p>
        </div>

      </div>
    </div>
  );
}