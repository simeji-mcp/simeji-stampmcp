// 获取ip地区的代码

import { getRegion } from "../api/index.js";



// 保存地区信息的常量
let countryname: string | null = null;

const handleGetRegion = async () => {
    try {
        const response = await getRegion();
        const apiData = response.data;
        // 检查响应是否成功
        if (apiData && apiData.errno === 0) {
            // 解码并保存到常量中
            countryname = apiData.data.country || null;
            return;
        }
        countryname = null;
    } catch (error) {
        console.error('获取地区信息异常:', error);
        countryname = null;
    }
}

// 获取已保存的地区信息
const getCountryname = (): string | null => {
    return countryname;
}

export { handleGetRegion, getCountryname };