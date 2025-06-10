import { getStampList } from './api/index.js';
import { STAMP_API_KEY, ENCRYPTION_CONFIG, MESSAGES, NEED_PASTE } from './config.js';
import type { StampRequestParams, StampItem } from './types/stamp.js';
import { log } from './utils/log.js';
import { logCodes } from './utils/log.js';

/**
 * Generate unique log ID
 * @returns Randomly generated log ID
 */
function generateLogId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Get stamp image data
 * @param prompt Prompt text
 * @param needPaste Whether to paste text (0: no, 1: yes)
 * @returns Array of stamp items
 */
export async function getStampImages(
    prompt: string
): Promise<{ images: StampItem[], error: string | null, logId: string }> {
    const logId = generateLogId();
    const startTime = Date.now(); // Record request start time
    log(logCodes.request, { prompt, logId });
    try {
        // Prepare request parameters
        const params: StampRequestParams = {
            query: prompt,
            log_id: logId,
            need_paste: NEED_PASTE,
            api_key: STAMP_API_KEY,
        };

        const response = await getStampList(params);
        const responseTime = Date.now() - startTime; // Calculate response time
        const apiData = response.data;
        // Check if request was successful
        if (apiData && apiData.errno !== 0) {
            log(logCodes.response_error, { 
                prompt, 
                logId, 
                error: apiData.msg, 
                errno: apiData.errno,
                responseTime // Add response time to log
            });
            switch (apiData.errno) {
                case 2201:
                    return { images: [], error: MESSAGES.apikey_invalid, logId };
                case 2202:
                    return { images: [], error: MESSAGES.images_empty, logId };
                case 2203: {
                    const freeTime = apiData.msg;
                    const unlockTime = new Date(Date.now() + Number(freeTime) * 1000);
                    const freeTimeString = unlockTime.toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    }).replace(/\//g, '-').replace(',', '');
                    return { images: [], error: MESSAGES.apikey_use_control.replace('time', freeTimeString), logId };
                }
                default: {
                    return { images: [], error: MESSAGES.common_error, logId };
                }
            }
        }
        const stamps = apiData.data.stamps || [];
        // Log successful response with response time
        log(logCodes.response_success, { 
            prompt, 
            logId, 
            resultCount: stamps.length,
            responseTime, // Add response time to log
            stamps: stamps.length > 0 ? stamps.map((stamp: StampItem) => stamp.id) : null
        });
        // Return complete array of stamp items
        return { images: stamps, error: stamps.length > 0 ? null : MESSAGES.common_error, logId };
    } catch (error) {
        console.error(error);
        const responseTime = Date.now() - startTime; // Calculate response time for error cases
        const errorMessage = error instanceof Error ? error.message : String(error);
        // Log error response with response time
        log(logCodes.response_exception_error, { 
            prompt, 
            logId, 
            error: errorMessage,
            responseTime // Add response time to log
        });
        return { images: [], error: errorMessage || MESSAGES.common_error, logId };
    }
}
