// Form validation utilities
export const validators = {
  email: (email: string): string | null => {
    if (!email) return "Email is required"
    if (!/\S+@\S+\.\S+/.test(email)) return "Email is invalid"
    return null
  },

  password: (password: string): string | null => {
    if (!password) return "Password is required"
    if (password.length < 6) return "Password must be at least 6 characters"
    return null
  },

  confirmPassword: (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return "Please confirm your password"
    if (password !== confirmPassword) return "Passwords do not match"
    return null
  },

  location: (location: string): string | null => {
    if (!location.trim()) return "Location is required"
    if (location.trim().length < 3) return "Location must be at least 3 characters"
    return null
  },

  videoFile: (file: File | null): string | null => {
    if (!file) return "Video file is required"

    const acceptedTypes = [".mp4", ".mov", ".mkv"]
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

    if (!acceptedTypes.includes(fileExtension)) {
      return `Unsupported file type. Please use: ${acceptedTypes.join(", ")}`
    }

    const maxFileSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxFileSize) {
      return "File size must be less than 100MB"
    }

    return null
  },
}

// Generic form validation helper
export function validateForm<T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, (value: any) => string | null>,
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {}

  for (const [field, validator] of Object.entries(rules)) {
    const error = validator(data[field])
    if (error) {
      errors[field as keyof T] = error
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
