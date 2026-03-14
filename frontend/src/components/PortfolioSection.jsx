import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import SectionTitle from "./SectionTitle";

export default function PortfolioSection({ portfolio }) {
  const [active, setActive] = useState(null);

  return (
    <section id="portfolio" className="bg-white/80 py-20">
      <div className="section-wrap">
        <SectionTitle
          eyebrow="Our Gallery"
          title="Portfolio of Recent Events"
          subtitle="A snapshot of wedding decor, tent setups, cakes, receptions, and outdoor catering events."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {portfolio.map((item, idx) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setActive(item)}
              className="group relative overflow-hidden rounded-2xl"
            >
              <img src={item.image_url} alt={item.description} className="h-48 w-full object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-brand-grape/65 opacity-0 transition group-hover:opacity-100">
                <p className="absolute bottom-3 left-3 right-3 text-left text-sm font-semibold text-white">{item.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-black/75 p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <img src={active.image_url} alt={active.description} className="h-[75vh] w-full object-cover" />
              <p className="p-4 text-sm text-slate-700">{active.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
