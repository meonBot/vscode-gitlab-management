import { GitlabToken } from "./gitlab-token";

const fetch = require('node-fetch');

export const requestDataFromApi = async (url: any) => {
    let res = await fetch(url, {
        method: 'get',
        headers: { 'PRIVATE-TOKEN': GitlabToken.getToken() },
    });
    let json = await res.json();
    return json;
};
