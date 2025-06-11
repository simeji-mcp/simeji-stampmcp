/**
 * Get API base URL based on current environment
 */
function getApiBaseUrl(): string {
    // Select URL based on environment
    // const env = process.env.NODE_ENV || 'development';
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'local') {
        return 'http://api-gke-sandbox.simeji.me';
    }
    return 'https://api-gke-online.simeji.me';
}

/**
 * API configuration
 */
export const API_BASE_URL = getApiBaseUrl();
export const STAMP_API_KEY = process.env.STAMP_API_KEY || '';
export const API_TIMEOUT = 120000;
export const NEED_PASTE = parseInt(process.env.NEED_PASTE || '0') as 0 | 1;

/**
 * Application information
 */
export const APP_NAME = 'StampMCP-Simeji';
export const APP_VERSION = '1.0.9';

/**
 * Tool configuration
 */
export const TOOL_CONFIG = {
    description: `Retrieve and return multiple emoticon/sticker images based on text meaning.Creates 1-20 varied images related to the input text.Images are automatically saved to a local folder and the folder opens automatically for easy access.`,
    promptDescription: "A short complete line as the input. e.g. 'I love you'.",
    promptMaxLength: 100,
    languageDescription: "The language of the input.such as 'en' for English, 'ja' for Japanese, 'zh' for Chinese, etc.",
};

/**
 * API encryption configuration
 */
export const ENCRYPTION_CONFIG = {
    enabled: true, // Whether to enable encryption
    key: process.env.ENCRYPTION_KEY || 'U9YbEBQfmlDfs8fX',
    iv: process.env.ENCRYPTION_IV || 'uwAUjj5AKkfOn2N8',
};

// Message texts
export const MESSAGES = {
    success: '申請中の内容は正常に処理され、以下の場所に保存されました：',
    apikey_invalid: '入力された APIキーに誤りがあります。申請されたAPIキーをご確認のうえ、再度お試しください', // Invalid API key
    apikey_use_control: 'ご利用のAPIキーはリクエスト上限に達しています。【time】後に再度ご利用いただけますので、しばらくお待ちください', // API key rate limited
    images_empty: '現在のリクエスト内容では、該当する結果が見つかりませんでした', // Images empty
    common_error: 'エラーが発生しました。しばらくしてから再度お試しください', // Other errors
    language_not_supported: '日本語で入力してください。他の言語での入力は対応しておりません。', // Language not supported
};

// Output current environment configuration information at startup (for debugging)
if (process.env.NODE_ENV !== 'production') {
    console.error(`[Config] Current environment: ${process.env.NODE_ENV || 'development'}`);
    console.error(`[Config] API address: ${API_BASE_URL}`);
    console.error(`[Config] Application key: ${STAMP_API_KEY}`);
    console.error(`[Config] Need paste: ${NEED_PASTE}`);
    console.error(`[Config] API encryption: ${ENCRYPTION_CONFIG.enabled ? 'Enabled' : 'Disabled'}`);

    // Environment information output (for debugging)
    console.error('--------- Environment Information ---------');
    console.error(`Node.js version: ${process.version}`);
    console.error(`Process ID: ${process.pid}`);
    console.error(`Platform: ${process.platform}`);
    console.error(`Working directory: ${process.cwd()}`);
} 