const ErrorMessages = {
  INTERNAL_SERVER_ERROR: "Internal server error.",
  ROUTE_DOES_NOT_EXIST: "Route does not exist.",

  // Listings
  LISTING_NOT_FOUND: "Listing not found.",
  LISTING_NO_ACCESS: "User does.",
  LISTING_CREATION_FAILED: "Listing creation failed.",
  LISTING_NOT_FOUND_BY_ID: "Listing not found by ID.",
  LISTING_NO_LISTINGS_CREATED: "No listings have been created yet.",
  LISTING_NO_LISTINGS_FOUND: "No listings found.",
  USER_LISTINGS_NOT_FOUND: "User listings not found.",
  USER_LISTINGS_NO_ACCESS: "User listings do not exist.",
  USER_LISTINGS_NO_LISTINGS: "User has no listings.",
  LISTING_NOT_AUTHORIZED: "User is not authorized to access this listing.",

  // Users
  USER_MISSING_FIELDS:
    "Please provide a valid first name, last name, email, and password.",
  USER_EMAIL_IN_USE: "An account already exists with this email.",
  USER_NOT_FOUND: "User not found.",
  USER_CREATION_FAILED: "User creation failed.",
  USER_NO_USERS_CREATED: "No users have been created yet.",
  USER_NOT_FOUND_BY_ID: "User not found by ID.",

  // Authentication
  AUTH_INVALID_CREDENTIALS:
    "Invalid credentials: please ensure email and password match.",
  AUTH_NO_EMAIL_MATCH:
    "No account exists with this email, check email was entered correctly.",
  AUTH_NO_PASSWORD_MATCH:
    "Password does not match, check it was entered correctly.",
};

export default ErrorMessages;
