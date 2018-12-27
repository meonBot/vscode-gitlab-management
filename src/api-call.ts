const fetch = require('node-fetch');

export const requestDataFromApi = async (url: any) => {
    let res = await fetch(url, {
        method: 'get',
        headers: { 'PRIVATE-TOKEN': '2TLFxfKJPvns2_jGFyED' },
    });
    let json = await res.json();
    return json;
};
