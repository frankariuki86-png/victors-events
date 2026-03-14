import { motion } from "framer-motion";

export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center"
    >
      {eyebrow && (
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-plum">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl font-bold text-brand-grape md:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-3xl text-base text-slate-600">{subtitle}</p>}
    </motion.div>
  );
}
