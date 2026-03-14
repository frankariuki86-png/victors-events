import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

export default function ServicesSection({ services }) {
  return (
    <section id="services" className="py-20">
      <div className="section-wrap">
        <SectionTitle
          eyebrow="What We Offer"
          title="Wedding and Event Services"
          subtitle="We provide complete event support: setup, style, sound, fashion, food, and logistics."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card group overflow-hidden"
            >
              <img src={service.image_url} alt={service.title} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-5">
                <h3 className="font-display text-2xl text-brand-grape">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{service.description}</p>
                <p className="mt-4 text-lg font-bold text-brand-plum">KES {Number(service.price).toLocaleString()}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
