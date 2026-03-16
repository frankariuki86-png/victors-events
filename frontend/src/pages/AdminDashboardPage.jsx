import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CalendarCheck2, BriefcaseBusiness, Wallet, LogOut, Pencil, Trash2, CheckCircle2 } from "lucide-react";
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

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

const statusStyles = {
  paid: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  failed: "bg-rose-100 text-rose-700 ring-1 ring-rose-200"
};

const statusDots = {
  paid: "bg-emerald-500",
  pending: "bg-amber-500",
  failed: "bg-rose-500"
};

const getStatusTone = (status) => {
  const normalized = String(status || "pending").toLowerCase();

  return {
    label: normalized,
    className: statusStyles[normalized] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    dotClassName: statusDots[normalized] || "bg-slate-500"
  };
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const serviceFileInputRef = useRef(null);
  const portfolioFileInputRef = useRef(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [serviceForm, setServiceForm] = useState(serviceTemplate);
  const [portfolioForm, setPortfolioForm] = useState(portfolioTemplate);
  const [serviceImageFile, setServiceImageFile] = useState(null);
  const [portfolioImageFile, setPortfolioImageFile] = useState(null);
  const [isUploadingServiceImage, setIsUploadingServiceImage] = useState(false);
  const [isUploadingPortfolioImage, setIsUploadingPortfolioImage] = useState(false);

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

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await api.post("/uploads/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return data?.image_url;
  };

  const addService = async (e) => {
    e.preventDefault();

    if (!serviceImageFile && !serviceForm.image_url.trim()) {
      toast.error("Add an image file or paste an image URL");
      return;
    }

    try {
      setIsUploadingServiceImage(true);
      const image_url = serviceImageFile
        ? await uploadImage(serviceImageFile)
        : serviceForm.image_url.trim();

      await api.post("/services", {
        ...serviceForm,
        image_url
      });

      setServiceForm(serviceTemplate);
      setServiceImageFile(null);
      if (serviceFileInputRef.current) serviceFileInputRef.current.value = "";
      toast.success("Service added");
      fetchAll();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add service");
    } finally {
      setIsUploadingServiceImage(false);
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

    if (!portfolioImageFile && !portfolioForm.image_url.trim()) {
      toast.error("Add an image file or paste an image URL");
      return;
    }

    try {
      setIsUploadingPortfolioImage(true);
      const image_url = portfolioImageFile
        ? await uploadImage(portfolioImageFile)
        : portfolioForm.image_url.trim();

      await api.post("/portfolio", {
        ...portfolioForm,
        image_url
      });

      setPortfolioForm(portfolioTemplate);
      setPortfolioImageFile(null);
      if (portfolioFileInputRef.current) portfolioFileInputRef.current.value = "";
      toast.success("Portfolio image added");
      fetchAll();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add portfolio item");
    } finally {
      setIsUploadingPortfolioImage(false);
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
    <main className="min-h-screen bg-brand-cream px-3 py-4 sm:px-4 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-5 md:space-y-6">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-card rounded-3xl p-4 sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-plum">Admin Panel</p>
              <h1 className="mt-1 font-display text-2xl font-bold leading-tight text-brand-grape sm:text-3xl">
                Victor&apos;s Events Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-600">Manage bookings, services, and portfolio updates from one place.</p>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-grape px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-plum"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <motion.article whileHover={{ y: -2 }} className="glass-card rounded-2xl p-4 transition">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Upcoming Events</p>
              <CalendarCheck2 size={18} className="text-brand-plum" />
            </div>
            <p className="mt-2 text-3xl font-bold text-brand-grape">{stats.upcoming}</p>
          </motion.article>

          <motion.article whileHover={{ y: -2 }} className="glass-card rounded-2xl p-4 transition">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Total Bookings</p>
              <BriefcaseBusiness size={18} className="text-brand-plum" />
            </div>
            <p className="mt-2 text-3xl font-bold text-brand-grape">{stats.total}</p>
          </motion.article>

          <motion.article whileHover={{ y: -2 }} className="glass-card rounded-2xl p-4 transition sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">Revenue (Deposits)</p>
              <Wallet size={18} className="text-brand-plum" />
            </div>
            <p className="mt-2 text-2xl font-bold text-brand-grape">KES {stats.revenue.toLocaleString()}</p>
          </motion.article>
        </motion.section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-plum/35 to-transparent" />

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
          className="glass-card rounded-3xl p-4 sm:p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl text-brand-grape">Bookings</h2>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{bookings.length} records</p>
          </div>

          {bookings.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-5 text-center text-sm text-slate-500">
              No bookings yet.
            </p>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {bookings.map((item) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.24 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-brand-grape">{item.name}</h3>
                        <p className="text-xs text-slate-500">{item.services?.title || item.service_id}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusTone(item.payment_status).className}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${getStatusTone(item.payment_status).dotClassName}`} />
                        {getStatusTone(item.payment_status).label}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">Date: {formatDate(item.date)}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                        onClick={() => updateBookingStatus(item.id, "paid")}
                      >
                        <CheckCircle2 size={14} />
                        Mark Paid
                      </button>
                      <button
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white"
                        onClick={() => deleteBooking(item.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Service</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="py-3 pr-4 font-medium text-slate-800">{item.name}</td>
                        <td className="py-3 pr-4 text-slate-600">{item.services?.title || item.service_id}</td>
                        <td className="py-3 pr-4 text-slate-600">{formatDate(item.date)}</td>
                        <td className="py-3 pr-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusTone(item.payment_status).className}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${getStatusTone(item.payment_status).dotClassName}`} />
                            {getStatusTone(item.payment_status).label}
                          </span>
                        </td>
                        <td className="space-x-2 py-3">
                          <button
                            className="rounded bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white"
                            onClick={() => updateBookingStatus(item.id, "paid")}
                          >
                            Mark Paid
                          </button>
                          <button
                            className="rounded bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white"
                            onClick={() => deleteBooking(item.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </motion.section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-plum/35 to-transparent" />

        <section className="grid gap-5 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35 }}
            className="glass-card rounded-3xl p-4 sm:p-5"
          >
            <h2 className="mb-3 font-display text-2xl text-brand-grape">Manage Services</h2>
            <form onSubmit={addService} className="grid gap-3">
              <input
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
                placeholder="Title"
                value={serviceForm.title}
                onChange={(e) => setServiceForm((s) => ({ ...s, title: e.target.value }))}
                required
              />
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
                placeholder="Description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm((s) => ({ ...s, description: e.target.value }))}
                required
              />
              <input
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
                type="number"
                placeholder="Price"
                value={serviceForm.price}
                onChange={(e) => setServiceForm((s) => ({ ...s, price: e.target.value }))}
                required
              />
              <input
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
                placeholder="Image URL (optional)"
                value={serviceForm.image_url}
                onChange={(e) => setServiceForm((s) => ({ ...s, image_url: e.target.value }))}
              />
              <input
                ref={serviceFileInputRef}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => setServiceImageFile(e.target.files?.[0] || null)}
              />
              <button
                disabled={isUploadingServiceImage}
                className="rounded-xl bg-brand-plum px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isUploadingServiceImage ? "Uploading image..." : "Add Service"}
              </button>
            </form>

            <div className="mt-4 space-y-2 text-sm">
              {services.map((service) => (
                <motion.article key={service.id} whileHover={{ y: -1 }} className="rounded-xl border border-slate-200 bg-white p-3 transition">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-slate-800">{service.title}</p>
                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <button
                        onClick={() => editService(service)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="glass-card rounded-3xl p-4 sm:p-5"
          >
            <h2 className="mb-3 font-display text-2xl text-brand-grape">Manage Portfolio</h2>
            <form onSubmit={addPortfolio} className="grid gap-3">
              <input
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
                placeholder="Image URL (optional)"
                value={portfolioForm.image_url}
                onChange={(e) => setPortfolioForm((p) => ({ ...p, image_url: e.target.value }))}
              />
              <input
                ref={portfolioFileInputRef}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => setPortfolioImageFile(e.target.files?.[0] || null)}
              />
              <input
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
                placeholder="Description"
                value={portfolioForm.description}
                onChange={(e) => setPortfolioForm((p) => ({ ...p, description: e.target.value }))}
                required
              />
              <button
                disabled={isUploadingPortfolioImage}
                className="rounded-xl bg-brand-plum px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isUploadingPortfolioImage ? "Uploading image..." : "Add Portfolio Item"}
              </button>
            </form>

            <div className="mt-4 space-y-2 text-sm">
              {portfolio.map((item) => (
                <motion.article key={item.id} whileHover={{ y: -1 }} className="rounded-xl border border-slate-200 bg-white p-3 transition">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-slate-800">{item.description}</p>
                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <button
                        onClick={() => editPortfolio(item)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => deletePortfolio(item.id)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
