/**
 * Wholesale portal destination.
 *
 * During setup, set VITE_WHOLESALE_PORTAL_URL to the URL Orderspace gives you,
 * for example: https://cadagnolo.orderspace.com
 *
 * Once the custom domain is configured in Orderspace/DNS, you can remove the
 * environment variable and use the production default below.
 */
export const WHOLESALE_PORTAL_URL =
  import.meta.env.VITE_WHOLESALE_PORTAL_URL || "https://cadagnoloskitchen.orderspace.com";

export const WHOLESALE_SIGNUP_URL =
  "https://cadagnoloskitchen.orderspace.com/signup";