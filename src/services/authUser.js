const parseStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))
  } catch {
    return null
  }
}

const normalizeUserId = (value) => {
  if (value === null || value === undefined) return null

  const stringValue = String(value).trim()
  if (!stringValue || stringValue === "null" || stringValue === "undefined") return null

  const numericUserId = Number(stringValue)
  return Number.isFinite(numericUserId) && numericUserId > 0 ? numericUserId : stringValue
}

export const getCurrentUserId = () => {
  const storedUser = parseStoredUser()
  const userId = storedUser?.id ?? storedUser?.userId ?? localStorage.getItem("userId")

  return normalizeUserId(userId)
}

export const hasLoginSession = () => {
  return Boolean(
    getCurrentUserId() ||
      parseStoredUser() ||
      localStorage.getItem("username") ||
      localStorage.getItem("accessToken"),
  )
}
