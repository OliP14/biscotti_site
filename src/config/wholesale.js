/**
 * Shopify wholesale portal configuration.
 *
 * Existing approved customers are sent to Shopify.
 * New customers remain on cadagnolo.com to complete
 * the wholesale application.
 */

export const WHOLESALE_PORTAL_URL =
  import.meta.env.VITE_WHOLESALE_PORTAL_URL ||
  "https://ktmc3u-qx.myshopify.com";

export const WHOLESALE_SIGNUP_URL = "/wholesale-application";