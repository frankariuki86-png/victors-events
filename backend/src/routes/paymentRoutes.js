import express from "express";
import { z } from "zod";
import { initiateMpesaStkPush, verifyMpesaCallback } from "../services/paymentService.js";
import { config as appConfig } from "../config.js";

const router = express.Router();

function isMpesaConfigured() {
  const { mpesaConsumerKey, mpesaConsumerSecret, mpesaShortcode, mpesaPasskey, mpesaCallbackUrl } = appConfig;
  const placeholders = ["replace_me", "your_value_here", ""];
  const missing = (v) => !v || placeholders.includes(String(v).trim().toLowerCase());
  return !missing(mpesaConsumerKey) && !missing(mpesaConsumerSecret) && !missing(mpesaShortcode) && !missing(mpesaPasskey) && !missing(mpesaCallbackUrl);
}

function extractSafaricomError(error) {
  const d = error?.response?.data;
  if (!d) return null;
  return (
    d.errorMessage ||
    d.error_description ||
    d.ResponseDescription ||
    d.resultDesc ||
    d.message ||
    (typeof d === "string" ? d : null)
  );
}

router.post("/mpesa/stk-push", async (req, res) => {
  const parsed = z
    .object({
      amount: z.coerce.number().int().positive(),
      phoneNumber: z.string().min(9),
      accountReference: z.string().min(2).max(12).default("VictorsEvent"),
      transactionDesc: z.string().min(3).max(50).default("Event booking deposit")
    })
    .safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      status: "failed",
      message: "Invalid request. Please check the phone number (min 9 digits) and amount."
    });
  }

  // Dev/demo mode — return a simulated pending response when credentials are not yet set up
  if (!isMpesaConfigured()) {
    if (appConfig.nodeEnv !== "production") {
      return res.json({
        success: true,
        status: "pending",
        message: "Demo mode: M-Pesa credentials not configured. In production a real STK push will be sent to your phone.",
        checkoutRequestId: `DEMO-${Date.now()}`,
        merchantRequestId: "DEMO"
      });
    }
    return res.status(503).json({
      success: false,
      status: "failed",
      message: "M-Pesa payment is not available right now. Please contact us directly at +254 726 965 477."
    });
  }

  try {
    const response = await initiateMpesaStkPush(parsed.data);
    const accepted = String(response?.ResponseCode || "") === "0";

    if (!accepted) {
      return res.status(400).json({
        success: false,
        status: "failed",
        message: response?.CustomerMessage || response?.ResponseDescription || response?.errorMessage || "M-Pesa request was not accepted. Please try again."
      });
    }

    return res.json({
      success: true,
      status: "pending",
      message: response?.CustomerMessage || "M-Pesa prompt sent. Confirm payment on your phone.",
      checkoutRequestId: response?.CheckoutRequestID,
      merchantRequestId: response?.MerchantRequestID
    });
  } catch (error) {
    const safaricomMsg = extractSafaricomError(error);
    return res.status(500).json({
      success: false,
      status: "failed",
      message: safaricomMsg || "Unable to reach M-Pesa right now. Please check your connection or try again shortly."
    });
  }
});

router.post("/mpesa/callback", async (req, res) => {
  const signature = req.headers["x-victors-signature"];
  const isValid = verifyMpesaCallback(req.body, signature);

  if (!isValid) {
    return res.status(401).json({ message: "Invalid callback signature" });
  }

  // In production, persist callback result and update booking payment status by reference.
  return res.json({ ResultCode: 0, ResultDesc: "Callback received" });
});

export default router;
