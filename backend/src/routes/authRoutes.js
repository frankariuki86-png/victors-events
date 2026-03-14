import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { supabase, supabaseAuthClient } from "../supabaseClient.js";
import { config } from "../config.js";

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid credentials payload" });
  }

  const { email, password } = parsed.data;

  const {
    data: { user },
    error: signInError
  } = await supabaseAuthClient.auth.signInWithPassword({ email, password });

  if (signInError || !user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const { data: admin, error: adminLookupError } = await supabase
    .from("admin_users")
    .select("id,email")
    .eq("id", user.id)
    .maybeSingle();

  if (adminLookupError) {
    return res.status(500).json({ message: "Could not verify admin access right now. Please try again." });
  }

  if (!admin) {
    return res.status(403).json({
      message:
        "Access denied. Admin account required. Add this Supabase Auth user to admin_users table first."
    });
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, { expiresIn: "12h" });
  return res.json({ token });
});

export default router;
