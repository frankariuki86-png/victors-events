import express from "express";
import { z } from "zod";
import { supabase } from "../supabaseClient.js";
import { requireAuth } from "../middleware/auth.js";
import { sendBookingConfirmation } from "../services/emailService.js";

const router = express.Router();

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  service_id: z.coerce.number(),
  date: z.string(),
  message: z.string().min(5)
});

router.get("/", requireAuth, async (_, res) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, services(id, title, price)")
    .order("date", { ascending: true });

  if (error) return res.status(500).json({ message: error.message });
  return res.json(data);
});

router.post("/", async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid booking data" });

  const bookingPayload = {
    ...parsed.data,
    payment_status: "pending"
  };

  const { data, error } = await supabase.from("bookings").insert(bookingPayload).select().single();

  if (error) return res.status(500).json({ message: error.message });

  // Email failure should not break booking creation.
  sendBookingConfirmation(data).catch(() => {});

  return res.status(201).json(data);
});

router.put("/:id", requireAuth, async (req, res) => {
  const updateSchema = z
    .object({
      payment_status: z.enum(["pending", "paid", "failed"]),
      date: z.string().optional(),
      message: z.string().optional()
    })
    .partial();

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid update payload" });

  const { data, error } = await supabase
    .from("bookings")
    .update(parsed.data)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  return res.json(data);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const { error } = await supabase.from("bookings").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ message: error.message });
  return res.status(204).send();
});

export default router;
