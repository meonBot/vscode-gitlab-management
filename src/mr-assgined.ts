import * as vscode from 'vscode';
import { GitlabSyncfusion } from './gitlab';
import { TreeData } from './repo-data';
import * as path from 'path';

export class MrAssigned implements vscode.TreeDataProvider<any> {
    onDidChangeTreeData?: vscode.Event<any> | undefined;

    readonly currentUser_url = 'https://gitlab.syncfusion.com/api/v4/user';
    readonly url = 'https://gitlab.syncfusion.com/api/v4/merge_requests?author_id={{id}}&state=opened';

    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
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

    async getChildren(element?: any): Promise<any> {
        let currentUser = await this.getCurrentUser();
        let url = this.url.replace('{{id}}', currentUser.id);
        return await GitlabSyncfusion.getData(url);
    }

    async getCurrentUser() {
        return await GitlabSyncfusion.getData(this.currentUser_url);
    }
}
