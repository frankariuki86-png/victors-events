import express from "express";
import { z } from "zod";
import { supabase } from "../supabaseClient.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const serviceSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number().positive(),
  image_url: z.string().url()
});

router.get("/", async (_, res) => {
  const { data, error } = await supabase.from("services").select("*").order("id", { ascending: true });
  if (error) return res.status(500).json({ message: error.message });
  return res.json(data);
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid service data" });

  const { data, error } = await supabase.from("services").insert(parsed.data).select().single();
  if (error) return res.status(500).json({ message: error.message });
  return res.status(201).json(data);
});

router.put("/:id", requireAuth, async (req, res) => {
  const parsed = serviceSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid service update data" });

  const { data, error } = await supabase
    .from("services")
    .update(parsed.data)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  return res.json(data);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const { error } = await supabase.from("services").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ message: error.message });
  return res.status(204).send();
});

export default router;
