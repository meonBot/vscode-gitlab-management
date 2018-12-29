import { GitlabSyncfusion } from "./gitlab";
import * as vscode from 'vscode';
import { reload } from './extension';
export class GitlabToken {
    private static context: any;

    static getToken() {
        return this.context.globalState.get('gitlab_token', {}).key;
    }

    static setToken(data: string) {
        this.context.globalState.update('gitlab_token', { key: data });
        reload();
    }

    static async validateToken(): Promise<boolean> {
        let data = await GitlabSyncfusion.getData('https://gitlab.syncfusion.com/api/v4/user');
        if (data && data.message && data.message === "401 Unauthorized") {
            vscode.window.showInformationMessage('Your token is invalid, Please set valid gitlab access token');
            return false;
        } else {
            return true;
        }
    }

    static setContext(context: vscode.ExtensionContext) {
        this.context = context;
    }
}
