import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import * as productApi from "../../api/productApi";
import * as productImageApi from "../../api/productImageApi";
import SellerSidebar from "../../components/seller/SellerSidebar";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

export default function ProductImages() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newFiles, setNewFiles] = useState([]);

  function load() {
    setLoading(true);
    productApi
      .getProductById(productId)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }

  useEffect(load, [productId]);

  async function handleUpload() {
    if (newFiles.length === 0) return;
    setUploading(true);
    try {
      await productImageApi.addProductImages(productId, newFiles);
      toast.success("Images uploaded.");
      setNewFiles([]);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't upload images.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSetPrimary(imageId) {
    try {
      await productImageApi.setPrimaryImage(productId, imageId);
      toast.success("Primary image updated.");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't set primary image.");
    }
  }

  async function handleRemove(imageId) {
    if (!window.confirm("Remove this image?")) return;
    try {
      await productImageApi.removeImage(productId, imageId);
      toast.success("Image removed.");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't remove image.");
    }
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <SellerSidebar />

      <div className="flex-1">
        <h1 className="mb-4 font-display text-2xl font-semibold">
          Manage images {product ? `— ${product.name}` : ""}
        </h1>

        {loading ? (
          <Loader label="Loading images…" />
        ) : (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(product?.images || []).map((img) => (
                <div key={img.id} className="card overflow-hidden">
                  <div className="aspect-square bg-bg">
                    <img
                      src={img.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-2 text-xs">
                    {img.primary ? (
                      <span className="font-medium text-primary">Primary</span>
                    ) : (
                      <button
                        className="text-left text-primary hover:underline"
                        onClick={() => handleSetPrimary(img.id)}
                      >
                        Set as primary
                      </button>
                    )}
                    <button
                      className="text-left text-danger hover:underline"
                      onClick={() => handleRemove(img.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-6">
              <label className="mb-1 block text-sm font-medium">Add more images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
              />
              <Button
                className="mt-3"
                onClick={handleUpload}
                loading={uploading}
                disabled={newFiles.length === 0}
              >
                Upload
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
