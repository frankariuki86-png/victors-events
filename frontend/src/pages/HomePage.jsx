import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import PortfolioSection from "../components/PortfolioSection";
import BookingSection from "../components/BookingSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import api from "../lib/api";

const fallbackServices = [
  {
    id: 1,
    title: "Tents & Chairs",
    description: "Elegant and durable tent setups for indoor/outdoor events.",
    price: 35000,
    image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Catering",
    description: "Full buffet and plated menus customized for your guests.",
    price: 50000,
    image_url: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Wedding Gowns",
    description: "Bridal gown selection, fitting, and styling packages.",
    price: 20000,
    image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Decor",
    description: "Statement decor themes matching your vision and color palette.",
    price: 40000,
    image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    title: "PA Systems",
    description: "Crystal-clear audio equipment with technician support.",
    price: 18000,
    image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    title: "Honeymoon Booking",
    description: "Romantic honeymoon planning and travel coordination.",
    price: 25000,
    image_url: "https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=1200&q=80"
  }
];

const curatedServiceImages = {
  "tents & chairs": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
  catering: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
  "wedding gowns": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  decor: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
  "pa systems": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
  "honeymoon booking": "https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=1200&q=80"
};

function normalizeServiceItems(items) {
  return items.map((item) => {
    const key = String(item?.title || "").toLowerCase().trim();
    const curated = curatedServiceImages[key];

    return {
      ...item,
      image_url: curated || item.image_url || fallbackServices[0].image_url
    };
  });
}

const curatedPortfolio = [
  {
    id: 1,
    image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    description: "Elegant wedding reception setup with custom decor."
  },
  {
    id: 2,
    image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    description: "Styled dining tables for a premium celebration experience."
  },
  {
    id: 3,
    image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
    description: "Outdoor marquee and tent layout for large guest events."
  },
  {
    id: 4,
    image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    description: "Bridal bouquet and ceremony styling details."
  },
  {
    id: 5,
    image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    description: "Cake presentation and floral arrangement for weddings."
  },
  {
    id: 6,
    image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    description: "Corporate and social event seating with branded finishing."
  },
  {
    id: 7,
    image_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
    description: "Garden wedding aisle with romantic drape concepts."
  },
  {
    id: 8,
    image_url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
    description: "Buffet and live catering station service in action."
  },
  {
    id: 9,
    image_url: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80",
    description: "Night reception lighting and dance floor ambience."
  },
  {
    id: 10,
    image_url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    description: "Cocktail lounge area designed for guest comfort."
  },
  {
    id: 11,
    image_url: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80",
    description: "Ceremony entrance styling and photo-friendly backdrop."
  },
  {
    id: 12,
    image_url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    description: "Full event execution from decor to guest dining flow."
  }
];

const fallbackPortfolio = curatedPortfolio;

function normalizePortfolioItems(items) {
  const randomImagePattern = /picsum\.photos/i;

  return items.map((item, index) => {
    const curated = curatedPortfolio[index % curatedPortfolio.length];
    const hasRandomImage = !item?.image_url || randomImagePattern.test(item.image_url);
    const hasGenericDescription = !item?.description || /showcase\s*#?/i.test(item.description);

    return {
      ...item,
      image_url: hasRandomImage ? curated.image_url : item.image_url,
      description: hasGenericDescription ? curated.description : item.description
    };
  });
}

export default function HomePage() {
  const [services, setServices] = useState(fallbackServices);
  const [portfolio, setPortfolio] = useState(fallbackPortfolio);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Public homepage content is sourced from backend tables (Supabase-backed API).
        const [servicesRes, portfolioRes] = await Promise.all([
          api.get("/services"),
          api.get("/portfolio")
        ]);
        if (servicesRes.data?.length) setServices(normalizeServiceItems(servicesRes.data));
        if (portfolioRes.data?.length) setPortfolio(normalizePortfolioItems(portfolioRes.data));
      } catch {
        toast("Showing fallback content until backend is connected.", { icon: "i" });
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <ServicesSection services={services} />
      <PortfolioSection portfolio={portfolio} />
      <BookingSection services={services} />
      <ContactSection />
      <Footer />
    </div>
  );
}
