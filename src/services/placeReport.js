import { getRequiredEnv } from "../config/env"

const API_BASE_URL = getRequiredEnv("VITE_SPRING_API_BASE_URL")

const normalizeReportsResponse = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.result)) return data.result
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.placeReports)) return data.placeReports

  return []
}

export const createPlaceReport = async (reportData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/place-reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportData),
  })

  if (!response.ok) {
    throw new Error("Failed to create place report.")
  }

  const text = await response.text()
  if (!text) return null

  return JSON.parse(text)
}

export const getMyPlaceReports = async (userId) => {
  if (!userId) {
    throw new Error("User id is required to load place reports.")
  }

  const params = new URLSearchParams({
    userId: String(userId),
  })

  const response = await fetch(
    `${API_BASE_URL}/api/v1/place-reports/my?${params}`,
  )

  if (!response.ok) {
    throw new Error("Failed to load place reports.")
  }

  const text = await response.text()
  if (!text) return []

  return normalizeReportsResponse(JSON.parse(text))
}
