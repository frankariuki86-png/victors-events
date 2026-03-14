import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";
import { clearToken } from "../lib/auth";

const serviceTemplate = {
  title: "",
  description: "",
  price: "",
  image_url: ""
};

const portfolioTemplate = {
  image_url: "",
  description: ""
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [serviceForm, setServiceForm] = useState(serviceTemplate);
  const [portfolioForm, setPortfolioForm] = useState(portfolioTemplate);

  const fetchAll = async () => {
    try {
      const [b, s, p] = await Promise.all([
        api.get("/bookings"),
        api.get("/services"),
        api.get("/portfolio")
      ]);
      setBookings(b.data || []);
      setServices(s.data || []);
      setPortfolio(p.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not fetch admin data");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const stats = useMemo(() => {
    const upcoming = bookings.filter((b) => new Date(b.date) >= new Date()).length;
    const revenue = bookings
      .filter((b) => b.payment_status === "paid")
      .reduce((total, item) => total + Number(item.services?.price || 0), 0);
    return {
      upcoming,
      total: bookings.length,
      revenue
    };
  }, [bookings]);

  const logout = () => {
    clearToken();
    navigate("/admin");
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { payment_status: status });
      toast.success("Booking updated");
      fetchAll();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      toast.success("Booking deleted");
      fetchAll();
    } catch {
      toast.error("Delete failed");
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    try {
      await api.post("/services", serviceForm);
      setServiceForm(serviceTemplate);
      toast.success("Service added");
      fetchAll();
    } catch {
      toast.error("Failed to add service");
    }
  };

  const deleteService = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      toast.success("Service deleted");
      fetchAll();
    } catch {
      toast.error("Delete failed");
    }
  };

  const editService = async (service) => {
    const title = window.prompt("Service title", service.title);
    if (!title) return;
    const description = window.prompt("Service description", service.description);
    if (!description) return;
    const price = window.prompt("Service price", service.price);
    if (!price) return;
    const image_url = window.prompt("Service image URL", service.image_url);
    if (!image_url) return;

    try {
      await api.put(`/services/${service.id}`, {
        title,
        description,
        price: Number(price),
        image_url
      });
      toast.success("Service updated");
      fetchAll();
    } catch {
      toast.error("Update failed");
    }
  };

  const addPortfolio = async (e) => {
    e.preventDefault();
    try {
      await api.post("/portfolio", portfolioForm);
      setPortfolioForm(portfolioTemplate);
      toast.success("Portfolio image added");
      fetchAll();
    } catch {
      toast.error("Failed to add portfolio item");
    }
  };

  const deletePortfolio = async (id) => {
    try {
      await api.delete(`/portfolio/${id}`);
      toast.success("Portfolio item deleted");
      fetchAll();
    } catch {
      toast.error("Delete failed");
    }
  };

  const editPortfolio = async (item) => {
    const image_url = window.prompt("Portfolio image URL", item.image_url);
    if (!image_url) return;
    const description = window.prompt("Description", item.description);
    if (!description) return;

    try {
      await api.put(`/portfolio/${item.id}`, {
        image_url,
        description
      });
      toast.success("Portfolio item updated");
      fetchAll();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <main className="min-h-screen bg-brand-cream p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-bold text-brand-grape">Victor's Events Admin Dashboard</h1>
          <button onClick={logout} className="rounded-full bg-brand-grape px-5 py-2 text-sm font-semibold text-white">Logout</button>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="glass-card p-4"><p className="text-sm">Upcoming Events</p><p className="text-2xl font-bold text-brand-grape">{stats.upcoming}</p></div>
          <div className="glass-card p-4"><p className="text-sm">Total Bookings</p><p className="text-2xl font-bold text-brand-grape">{stats.total}</p></div>
          <div className="glass-card p-4"><p className="text-sm">Revenue (Deposits)</p><p className="text-2xl font-bold text-brand-grape">KES {stats.revenue.toLocaleString()}</p></div>
        </section>

        <section className="glass-card overflow-x-auto p-4">
          <h2 className="mb-3 font-display text-2xl text-brand-grape">Bookings</h2>
          <table className="min-w-full text-left text-sm">
            <thead><tr className="border-b"><th>Name</th><th>Service</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bookings.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td>{item.services?.title || item.service_id}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.payment_status}</td>
                  <td className="space-x-2 py-2">
                    <button className="rounded bg-emerald-600 px-2 py-1 text-white" onClick={() => updateBookingStatus(item.id, "paid")}>Mark Paid</button>
                    <button className="rounded bg-red-600 px-2 py-1 text-white" onClick={() => deleteBooking(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card p-4">
            <h2 className="mb-3 font-display text-2xl text-brand-grape">Manage Services</h2>
            <form onSubmit={addService} className="grid gap-3">
              <input className="rounded border p-2" placeholder="Title" value={serviceForm.title} onChange={(e) => setServiceForm((s) => ({ ...s, title: e.target.value }))} required />
              <textarea className="rounded border p-2" placeholder="Description" value={serviceForm.description} onChange={(e) => setServiceForm((s) => ({ ...s, description: e.target.value }))} required />
              <input className="rounded border p-2" type="number" placeholder="Price" value={serviceForm.price} onChange={(e) => setServiceForm((s) => ({ ...s, price: e.target.value }))} required />
              <input className="rounded border p-2" placeholder="Image URL" value={serviceForm.image_url} onChange={(e) => setServiceForm((s) => ({ ...s, image_url: e.target.value }))} required />
              <button className="rounded bg-brand-plum px-4 py-2 text-white">Add Service</button>
            </form>
            <div className="mt-4 space-y-2 text-sm">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between rounded bg-white p-2">
                  <span>{service.title}</span>
                  <div className="space-x-2">
                    <button onClick={() => editService(service)} className="rounded bg-blue-600 px-2 py-1 text-white">Edit</button>
                    <button onClick={() => deleteService(service.id)} className="rounded bg-red-600 px-2 py-1 text-white">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <h2 className="mb-3 font-display text-2xl text-brand-grape">Manage Portfolio</h2>
            <form onSubmit={addPortfolio} className="grid gap-3">
              <input className="rounded border p-2" placeholder="Image URL" value={portfolioForm.image_url} onChange={(e) => setPortfolioForm((p) => ({ ...p, image_url: e.target.value }))} required />
              <input className="rounded border p-2" placeholder="Description" value={portfolioForm.description} onChange={(e) => setPortfolioForm((p) => ({ ...p, description: e.target.value }))} required />
              <button className="rounded bg-brand-plum px-4 py-2 text-white">Add Portfolio Item</button>
            </form>
            <div className="mt-4 space-y-2 text-sm">
              {portfolio.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded bg-white p-2">
                  <span>{item.description}</span>
                  <div className="space-x-2">
                    <button onClick={() => editPortfolio(item)} className="rounded bg-blue-600 px-2 py-1 text-white">Edit</button>
                    <button onClick={() => deletePortfolio(item.id)} className="rounded bg-red-600 px-2 py-1 text-white">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
