import SectionTitle from "./SectionTitle";

const coreValues = [
  "Creativity & Innovation",
  "Customer-Centric Service",
  "Reliability & Integrity",
  "Passion for Excellence",
  "Zero Disappointment"
];

const occasions = [
  "Weddings",
  "Ruracios",
  "Koitos",
  "Graduations",
  "Birthdays",
  "Anniversary Celebrations",
  "Ordinations Ceremonies",
  "Rite of Passage",
  "Corporate Events",
  "Thanksgiving Ceremonies",
  "Family Get Together"
];

export default function CompanyProfileSection() {
  return (
    <section id="about" className="py-20">
      <div className="section-wrap space-y-10">
        <SectionTitle
          eyebrow="Company Profile"
          title="We Turn Your Events into Unforgettable Memories"
          subtitle="From intimate gatherings to grand celebrations, we have you covered with planning, supplies, and full event execution."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <article className="glass-card p-6">
            <h3 className="font-display text-2xl text-brand-grape">Vision</h3>
            <p className="mt-3 text-slate-700">
              To be the leading events planning firm in Kenya, synonymous with creativity,
              excellence, and unforgettable experiences.
            </p>
          </article>

          <article className="glass-card p-6">
            <h3 className="font-display text-2xl text-brand-grape">Mission</h3>
            <p className="mt-3 text-slate-700">
              To craft memorable events that exceed our clients&apos; expectations, leveraging
              creativity, expertise, and passion while building lasting relationships.
            </p>
          </article>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="glass-card p-6">
            <h3 className="font-display text-2xl text-brand-grape">Core Values</h3>
            <ul className="mt-4 grid gap-2 text-slate-700 sm:grid-cols-2">
              {coreValues.map((value) => (
                <li key={value} className="rounded-lg bg-white/70 px-3 py-2 font-medium">
                  {value}
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-card p-6">
            <h3 className="font-display text-2xl text-brand-grape">Occasions We Plan</h3>
            <ul className="mt-4 grid gap-2 text-slate-700 sm:grid-cols-2">
              {occasions.map((occasion) => (
                <li key={occasion} className="rounded-lg bg-white/70 px-3 py-2 font-medium">
                  {occasion}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
