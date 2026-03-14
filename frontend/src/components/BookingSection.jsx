import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Smartphone, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api";
import SectionTitle from "./SectionTitle";

const initialState = {
  name: "",
  email: "",
  phone: "",
  service_id: "",
  date: "",
  message: ""
};

// Payment status modal shown after M-Pesa STK push attempt
function PaymentStatusModal({ status, message, onClose }) {
  const isSuccess = status === "pending" || status === "success";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="mb-5 flex justify-center">
          {isSuccess ? (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle size={48} className="text-green-500" strokeWidth={1.8} />
            </span>
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <XCircle size={48} className="text-red-500" strokeWidth={1.8} />
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-display text-2xl font-bold mb-2 ${isSuccess ? "text-green-700" : "text-red-700"}`}>
          {isSuccess ? "Payment Request Sent!" : "Payment Failed"}
        </h3>

        {/* Message */}
        <p className="text-slate-600 text-sm leading-relaxed mb-5">{message}</p>

        {/* Instruction for success */}
        {isSuccess && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-green-50 border border-green-200 p-4 text-left">
            <Smartphone size={20} className="mt-0.5 shrink-0 text-green-600" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Check Your Phone</p>
              <p className="text-green-700 text-xs mt-0.5">
                A payment prompt has been sent to your phone. Enter your M-Pesa PIN to complete the deposit.
                Do not close this page until payment is confirmed.
              </p>
            </div>
          </div>
        )}

        {/* Retry tip for failure */}
        {!isSuccess && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-left">
            <XCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <p className="font-semibold text-red-800 text-sm">What to do next</p>
              <p className="text-red-700 text-xs mt-0.5">
                Check that your phone number is correct and has sufficient M-Pesa balance, then try again.
                You can also contact us directly at +254 726 965 477.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className={`w-full rounded-full py-3 font-semibold text-white transition ${
            isSuccess
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isSuccess ? "Got it, thanks!" : "Close & Try Again"}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function BookingSection({ services }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // { status, message }

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/bookings", form);
      toast.success("Booking submitted successfully. Check your email for confirmation.");
      setForm(initialState);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not submit booking");
    } finally {
      setLoading(false);
    }
  };

  const initiateMpesa = async () => {
    if (!form.service_id) return toast.error("Select a service first for deposit payment.");
    if (!form.phone) return toast.error("Enter your phone number for M-Pesa STK push.");

    try {
      setMpesaLoading(true);
      const { data } = await api.post("/payments/mpesa/stk-push", {
        amount: 5000,
        phoneNumber: form.phone,
        accountReference: "VictorsEvent",
        transactionDesc: "Event booking deposit"
      });

      setPaymentStatus({
        status: data.status || (data.success ? "pending" : "failed"),
        message: data.message || "Request sent."
      });
    } catch (error) {
      const msg = error?.response?.data?.message || "M-Pesa request failed. Please try again.";
      setPaymentStatus({ status: "failed", message: msg });
    } finally {
      setMpesaLoading(false);
    }
  };

  return (
    <section id="booking" className="py-20">
      <div className="section-wrap">
        <SectionTitle
          eyebrow="Reserve Your Date"
          title="Book an Event Consultation"
          subtitle="Fill the form and we will contact you quickly to finalize your package."
        />
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="glass-card mx-auto grid max-w-4xl gap-4 p-6 md:grid-cols-2"
        >
          <input className="rounded-xl border p-3" name="name" placeholder="Your Name" value={form.name} onChange={onChange} required />
          <input className="rounded-xl border p-3" type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input className="rounded-xl border p-3" name="phone" placeholder="Phone e.g. 0712 345 678" value={form.phone} onChange={onChange} required />
          <select className="rounded-xl border p-3" name="service_id" value={form.service_id} onChange={onChange} required>
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
          <input className="rounded-xl border p-3 md:col-span-2" type="date" name="date" value={form.date} onChange={onChange} required />
          <textarea
            className="rounded-xl border p-3 md:col-span-2"
            name="message"
            placeholder="Tell us more about your event"
            rows="4"
            value={form.message}
            onChange={onChange}
            required
          />

          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button
              disabled={loading}
              className="rounded-full bg-brand-plum px-6 py-3 font-semibold text-white transition hover:bg-brand-grape disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit Booking"}
            </button>
            <button
              type="button"
              onClick={initiateMpesa}
              disabled={mpesaLoading}
              className="flex items-center gap-2 rounded-full border-2 border-brand-gold bg-brand-gold/10 px-5 py-2.5 font-semibold text-brand-grape transition hover:bg-brand-gold/20 disabled:opacity-60"
            >
              {mpesaLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending prompt…
                </>
              ) : (
                <>
                  <Smartphone size={16} />
                  Pay Deposit via M-Pesa
                </>
              )}
            </button>
          </div>

          <p className="md:col-span-2 text-xs text-slate-500">
            M-Pesa STK push sends a KES 5,000 deposit prompt to the phone number entered above. Ensure your phone is on and M-Pesa is active.
          </p>
        </motion.form>
      </div>

      {/* Payment status modal */}
      <AnimatePresence>
        {paymentStatus && (
          <PaymentStatusModal
            status={paymentStatus.status}
            message={paymentStatus.message}
            onClose={() => setPaymentStatus(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
