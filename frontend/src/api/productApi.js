import axiosClient from "./axiosClient";

// GET /product/search/products -> ProductResponse[]
export async function getAllProducts() {
  const { data } = await axiosClient.get("/product/search/products");
  return data;
}

// GET /product/search/{productId} -> ProductResponse
export async function getProductById(productId) {
  const { data } = await axiosClient.get(`/product/search/${productId}`);
  return data;
}

// GET /product/seller/name?name= -> ProductResponse[]
export async function searchProductsByName(name) {
  const { data } = await axiosClient.get("/product/seller/name", {
    params: { name },
  });
  return data;
}

// GET /product/search/category?categoryId= -> ProductResponse[]
export async function searchProductsByCategory(categoryId) {
  const { data } = await axiosClient.get("/product/search/category", {
    params: { categoryId },
  });
  return data;
}

// GET /product/seller/category?categoryId= -> ProductResponse[]
export async function searchMyProductsByCategory(categoryId) {
  const { data } = await axiosClient.get("/product/seller/category", {
    params: { categoryId },
  });
  return data;
}

// GET /product/seller/products -> ProductResponse[] (current seller's own listings)
export async function getMyProducts() {
  const { data } = await axiosClient.get("/product/seller/products");
  return data;
}

// POST /product (multipart: product JSON part + images[]) -> Product
export async function addProduct({ product, images }) {
  const formData = new FormData();
  formData.append(
    "product",
    new Blob([JSON.stringify(product)], { type: "application/json" })
  );
  (images || []).forEach((file) => formData.append("images", file));

  const { data } = await axiosClient.post("/product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// PUT /product/{productId} -> ProductResponse
export async function updateProduct(productId, product) {
  const { data } = await axiosClient.put(`/product/${productId}`, product);
  return data;
}

// DELETE /product/{productId}
export async function removeProduct(productId) {
  await axiosClient.delete(`/product/${productId}`);
}
