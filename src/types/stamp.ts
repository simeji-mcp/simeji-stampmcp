/**
 * Stamp request parameters
 */
export interface StampRequestParams {
  /** Query text */
  query: string;
  /** Log ID for tracking requests */
  log_id: string;
  /** Whether to paste text: 0 means no, 1 means yes */
  need_paste: 0 | 1;
  /** API key */
  api_key: string;
}

/**
 * Single stamp item
 */
export interface StampItem {
  /** Image URL */
  url: string;
  /** Image ID */
  id: string;
  /** Image type (represents batch source or applicable scenario) */
  source_type: number;
  /** Image format */
  format: string;
  /** Source: semantic recall or fallback */
  source: 'semantic' | 'backoff';
}

/**
 * Stamp API response
 */
export interface StampResponse {
  /** Status code, non-zero indicates error */
  errno: number;
  /** Status message */
  msg: string;
  /** Response data */
  data: {
    stamps: StampItem[];
  };
}

export interface RegionData {
  country: string;
}

export interface RegionResponse {
  errno: number;
  errmsg: string;
  data: RegionData;
}