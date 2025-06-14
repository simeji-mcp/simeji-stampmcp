import request from '../utils/request.js';
import { ENCRYPTION_CONFIG } from '../config.js';
import { RegionResponse, StampRequestParams, StampResponse } from '../types/stamp.js';

export const getStampList = (params: string | StampRequestParams) => {
    return request<StampResponse>({
        url: '/mcp/tool/getStampList',
        method: 'post',
        data: params,
    });
};

export const getRegion = () => {
    return request<RegionResponse>({
        url: '/mcp/tool/loca',
        method: 'get',
    });
};