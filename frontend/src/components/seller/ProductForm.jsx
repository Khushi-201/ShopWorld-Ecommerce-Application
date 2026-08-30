import React, { useEffect, useState } from "react";
import * as categoryApi from "../../api/categoryApi";
import Button from "../common/Button";

const EMPTY = {
  name: "",
  categoryId: "",
  quantity: 0,
  price: "",
  description: "",
};

export default function ProductForm({ initialValues, onSubmit, submitLabel = "Save" }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    categoryApi.getAllCategories().then(setCategories).catch(() => {});
  }, []);

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!values.name.trim() || !values.categoryId) {
      setError("Name and category are required.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        name: values.name.trim(),
        categoryId: Number(values.categoryId),
        quantity: Number(values.quantity) || 0,
        price: Number(values.price) || 0,
        description: values.description,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6">
      {error && <p className="text-sm text-danger">{error}</p>}

      <div>
        <label className="mb-1 block text-sm font-medium">Product name</label>
        <input
          className="input"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            className="input"
            value={values.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Price (₹)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="input"
            value={values.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Quantity in stock</label>
        <input
          type="number"
          min="0"
          className="input"
          value={values.quantity}
          onChange={(e) => handleChange("quantity", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          className="input min-h-[120px]"
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <Button type="submit" loading={saving}>
        {submitLabel}
      </Button>
    </form>
  );
}
