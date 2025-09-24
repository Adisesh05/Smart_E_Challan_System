// Application constants
export const APP_CONFIG = {
  name: "Traffic Violation Analysis",
  version: "1.0.0",
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
    timeout: 30000, // 30 seconds
  },
  upload: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    acceptedTypes: [".mp4", ".mov", ".mkv"],
    chunkSize: 1024 * 1024, // 1MB chunks for large file uploads
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
} as const

export const VIOLATION_TYPES = {
  RED_LIGHT: "Red Light Violation",
  SPEEDING: "Speeding",
  WRONG_LANE: "Wrong Lane",
  NO_HELMET: "No Helmet",
  MOBILE_PHONE: "Mobile Phone Usage",
  SEAT_BELT: "Seat Belt Violation",
  PARKING: "Parking Violation",
  SIGNAL_JUMP: "Signal Jump",
} as const

export const CHALLAN_STATUS = {
  ISSUED: "Issued",
  PAID: "Paid",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
} as const

export const VEHICLE_TYPES = {
  CAR: "Car",
  MOTORCYCLE: "Motorcycle",
  TRUCK: "Truck",
  BUS: "Bus",
  AUTO: "Auto Rickshaw",
} as const

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Session expired. Please login again.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  FILE_TOO_LARGE: "File size exceeds the maximum limit.",
  UNSUPPORTED_FILE: "Unsupported file format.",
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Logged in successfully",
  REGISTER_SUCCESS: "Account created successfully",
  UPLOAD_SUCCESS: "File uploaded successfully",
  ANALYSIS_SUCCESS: "Video analysis completed successfully",
  LOGOUT_SUCCESS: "Logged out successfully",
} as const
