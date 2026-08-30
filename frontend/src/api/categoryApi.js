import axiosClient from "./axiosClient";

// GET /categories -> CategoryResponse[]
export async function getAllCategories() {
  const { data } = await axiosClient.get("/categories");
  return data;
}
