import axiosClient from "./axiosClient";

// GET /users/me -> UserResponse
export async function getProfile() {
  const { data } = await axiosClient.get("/users/me");
  return data;
}

// PUT /users/me -> UserResponse
export async function updateProfile({ name, contactNo }) {
  const { data } = await axiosClient.put("/users/me", { name, contactNo });
  return data;
}

// GET /users/me/access -> { email, name, isAdmin, sellerStatus }
// Live, server-computed permissions snapshot. Called once right after login
// (and once on app load if a token already exists) - this is what decides
// whether the user sees "Apply as Seller", the Seller Dashboard, or the
// Admin Dashboard. Never derive this from the JWT; it goes stale.
export async function getAccess() {
  const { data } = await axiosClient.get("/users/me/access");
  return data;
}
