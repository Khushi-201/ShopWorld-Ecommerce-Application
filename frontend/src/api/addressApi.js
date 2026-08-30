import axiosClient from "./axiosClient";

// GET /addresses -> AddressResponse[]
export async function getMyAddresses() {
  const { data } = await axiosClient.get("/addresses");
  return data;
}

// POST /addresses -> AddressResponse
export async function addAddress(address) {
  const { data } = await axiosClient.post("/addresses", address);
  return data;
}

// PUT /addresses/{addressId} -> AddressResponse
export async function updateAddress(addressId, address) {
  const { data } = await axiosClient.put(`/addresses/${addressId}`, address);
  return data;
}

// DELETE /addresses/{addressId}
export async function deleteAddress(addressId) {
  await axiosClient.delete(`/addresses/${addressId}`);
}
