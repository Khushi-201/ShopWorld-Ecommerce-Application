import axiosClient from "./axiosClient";

// GET /admin/pending -> SellerResponse[]
export async function getPendingApplications() {
  const { data } = await axiosClient.get("/admin/pending");
  return data;
}

// POST /admin/{sellerId}/approve -> SellerResponse
export async function approveSeller(sellerId) {
  const { data } = await axiosClient.post(`/admin/${sellerId}/approve`);
  return data;
}

// POST /admin/{sellerId}/reject -> SellerResponse
export async function rejectSeller(sellerId) {
  const { data } = await axiosClient.post(`/admin/${sellerId}/reject`);
  return data;
}

// PUT /admin/deliver/{orderId} -> OrderResponse
export async function markDelivered(orderId) {
  const { data } = await axiosClient.put(`/admin/deliver/${orderId}`);
  return data;
}
