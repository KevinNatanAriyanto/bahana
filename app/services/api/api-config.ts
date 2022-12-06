import { CONFIG } from "@utils/config"

/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string,
  token: string,

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
  app_version: string
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  // url: API_URL || "https://jsonplaceholder.typicode.com",
  // url: "https://staging.thechefapps.com/v1",
  // url: "https://admin.thechefapps.com/v1",
  
  url: CONFIG.API_URL,
  token: "",
  timeout: 120000,
  app_version: "1.0"
}
