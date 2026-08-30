import axiosClient, { tokenStore } from "./axiosClient";

// POST /auth/register -> User
export async function register({ name, email, password, contactNo }) {
  const { data } = await axiosClient.post("/auth/register", {
    name,
    email,
    password,
    contactNo,
  });
  return data;
}

// POST /auth/login -> { accessToken }
// Stores the token on success; caller is responsible for following up with
// userApi.getAccess() to learn isAdmin/sellerStatus before routing.
export async function login({ email, password }) {
  const { data } = await axiosClient.post("/auth/login", { email, password });
  if (data?.accessToken) {
    tokenStore.set(data.accessToken);
  }
  return data;
}

export function logout() {
  tokenStore.clear();
}
