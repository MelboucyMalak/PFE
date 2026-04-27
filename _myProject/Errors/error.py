# core/error_codes.py

ERROR_CODES = {
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
    "LOGIN_FAILED": {
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
    "LOGIN_INVALID_CREDENTIALS": {
        "code": 2001,
        "message": "Invalid username/email or password."
    },

    "TOKEN_DOES_NOT_EXIST": {
        "code": 2005,
        "message": "Token does not exist."
    },

    "USER_NOT_FOUND_BY_ID": {
        "code": 3005,
        "message": "User not found."
    },

    "RESET_CODE_INVALID": {
        "code": 7004,
        "message": "Reset code is invalid."
    },

    "RESET_CODE_MISSING": {
        "code": 7005,
        "message": "Reset code must be provided."
    },
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
    "CROP_NOT_FOUND": {
        "code": 5001,
        "message": "Crop not found."
    },

    "CLIMATE_NOT_FOUND": {
        "code": 5002,
        "message": "Climate not found."
    },
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
    "UNKNOWN_ERROR": {
        "code": 9001,
        "message": "An unexpected error occurred."
    }
}