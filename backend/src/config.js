import dotenv from "dotenv";

dotenv.config();

const normalizeOrigin = (value) => String(value || "").trim().replace(/\/+$/, "");

const frontendOrigins = (
  process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "http://localhost:5173"
)
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

export const config = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: frontendOrigins[0] || "http://localhost:5173",
  frontendUrls: frontendOrigins,
  jwtSecret: process.env.JWT_SECRET || "dev_secret_change_me",
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  mailFrom: process.env.MAIL_FROM || "Victor's Events <bookings@victorsevents.co.ke>",
  mpesaEnvironment: process.env.MPESA_ENV || "sandbox",
  mpesaConsumerKey: process.env.MPESA_CONSUMER_KEY,
  mpesaConsumerSecret: process.env.MPESA_CONSUMER_SECRET,
  mpesaShortcode: process.env.MPESA_SHORTCODE,
  mpesaPasskey: process.env.MPESA_PASSKEY,
  mpesaCallbackUrl: process.env.MPESA_CALLBACK_URL,
  mpesaPartyB: process.env.MPESA_PARTYB,
  mpesaValidationToken: process.env.MPESA_VALIDATION_TOKEN
};
