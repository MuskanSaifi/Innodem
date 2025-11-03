"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminPlans() {
  const emptyFeature = { text: "", included: true };
  const sections = ["topService", "website", "seo", "smo"];
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    highlighted: false,
    topService: [emptyFeature],
    website: [emptyFeature],
    seo: [emptyFeature],
    smo: [emptyFeature],
  });
  const [editingId, setEditingId] = useState(null);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/adminprofile/plans");
      const data = await res.json();
      if (res.ok) {
        setPlans(data);
      } else {
        toast.error(data.error || "Failed to load plans");
      }
    } catch (err) {
      toast.error("Error fetching plans");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFeatureChange = (section, idx, field, value) => {
    const updated = form[section].map((f, i) =>
      i === idx ? { ...f, [field]: field === "included" ? value === "true" : value } : f
    );
    setForm({ ...form, [section]: updated });
  };

  const addFeature = (section) => {
    setForm({ ...form, [section]: [...form[section], emptyFeature] });
  };

  const removeFeature = (section, idx) => {
    const updated = form[section].filter((_, i) => i !== idx);
    setForm({ ...form, [section]: updated });
  };

  const resetForm = () => {
    setForm({
      title: "",
      price: "",
      highlighted: false,
      topService: [emptyFeature],
      website: [emptyFeature],
      seo: [emptyFeature],
      smo: [emptyFeature],
    });
    setEditingId(null);
  };

  const savePlan = async (e) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const body = editingId ? { id: editingId, ...form } : form;

    try {
      const res = await fetch("/api/adminprofile/plans", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success(editingId ? "Plan updated successfully!" : "Plan created successfully!");
      resetForm();
      fetchPlans();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const editPlan = (plan) => {
    setEditingId(plan._id);
    setForm(plan);
    toast("Editing mode activated ✏️", { icon: "🟣" });
  };

  const deletePlan = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span>Are you sure you want to delete this plan?</span>
        <div className="flex justify-end gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`/api/adminprofile/plans?id=${id}`, {
                  method: "DELETE",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Delete failed");
                toast.success("Plan deleted successfully!");
                fetchPlans();
              } catch (err) {
                toast.error(err.message);
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 text-black px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />
      
      <h1 className="text-2xl font-bold mb-2">Manage Packages</h1>
      <p className="text-gray-600 mb-6 text-sm">
        Here you can create and manage all your DEM packages.
        Any package you add here will automatically appear on both the <b>App</b> and the <b>Website</b>.
        If you make a mistake while creating a package, don’t worry — you can easily update or modify it later.
      </p>

      {/* Form */}
      <form onSubmit={savePlan} className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Plan Title"
            value={form.title}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="highlighted"
              checked={form.highlighted}
              onChange={handleChange}
            />
            <span>Highlighted</span>
          </label>
        </div>

        {sections.map((section) => (
          <div key={section} className="mt-4">
            <h3 className="font-semibold mb-2 capitalize">{section}</h3>
            {form[section].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Feature text"
                  value={feature.text}
                  onChange={(e) =>
                    handleFeatureChange(section, idx, "text", e.target.value)
                  }
                  className="p-2 border rounded w-full"
                />
                <select
                  value={feature.included}
                  onChange={(e) =>
                    handleFeatureChange(section, idx, "included", e.target.value)
                  }
                  className="p-2 border rounded"
                >
                  <option value="true">✅</option>
                  <option value="false">❌</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeFeature(section, idx)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addFeature(section)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              + Add Feature
            </button>
          </div>
        ))}

        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editingId ? "Update Plan" : "Create Plan"}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl mt-6">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Title</th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Price</th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Highlighted</th>
              <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plans.map((p, idx) => (
              <tr
                key={p._id}
                className={`transition-all hover:bg-gray-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4 text-gray-800 font-medium">{p.title}</td>
                <td className="py-3 px-4 text-gray-700">₹{p.price}</td>
                <td className="py-3 px-4 text-center">
                  {p.highlighted ? (
                    <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span> Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-500">
                      <span className="w-2.5 h-2.5 bg-gray-400 rounded-full"></span> No
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center flex justify-center gap-2">
                  <button
                    onClick={() => editPlan(p)}
                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deletePlan(p._id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
