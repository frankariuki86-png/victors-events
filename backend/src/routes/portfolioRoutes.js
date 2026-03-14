import express from "express";
import { z } from "zod";
import { supabase } from "../supabaseClient.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const portfolioSchema = z.object({
  image_url: z.string().url(),
  description: z.string().min(3)
});

router.get("/", async (_, res) => {
  const { data, error } = await supabase.from("portfolio").select("*").order("id", { ascending: true });
  if (error) return res.status(500).json({ message: error.message });
  return res.json(data);
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = portfolioSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid portfolio data" });

  const { data, error } = await supabase.from("portfolio").insert(parsed.data).select().single();
  if (error) return res.status(500).json({ message: error.message });
  return res.status(201).json(data);
});

router.put("/:id", requireAuth, async (req, res) => {
  const parsed = portfolioSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid portfolio update data" });

  const { data, error } = await supabase
    .from("portfolio")
    .update(parsed.data)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  return res.json(data);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const { error } = await supabase.from("portfolio").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ message: error.message });
  return res.status(204).send();
});

export default router;
