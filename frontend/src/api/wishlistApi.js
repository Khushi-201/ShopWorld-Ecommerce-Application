import axiosClient from "./axiosClient";

// GET /wishlist -> WishlistItemResponse[]
export async function getWishlist() {
  const { data } = await axiosClient.get("/wishlist");
  return data;
}

// POST /wishlist/items { productId } -> WishlistItemResponse[]
export async function addToWishlist(productId) {
  const { data } = await axiosClient.post("/wishlist/items", { productId });
  return data;
}

// DELETE /wishlist/items/{productId} -> WishlistItemResponse[]
export async function removeFromWishlist(productId) {
  const { data } = await axiosClient.delete(`/wishlist/items/${productId}`);
  return data;
}
