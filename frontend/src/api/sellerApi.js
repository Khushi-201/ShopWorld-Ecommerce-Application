import axiosClient from "./axiosClient";

// POST /seller/apply -> SellerResponse
export async function applyAsSeller({
  businessName,
  businessType,
  businessAddress,
  description,
}) {
  const { data } = await axiosClient.post("/seller/apply", {
    businessName,
    businessType,
    businessAddress,
    description,
  });
  return data;
}

// GET /seller/seller/status/me -> raw string: PENDING | APPROVED | REJECTED | SUSPENDED
// Kept mainly as a fallback/manual refresh - the primary source of truth
// for routing is userApi.getAccess() (sellerStatus field), which is called
// once after login. Use this if you need to re-check status without a
// full access refresh (e.g. a "check status" button on the Apply page).
export async function getMySellerStatus() {
  const { data } = await axiosClient.get("/seller/seller/status/me");
  return data;
}
