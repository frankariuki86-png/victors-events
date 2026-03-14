import crypto from "crypto";
import axios from "axios";
import { config } from "../config.js";

function getMpesaBaseUrl() {
  return config.mpesaEnvironment === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

function normalizePhone(phoneNumber) {
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

async function getMpesaAccessToken() {
  if (!config.mpesaConsumerKey || !config.mpesaConsumerSecret) {
    throw new Error("M-Pesa consumer key/secret is missing");
  }

  const auth = Buffer.from(`${config.mpesaConsumerKey}:${config.mpesaConsumerSecret}`).toString("base64");

  const response = await axios.get(`${getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });

  return response.data.access_token;
}

function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export async function initiateMpesaStkPush({ amount, phoneNumber, accountReference, transactionDesc }) {
  if (!config.mpesaShortcode || !config.mpesaPasskey || !config.mpesaCallbackUrl) {
    throw new Error("M-Pesa shortcode/passkey/callback URL is missing");
  }

  const accessToken = await getMpesaAccessToken();
  const timestamp = getTimestamp();
  const password = Buffer.from(`${config.mpesaShortcode}${config.mpesaPasskey}${timestamp}`).toString("base64");
  const sanitizedPhone = normalizePhone(phoneNumber);

  const payload = {
    BusinessShortCode: config.mpesaShortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Number(amount),
    PartyA: sanitizedPhone,
    PartyB: config.mpesaPartyB || config.mpesaShortcode,
    PhoneNumber: sanitizedPhone,
    CallBackURL: config.mpesaCallbackUrl,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc
  };

  const response = await axios.post(`${getMpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  return response.data;
}

export function verifyMpesaCallback(rawBody, signature) {
  if (!config.mpesaValidationToken) return true;
  const expected = crypto.createHmac("sha256", config.mpesaValidationToken).update(JSON.stringify(rawBody)).digest("hex");
  return expected === signature;
}
