import axiosClient from "./axiosClient";

// GET /order -> OrderResponse[]
export async function getMyOrders() {
  const { data } = await axiosClient.get("/order");
  return data;
}

// GET /order/{orderId} -> OrderResponse
export async function getOrderDetails(orderId) {
  const { data } = await axiosClient.get(`/order/${orderId}`);
  return data;
}

// POST /order { addressId } -> OrderResponse
// NOTE: no payment integration yet - this places the order directly.
// See Checkout.jsx for the dummy "Pay & Place Order" button.
export async function placeOrder({ addressId }) {
  const { data } = await axiosClient.post("/order", { addressId });
  return data;
}

// PUT /order/cancel/{orderId} -> OrderResponse
export async function cancelOrder(orderId) {
  const { data } = await axiosClient.put(`/order/cancel/${orderId}`);
  return data;
}

// PUT /order/return/{orderId} -> OrderResponse
export async function returnOrder(orderId) {
  const { data } = await axiosClient.put(`/order/return/${orderId}`);
  return data;
}
