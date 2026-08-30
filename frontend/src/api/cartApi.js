import axiosClient from "./axiosClient";

// GET /cart -> CartResponse
export async function getCart() {
  const { data } = await axiosClient.get("/cart");
  return data;
}

// POST /cart/items { productId, quantity } -> CartResponse
export async function addToCart({ productId, quantity }) {
  const { data } = await axiosClient.post("/cart/items", {
    productId,
    quantity,
  });
  return data;
}

// PUT /cart/items/{productId}?quantity= -> CartResponse
export async function updateQuantity(productId, quantity) {
  const { data } = await axiosClient.put(`/cart/items/${productId}`, null, {
    params: { quantity },
  });
  return data;
}

// DELETE /cart/items/{productId} -> CartResponse
export async function removeFromCart(productId) {
  const { data } = await axiosClient.delete(`/cart/items/${productId}`);
  return data;
}
