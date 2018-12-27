import { requestDataFromApi } from "./api-call";

export class GitlabSyncfusion {
    public static async getData(url: string) {
        let res = await requestDataFromApi(url);
        return res;
    }
}
