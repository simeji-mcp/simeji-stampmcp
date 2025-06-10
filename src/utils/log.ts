import { APP_VERSION, NEED_PASTE } from "../config.js";
import { APP_NAME } from "../config.js";
import { getCountryname } from "./region.js";
import request from "./request.js";

export const logCodes: Record<string, number> = {
    pv: 1, // Page view
    request: 2, // Request
    response_success: 3, // Successful response
    response_error: 4, // Error response
    response_exception_error: 5, // Exception error response
    exec_save_images_error: 6, // Execution save images error
    exec_open_directory: 7, // Execution open directory
    exec_open_directory_error: 8, // Execution open directory error
};


export function log(code: number, data?: any) {
    const originData = Object.assign({
        service: APP_NAME,
        version: APP_VERSION,
        timestamp: Date.now(),
        ak: process.env.STAMP_API_KEY,
        countryname: getCountryname(),
        need_paste: NEED_PASTE,
    }, data);
    let params = Object.assign({
        vendorId: process.env.STAMP_API_KEY,
        production: 'wapplus',
        activity: 'mcp-stamp-sdk',
        code,
    }, {
        data: originData
    });
    process.env.DEBUG_LOG === 'true' && console.error('send log request', params);
    let base64Data = Buffer.from(JSON.stringify(params), 'utf-8').toString('base64');
    
    const requestConfig = {
        url: 'https://api.simeji.me/report/c/simeji/h5/data',
        method: 'post',
        timeout: 10000,
        data: base64Data,
        headers: {
            'content-type': 'application/json; charset=utf-8'
        }
    };
    
    return request(requestConfig)
        .then(response => {
            return response;
        })
        .catch(error => {
            process.env.DEBUG_LOG === 'true' && console.error('log request error:', {
                message: error.message,
                code: error.code,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data
                } : null
            });
            // 不抛出错误，避免影响主流程
            return null;
        });
};