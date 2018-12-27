const fetch = require('node-fetch');

export const requestDataFromApi = async (url: any) => {
    let res = await fetch(url);
    let json = await res.json();
    return json;
};
