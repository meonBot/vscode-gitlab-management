import * as path from 'path';
import * as vscode from 'vscode';
import { getBranchArray } from './data-index';
import { GitlabSyncfusion } from './gitlab';
import { TreeData } from './repo-data';

export class MrAssigned implements vscode.TreeDataProvider<any> {
    onDidChangeTreeData?: vscode.Event<any> | undefined;

    readonly currentUser_url = 'https://gitlab.syncfusion.com/api/v4/user';
    readonly url = 'https://gitlab.syncfusion.com/api/v4/merge_requests?state=opened&assignee_id={{id}}';

    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
        if (!element.branch) {
            const treeItem = new TreeData(element.title, vscode.TreeItemCollapsibleState.None, {
                title: '',
                command: 'vscode.open',
                arguments: [vscode.Uri.parse(element.web_url)],
                tooltip: ''
            });
            treeItem.iconPath = {
                dark: path.join(path.resolve(__dirname, '../resources/dark'), 'icon-git.svg'),
                light: path.join(path.resolve(__dirname, '../resources/light'), 'icon-git.svg')
            };
            return treeItem;
        }
        let treeItem = new TreeData(element.branch, vscode.TreeItemCollapsibleState.Collapsed);
        treeItem.iconPath = {
            dark: path.join(path.resolve(__dirname, '../resources/dark'), 'icon-branch.svg'),
            light: path.join(path.resolve(__dirname, '../resources/light'), 'icon-branch.svg')
        };
        return treeItem;
    }

    async getChildren(element?: any): Promise<any> {
        let data = await GitlabSyncfusion.getData('https://gitlab.syncfusion.com/api/v4/user');
        if (data) {
            if (data.message) {
                vscode.window.showInformationMessage(`${data.message}, invalid token. Please set valid gitlab access token`);
                return [];
            }
            if(data.error) {
                vscode.window.showInformationMessage(data.error_description);
                return [];
            }
        }
        if (element) {
            return await this.getOnlyFromTargetBranch(element.branch);
        }

        return getBranchArray();

    }

    async getCurrentUser() {
        return await GitlabSyncfusion.getData(this.currentUser_url);
    }

    /**
     * @todo clear hardcoded assignee id and get from current user
     */
    async getOnlyFromTargetBranch(branch: string) {
        let currentUser = await this.getCurrentUser();
        let url = this.url.replace('{{id}}', currentUser.id);
        let data = await GitlabSyncfusion.getData(url);
        let final = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].target_branch === branch) {
                final.push(data[i]);
            }
        }
        return final;
    }
}
