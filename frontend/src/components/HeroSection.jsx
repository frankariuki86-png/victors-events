import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="home" className="hero-gradient relative overflow-hidden pb-20 pt-16 md:pt-20">
      <div className="section-wrap grid items-center gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <p className="inline-flex rounded-full border border-brand-plum/20 bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-plum">
            Jerusalem Building, Nakuru
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-brand-grape md:text-6xl">
            We Turn Your Events into Unforgettable Memories
          </h1>
          <p className="max-w-xl text-lg text-slate-700">
            From intimate gatherings to grand celebrations, Victor&apos;s Events delivers creativity, reliability, and customer-centric service for every occasion.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#booking" className="rounded-full bg-brand-plum px-6 py-3 font-bold text-white shadow-glow transition hover:bg-brand-grape">
              Book Your Date
            </a>
            <a href="#services" className="rounded-full border border-brand-plum px-6 py-3 font-bold text-brand-plum transition hover:bg-brand-plum hover:text-white">
              Explore Services
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -left-8 -top-8 hidden h-24 w-24 rounded-full bg-brand-gold/30 blur-xl md:block" />
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80"
            alt="Wedding celebration setup"
            className="h-[420px] w-full rounded-3xl object-cover shadow-2xl"
          />
          <p className="mt-2 text-xs text-slate-500">
            Replace this hero image with your poster photo at <code>frontend/public/images/hero.jpg</code> if preferred.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
