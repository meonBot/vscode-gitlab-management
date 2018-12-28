import { GitlabSyncfusion } from "./gitlab";
import * as vscode from 'vscode';

export class GitlabToken {
    private static token: string;

    static getToken() {
        return this.token;
    }

    static setToken(data: string) {
        this.token = data;
    }

    static async validateToken(): Promise<boolean> {
        let data = await GitlabSyncfusion.getData('https://gitlab.syncfusion.com/api/v4/user');
        if (data && data.message && data.message === "401 Unauthorized") {
            vscode.window.showInformationMessage('Your token is invalid, Please set valid Access Token');
            return false;
        } else {
            return true;
        }
    }
}
