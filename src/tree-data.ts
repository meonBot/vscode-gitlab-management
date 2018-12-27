import * as vscode from 'vscode';
import { GitlabSyncfusion } from './gitlab';

export class TreecategoryProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem
        | undefined>();

    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;
    data: any;
    url = [{
        label: 'Favorite Repository',
        url: 'https://gitlab.syncfusion.com/api/v4/groups/505?projects=all'
    }, {
        label: 'My Opened Pull Requests',
        url: 'https://gitlab.syncfusion.com/api/v4/merge_requests?state=opened'
    },
    {
        label: 'My Merged Pull Requests',
        url: 'https://gitlab.syncfusion.com/api/v4/merge_requests?state=merged'
    }];
    refresh() {
        this._onDidChangeTreeData.fire();
    }

    constructor() {
        console.log('tree-category');
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    async getChildren(element?: vscode.TreeItem | undefined): Promise<vscode.TreeItem[]> {

        if (!element) {
            // let category;
            // category = ['Favorite Repository', 'My Opened Pull Requests', 'My Merged Pull Requests'];
            let container: vscode.TreeItem[] = [{
                label: 'Favorite Repository',
                collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
            },
            {
                label: 'My Opened Pull Requests',
                collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
            },
            {
                label: 'My Merged Pull Requests',
                collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
            }];
            // let container = Array.from(category).map((collection) => {
            //     return new vscode.TreeItem(collection, vscode.TreeItemCollapsibleState.Expanded);
            // });
            return container;
        } else {
            let json = await this.getData(element);
            if (element.label === this.url[0].label) {
                let items: vscode.TreeItem[] = [];
                json.projects.forEach((repo: any) => {
                    const url = repo.web_url;
                    // const item = new vscode.TreeItem(repo.path_with_namespace, vscode.TreeItemCollapsibleState.None);
                    const treeData = new TreeData(repo.path_with_namespace, vscode.TreeItemCollapsibleState.None, {
                        title: '',
                        command: 'vscode.open',
                        arguments: [vscode.Uri.parse(url)],
                        tooltip: ''
                    });

                    items.push(treeData);
                });
                return items;
            } else if (element.label === this.url[1].label) {
                let items: vscode.TreeItem[] = [];
                json.forEach((data: any) => {
                    const url = data.web_url;
                    // const item = new vscode.TreeItem(data.title, vscode.TreeItemCollapsibleState.None);
                    const treeData = new TreeData(data.title, vscode.TreeItemCollapsibleState.None, {
                        title: '',
                        command: 'vscode.open',
                        arguments: [vscode.Uri.parse(url)],
                        tooltip: ''
                    });

                    items.push(treeData);
                });
                return items;
            } else if (element.label === this.url[2].label) {
                let items: vscode.TreeItem[] = [];
                json.forEach((data: any) => {
                    const url = data.web_url;
                    // const item = new vscode.TreeItem(data.title, vscode.TreeItemCollapsibleState.None);
                    const treeData = new TreeData(data.title, vscode.TreeItemCollapsibleState.None, {
                        title: '',
                        command: 'vscode.open',
                        arguments: [vscode.Uri.parse(url)],
                        tooltip: ''
                    });

                    items.push(treeData);
                });
                return items;
            }
            return [];
        }
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
        public readonly command: vscode.Command
    ) {
        super(label, collapsibleState);
    }
}
