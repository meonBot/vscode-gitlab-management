import * as path from 'path';
import * as vscode from 'vscode';
import { GitlabSyncfusion } from './gitlab';

export class RepositoryData implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter();

    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
    data: any;
    url = [{
        label: 'Favorite Repository',
        // url: 'https://gitlab.syncfusion.com/api/v4/groups/505?projects=all'
        url: 'https://gitlab.syncfusion.com/api/v4/projects?starred=true'
    }
    ];

    refresh() {
        this._onDidChangeTreeData.fire();
    }


    async validateToken() {
        let data = await GitlabSyncfusion.getData('https://gitlab.syncfusion.com/api/v4/user');
        if (data && data.message && data.message === "401 Unauthorized") {
            vscode.window.showInformationMessage('Your token is invalid, Please set valid gitlab access token');
            return false;
        } else {
            return true;
        }
    }

    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    async getChildren(element?: vscode.TreeItem | undefined): Promise<any> {
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
        let json = await this.getData(this.url[0]);
        if (element) {

            if ((element as any).web_url) {
                let master = await GitlabSyncfusion.getData((element as any)._links.repo_branches + '/master');
                let development = await GitlabSyncfusion.getData((element as any)._links.repo_branches + '/development');
                master.syncId = "repo-branch";
                development.syncId = "repo-branch";
                return [
                    { branch_name: 'Master', data: master, repo_details: element },
                    { branch_name: 'Development', data: development, repo_details: element }
                ];
            }

            if ((element as any).branch_name === 'master' || (element as any).branch_name === 'development') {
                let data = await GitlabSyncfusion.getData((element as any).data._links.repo_branches +
                    '/' + (element as any).branch_name);
                return [
                    {
                        data: data,
                        repo_details: (element as any).data
                    }
                ];
            }

            if ((element as any).data) {
                (element as any).data.syncId = 'repo-branch';
                let id = (element as any).repo_details.id;
                // http://gitlab.syncfusion.com/api/v4/projects/1926/repository/commits?branch=master
                let url = `http://gitlab.syncfusion.com/api/v4/projects/${id}/repository/commits?branch=${(element as any).branch_name.toLowerCase()}`;
                let data: any = await GitlabSyncfusion.getData(url);
                let take15 = [];
                for (let i = 0; i < 15; i++) {
                    if (data[i]) {
                        data[i].data = (element as any).data;
                        data[i].syncId = 'repo-branch';
                        data[i].commit_url = (element as any).repo_details.web_url + '/commit/' + data[i].id;
                        take15.push(data[i]);
                        continue;
                    }
                    break;
                }
                return take15;
            }
        }
        return json;
    }

    getTreeItem(element: any): any {
        if (element.syncId === "repo-branch") {
            const treeItem = new TreeData(element.title, vscode.TreeItemCollapsibleState.None, {
                title: '',
                command: 'vscode.open',
                arguments: [vscode.Uri.parse(element.commit_url)],
                tooltip: ''
            });
            treeItem.iconPath = {
                dark: path.join(path.resolve(__dirname, '../resources/dark'), 'icon-git.svg'),
                light: path.join(path.resolve(__dirname, '../resources/light'), 'icon-git.svg')
            };
            return treeItem;
        }

        if (element.data && element.data.syncId === 'repo-branch') {
            const treeItem = new vscode.TreeItem(element.data.name, vscode.TreeItemCollapsibleState.Collapsed);
            treeItem.iconPath = {
                dark: path.join(path.resolve(__dirname, '../resources/dark'), 'icon-branch.svg'),
                light: path.join(path.resolve(__dirname, '../resources/light'), 'icon-branch.svg')
            };
            return treeItem;
        }

        const treeItem = new TreeData(element.path_with_namespace, vscode.TreeItemCollapsibleState.Collapsed, {
            title: '',
            command: 'vscode.open',
            arguments: [vscode.Uri.parse(element.web_url)],
            tooltip: ''
        });
        treeItem.iconPath = {
            dark: path.join(path.resolve(__dirname, '../resources/dark'), 'icon-repo.svg'),
            light: path.join(path.resolve(__dirname, '../resources/light'), 'icon-repo.svg')
        };
        return treeItem;

    }

    public setFavorite() {
        let items = [];
        for (let i = 0; i < 5; i++) {
            const item = new vscode.TreeItem(`rwgref ${i}`, vscode.TreeItemCollapsibleState.None);

            items.push(item);
        }
    }

    async getData(element: vscode.TreeItem) {
        for (let i = 0; i < this.url.length; i++) {
            if (element.label === this.url[i].label) {
                let json = await GitlabSyncfusion.getData(this.url[i].url);
                return json;
            }
        }
    }
}

export class TreeData extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }
}
