"use client"

// Local storage utilities with error handling
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {\
    if (typeof window === "undefined") return defaultValue
    
    try {\
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Failed to get ${key} from localStorage:`, error)\
      return defaultValue
    }
  },

  set: <T>(key: string, value: T): void => {\
    if (typeof window === "undefined") return
    
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Failed to set ${key} in localStorage:`, error)
    }
  },

  remove: (key: string): void => {\
    if (typeof window === "undefined") return
    
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error)
    }
  },

  clear: (): void => {\
    if (typeof window === "undefined") return
    
    try {
      localStorage.clear()
    } catch (error) {
      console.warn("Failed to clear localStorage:", error)
    }
  },
}

// Session storage utilities
export const sessionStorage = {\
  get: <T>(key: string, defaultValue: T): T => {\
    if (typeof window === "undefined") return defaultValue
    
    try {\
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Failed to get ${key} from sessionStorage:`, error)\
      return defaultValue
    }
  },

  set: <T>(key: string, value: T): void => {\
    if (typeof window === "undefined") return
    
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Failed to set ${key} in sessionStorage:`, error)
    }
  },

  remove: (key: string): void => {\
    if (typeof window === "undefined") return
    
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to remove ${key} from sessionStorage:`, error)
    }
  },\
}
