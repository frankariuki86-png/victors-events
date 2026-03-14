import { Facebook, Instagram, MapPin, Phone, Mail, Music2 } from "lucide-react";
import SectionTitle from "./SectionTitle";

export default function ContactSection() {
  const mapUrl =
    import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps?q=Nakuru%2C%20Kenya&output=embed";

  return (
    <section id="contact" className="bg-brand-grape py-20 text-white">
      <div className="section-wrap">
        {/* Override SectionTitle colors inline so text is fully visible on the dark purple background */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">Reach Us</p>
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Contact Victor's Events</h2>
          <p className="mx-auto mt-3 max-w-3xl text-base font-semibold text-white">
            We are available 24/7 for bookings, planning calls, and on-site coordination.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-6">
            <p className="flex items-center gap-3"><Phone size={18} /> +254 726 965 477 / +254 723 066 340</p>
            <p className="flex items-center gap-3"><Mail size={18} /> bookings@victorsevents.co.ke</p>
            <p className="flex items-center gap-3"><MapPin size={18} /> Nakuru, Kenya</p>
            <div className="flex gap-4 pt-2">
              <a href="#" aria-label="Facebook" className="rounded-full bg-white/20 p-2 hover:bg-white/30"><Facebook size={18} /></a>
              <a href="#" aria-label="Instagram" className="rounded-full bg-white/20 p-2 hover:bg-white/30"><Instagram size={18} /></a>
              <a href="#" aria-label="TikTok" className="rounded-full bg-white/20 p-2 hover:bg-white/30"><Music2 size={18} /></a>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/20">
            <iframe
              title="Victor's Events Location"
              src={mapUrl}
              loading="lazy"
              className="h-[320px] w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
