import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import * as productApi from "../../api/productApi";
import SellerSidebar from "../../components/seller/SellerSidebar";
import ProductForm from "../../components/seller/ProductForm";
import Loader from "../../components/common/Loader";

export default function ProductEditor({ mode }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isCreate = mode === "create";

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(!isCreate);
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (isCreate) return;
    productApi
      .getProductById(productId)
      .then((data) =>
        setInitialValues({
          name: data.name,
          categoryId: data.categoryId,
          quantity: data.quantity,
          price: data.price,
          description: data.description,
        })
      )
      .catch(() => setInitialValues(null))
      .finally(() => setLoading(false));
  }, [isCreate, productId]);

  async function handleSubmit(values) {
    if (isCreate) {
      // Backend requires at least one image when creating a product.
      if (images.length === 0) {
        setImageError("Add at least one product image.");
        throw new Error("images required");
      }
      const created = await productApi.addProduct({ product: values, images });
      toast.success("Product created.");
      navigate(`/seller/products/${created.id}/edit`);
    } else {
      await productApi.updateProduct(productId, values);
      toast.success("Product updated.");
      navigate("/seller/products");
    }
  }

  if (loading) return <Loader label="Loading product…" />;

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <SellerSidebar />

      <div className="flex-1">
        <h1 className="mb-4 font-display text-2xl font-semibold">
          {isCreate ? "Add a product" : "Edit product"}
        </h1>

        {isCreate && (
          <div className="card mb-4 p-6">
            <label className="mb-1 block text-sm font-medium">Product images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                setImages(Array.from(e.target.files || []));
                setImageError("");
              }}
            />
            {imageError && <p className="mt-2 text-sm text-danger">{imageError}</p>}
            <p className="mt-1 text-xs text-muted">At least one image is required.</p>
          </div>
        )}

        <ProductForm
          initialValues={initialValues || {}}
          onSubmit={handleSubmit}
          submitLabel={isCreate ? "Create product" : "Save changes"}
        />
      </div>
    </div>
  );
}
