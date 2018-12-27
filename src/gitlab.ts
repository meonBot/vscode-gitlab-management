import { requestDataFromApi } from "./api-call";

export class GitlabSyncfusion {
    public async getData() {
        const url = 'https://jsonplaceholder.typicode.com/posts';
        let res = await requestDataFromApi(url);
        return res;
    }
}
