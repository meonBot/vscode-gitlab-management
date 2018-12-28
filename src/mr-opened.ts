import * as vscode from 'vscode';
import { GitlabSyncfusion } from './gitlab';
import { TreeData } from './repo-data';
import * as path from 'path';

export class MrOpened implements vscode.TreeDataProvider<any> {
    onDidChangeTreeData?: vscode.Event<any> | undefined;

    url = 'https://gitlab.syncfusion.com/api/v4/merge_requests?state=opened';

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
        let json = await GitlabSyncfusion.getData(this.url);
        return json;
    }
}
