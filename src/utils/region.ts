import { getRegion } from "../api/index.js";

let countryname: string | null = null;

const handleGetRegion = async () => {
    try {
        const response = await getRegion();
        const apiData = response.data;
        if (apiData && apiData.errno === 0) {
            countryname = apiData.data.country || null;
            return;
        }
        countryname = null;
    } catch (error) {
        console.error('get region error:', error);
        countryname = null;
    }
}

const getCountryname = (): string | null => {
    return countryname;
}

export { handleGetRegion, getCountryname };