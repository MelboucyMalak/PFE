ERROR_CODES = {

    # --- Land & Location (1xxx) ---
    "NOT_SUITABLE_LAND": {
        "code": 1001,
        "message": "Land is not suitable for planting."
    },
    "OUTSIDE_ALGERIA": {
        "code": 1002,
        "message": "Point is outside Algeria."
    },
    "INVALID_LAND_DATA": {
        "code": 1003,
        "message": "Land data is invalid or incomplete."
    },
    "MISSING_COORDINATES": {
        "code": 1004,
        "message": "Latitude or longitude is required."
    },
    "INVALID_COORDINATES": {
        "code": 1005,
        "message": "Coordinates are invalid."
    },
    "SESSION_ID_REQUIRED": {
        "code": 1006,
        "message": "session_id is required."
    },
    "SESSION_ID_INTEGER": {
        "code": 1007,
        "message": "session_id must be an integer."
    },
    "SESSION_ID_INVALID": {
        "code": 1008,
        "message": "session_id is invalid."
    },

    # --- Authentication (2xxx) ---
    "LOGIN_FAILED": {
        "code": 2001,
        "message": "Invalid email or password."
    },
    "LOGIN_INVALID_CREDENTIALS": {
        "code": 2001,
        "message": "Invalid username/email or password."
    },
    "TOKEN_NOT_FOUND": {
        "code": 2002,
        "message": "Authentication token not found."
    },
    "UNAUTHORIZED": {
        "code": 2003,
        "message": "Authentication credentials were not provided."
    },
    "FORBIDDEN": {
        "code": 2004,
        "message": "You do not have permission to perform this action."
    },
    "TOKEN_DOES_NOT_EXIST": {
        "code": 2005,
        "message": "Token does not exist."
    },

    # --- Users (3xxx) ---
    "USER_NOT_FOUND": {
        "code": 3001,
        "message": "User not found."
    },
    "EMAIL_ALREADY_EXISTS": {
        "code": 3002,
        "message": "Email already exists."
    },
    "USERNAME_ALREADY_EXISTS": {
        "code": 3003,
        "message": "Username already exists."
    },
    "INCORRECT_OLD_PASSWORD": {
        "code": 3004,
        "message": "Incorrect old password."
    },
    "USER_NOT_FOUND_BY_ID": {
        "code": 3005,
        "message": "User not found."
    },
    "USER_ID_REQUIRED": {
        "code": 3006,
        "message": "user_id is required."
    },
    "USER_ID_INTEGER": {
        "code": 3007,
        "message": "user_id must be an integer."
    },
    "USER_NOT_FOUND_BY_Email": {
        "code": 3005,
        "message": "No account found with this email."
    },
    # --- Validation (4xxx) ---
    "VALIDATION_ERROR": {
        "code": 4001,
        "message": "Submitted data is invalid."
    },
    "REQUIRED_FIELD_MISSING": {
        "code": 4002,
        "message": "Required field is missing."
    },
    "INVALID_NUMBER": {
        "code": 4003,
        "message": "Invalid numeric value."
    },

    # --- Crops & Climate (5xxx) ---
    "CROP_NOT_FOUND": {
        "code": 5001,
        "message": "Crop not found."
    },
    "CLIMATE_NOT_FOUND": {
        "code": 5002,
        "message": "Climate not found."
    },

    # --- External APIs (6xxx) ---
    "WEATHER_API_FAILED": {
        "code": 6001,
        "message": "Weather service unavailable."
    },
    "SOIL_API_FAILED": {
        "code": 6002,
        "message": "Soil service unavailable."
    },
    "GEE_FAILED": {
        "code": 6003,
        "message": "Earth Engine service unavailable."
    },

    # --- Password Reset (7xxx) ---
    "RESET_CODE_REQUIRED": {
        "code": 7001,
        "message": "Reset code is required."
    },
    "RESET_CODE_NOT_FOUND": {
        "code": 7002,
        "message": "Reset code not found."
    },
    "RESET_CODE_EXPIRED": {
        "code": 7003,
        "message": "Reset code has expired."
    },
    "RESET_CODE_INVALID": {
        "code": 7004,
        "message": "Reset code is invalid."
    },
    "RESET_CODE_MISSING": {
        "code": 7005,
        "message": "Reset code must be provided."
    },

    # --- Field Analysis (8xxx) ---
    "FIELD_MISSING_FIELDS": {
        "code": 8001,
        "message": "polygon_coords, surface_area_m2 and crop_recommendation are required."
    },
    "CROP_RECOMMENDATION_NOT_FOUND": {
        "code": 8002,
        "message": "Crop recommendation not found."
    },
    "SESSION_OUTSIDE_POLYGON": {
        "code": 8003,
        "message": "The field polygon must contain the session location."
    },
    "FIELD_ANALYSIS_NOT_FOUND": {
        "code": 8004,
        "message": "Field analysis not found."
    },
    "FERTILIZATION_MISSING_FIELDS": {
        "code": 8005,
        "message": "field_analysis, ph_entered, n_entered_ppm, p_entered_ppm and k_entered_ppm are required."
    },
    "INVALID_SURFACE_AREA": {
        "code": 8006,
        "message": "surface_area_m2 must be a positive number in hectares."
    },
    "NO_TEXTURE_DETECTED": {
        "code": 8007,
        "message": "No soil texture could be detected for the given polygon."
    },

    # --- Generic (9xxx) ---
    "UNKNOWN_ERROR": {
        "code": 9001,
        "message": "An unexpected error occurred."
    },

}