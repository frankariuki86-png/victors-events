import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";
import { saveToken } from "../lib/auth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", { email, password });
      saveToken(data.token);
      toast.success("Login successful");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-brand-cream p-4">
      <form onSubmit={submit} className="glass-card w-full max-w-md space-y-4 p-6">
        <h1 className="font-display text-3xl font-bold text-brand-grape">Admin Login</h1>
        <input className="w-full rounded-xl border p-3" type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-xl border p-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full rounded-xl bg-brand-plum px-4 py-3 font-semibold text-white" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <a href="/" className="block text-center text-sm text-brand-plum">Back to website</a>
      </form>
    </main>
  );
}
