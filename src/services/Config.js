import { isJson } from '../utils/Helper';

export const parseResponse = async response => {
    if (!response.Data) {
        return { ...response, Status: parseInt(response.Status) };
    }
    const data = await response.Data;
    if (isJson(data)) {
        return {
            ...response,
            Status: parseInt(response.Status),
            Data: JSON.parse(data),
        };
    } else {
        return { ...response, Status: parseInt(response.Status) };
    }
};

const base_url = {
    //baseUrl: 'https://panel.dkyss.es/api/'
    baseUrl: 'https://panel.dkyss.es/api/'
};

export const DOMAIN = base_url.baseUrl;