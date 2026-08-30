import axiosClient from "./axiosClient";

// POST /seller/products/{productId}/images (multipart, images[]) -> ProductImageResponse[]
//
// NOTE: the current OpenAPI spec declares `images` as a query param of type
// binary[], which browsers/axios can't actually send (files must go in a
// multipart body part, not a query string). This call sends them as a
// multipart form field named "images" - ask the backend to accept the part
// this way (matching how POST /product already does it) rather than as a
// query parameter.
export async function addProductImages(productId, files) {
  const formData = new FormData();
  (files || []).forEach((file) => formData.append("images", file));

  const { data } = await axiosClient.post(
    `/seller/products/${productId}/images`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

// PUT /seller/products/{productId}/images/{imageId}/primary -> ProductImageResponse
export async function setPrimaryImage(productId, imageId) {
  const { data } = await axiosClient.put(
    `/seller/products/${productId}/images/${imageId}/primary`
  );
  return data;
}

// DELETE /seller/products/{productId}/images/{imageId}
export async function removeImage(productId, imageId) {
  await axiosClient.delete(
    `/seller/products/${productId}/images/${imageId}`
  );
}
