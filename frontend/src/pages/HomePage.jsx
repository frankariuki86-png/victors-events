import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CompanyProfileSection from "../components/CompanyProfileSection";
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
    description: "Quality tents and chair sets for weddings, graduations, and family functions.",
    price: 35000,
    image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Tables (Round & Rectangular)",
    description: "Round and rectangular table hire options tailored to your event layout.",
    price: 12000,
    image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Events Decorations",
    description: "Creative event styling and decor concepts that match your occasion.",
    price: 40000,
    image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Occasional Cakes Supplies",
    description: "Cake display stands, serving accessories, and occasion-ready cake supplies.",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    title: "Modern PA System",
    description: "Crystal-clear audio equipment with technician support.",
    price: 18000,
    image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    title: "Catering Services",
    description: "Buffet, plated, and custom menu services for all guest sizes.",
    price: 50000,
    image_url: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 7,
    title: "Honeymoon Bookings & Marriage Counselling",
    description: "Post-event honeymoon planning and marriage guidance support.",
    price: 25000,
    image_url: "https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 8,
    title: "Life & Artificial Flower Supplies",
    description: "Fresh and artificial flower options for ceremony and reception styling.",
    price: 14000,
    image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 9,
    title: "Events & Home Decor Shop",
    description: "Decor pieces and accessories for both events and beautiful home spaces.",
    price: 10000,
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
  }
];

const curatedServiceImages = {
  "tents & chairs": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
  "tables (round & rectangular)": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
  "events decorations": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
  "occasional cakes supplies": "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1200&q=80",
  "modern pa system": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
  "catering services": "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
  "honeymoon bookings & marriage counselling": "https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=1200&q=80",
  "life & artificial flower supplies": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
  "events & home decor shop": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
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
    description: "Elegant wedding reception setup with custom decor and floral styling."
  },
  {
    id: 2,
    image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    description: "Round and rectangular table styling for graduation and birthday celebrations."
  },
  {
    id: 3,
    image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
    description: "Outdoor marquee and tent layout for ruracios, koitos, and family get-togethers."
  },
  {
    id: 4,
    image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    description: "Bridal bouquet and ceremony styling for weddings and anniversary celebrations."
  },
  {
    id: 5,
    image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    description: "Occasional cake display and flower arrangements for thanksgiving ceremonies."
  },
  {
    id: 6,
    image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    description: "Corporate event setup with coordinated seating, decor, and PA support."
  },
  {
    id: 7,
    image_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
    description: "Garden aisle setup for ordination ceremonies and rites of passage."
  },
  {
    id: 8,
    image_url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
    description: "Live buffet and catering service for thanksgiving and community celebrations."
  },
  {
    id: 9,
    image_url: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80",
    description: "Night reception lighting and modern PA ambiance for unforgettable parties."
  },
  {
    id: 10,
    image_url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    description: "Guest lounge and decor concepts for birthdays and anniversary events."
  },
  {
    id: 11,
    image_url: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80",
    description: "Ceremony entrance styling with live and artificial flower supplies."
  },
  {
    id: 12,
    image_url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    description: "End-to-end event execution from decor shop supplies to guest dining flow."
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
      <CompanyProfileSection />
      <ServicesSection services={services} />
      <PortfolioSection portfolio={portfolio} />
      <BookingSection services={services} />
      <ContactSection />
      <Footer />
    </div>
  );
}
