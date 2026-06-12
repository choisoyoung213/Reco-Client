import { getRequiredEnv } from "../config/env";

const API_BASE_URL = getRequiredEnv("VITE_SPRING_API_BASE_URL");

export const getPlaces = async ({ type, latitude, longitude, district }) => {
  const params = new URLSearchParams({
    type,
    latitude: String(latitude),
    longitude: String(longitude),
  });

  if (district) {
    params.append("district", district);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/places/nearby?${params}`
  );

  if (!response.ok) {
    throw new Error("장소 정보를 불러오지 못했습니다.");
  }

  return response.json();
};
