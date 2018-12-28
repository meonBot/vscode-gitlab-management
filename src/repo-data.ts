import * as vscode from 'vscode';
import { GitlabSyncfusion } from './gitlab';
import * as path from 'path';

export class RepositoryData implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter();

    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
    data: any;
    url = [{
        label: 'Favorite Repository',
        // url: 'https://gitlab.syncfusion.com/api/v4/groups/505?projects=all'
        url: 'https://gitlab.syncfusion.com/api/v4/projects?starred=true'
    }
        // , {
        //     label: 'My Opened Pull Requests',
        //     url: 'https://gitlab.syncfusion.com/api/v4/merge_requests?state=opened'
        // },
        // {
        //     label: 'My Merged Pull Requests',
        //     url: 'https://gitlab.syncfusion.com/api/v4/merge_requests?state=merged'
        // }
    ];

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    constructor() {
        console.log('tree-category');
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    async getChildren(element?: vscode.TreeItem | undefined): Promise<any> {
        // let json = await this.getData(this.url[1]);

        // let items: vscode.TreeItem[] = [];
        // json.forEach((data: any) => {
        //     const url = data.web_url;
        //     // const item = new vscode.TreeItem(data.title, vscode.TreeItemCollapsibleState.None);
        //     const treeData = new TreeData(data.title, vscode.TreeItemCollapsibleState.None, {
        //         title: '',
        //         command: 'vscode.open',
        //         arguments: [vscode.Uri.parse(url)],
        //         tooltip: ''
        //     });

        //     items.push(treeData);
        // });
        // return items;
        let json = await this.getData(this.url[0]);
        if (element) {
            // let container: vscode.TreeItem[] = [{
            //     label: 'Favorite Repository',
            //     collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
            // },
            // {
            //     label: 'My Opened Pull Requests',
            //     collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
            // },
            // {
            //     label: 'My Merged Pull Requests',
            //     collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
            // }];
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
                        data[i].commit_url = (element as any).repo_details.web_url + '/commit/' + data[i].id
                        take15.push(data[i]);
                        continue;
                    }
                    break;
                }
                return take15;
            }


            // return container;
        }
        //if (element.label === this.url[0].label) {
        // let items: vscode.TreeItem[] = [];
        // json.projects.forEach((repo: any) => {
        //     const url = repo.web_url;
        //     // const item = new vscode.TreeItem(repo.path_with_namespace, vscode.TreeItemCollapsibleState.None);
        //     const treeData = new TreeData(repo.path_with_namespace, vscode.TreeItemCollapsibleState.None, {
        //         title: '',
        //         command: 'vscode.open',
        //         arguments: [vscode.Uri.parse(url)],
        //         tooltip: ''
        //     });

        //     items.push(treeData);
        // });

        return json;
        // return json.projects;
        // } else if (element.label === this.url[1].label) {
        //     let items: vscode.TreeItem[] = [];
        //     json.forEach((data: any) => {
        //         const url = data.web_url;
        //         // const item = new vscode.TreeItem(data.title, vscode.TreeItemCollapsibleState.None);
        //         const treeData = new TreeData(data.title, vscode.TreeItemCollapsibleState.None, {
        //             title: '',
        //             command: 'vscode.open',
        //             arguments: [vscode.Uri.parse(url)],
        //             tooltip: ''
        //         });

        //         items.push(treeData);
        //     });
        //     return items;
        // } else if (element.label === this.url[2].label) {
        //     let items: vscode.TreeItem[] = [];
        //     json.forEach((data: any) => {
        //         const url = data.web_url;
        //         // const item = new vscode.TreeItem(data.title, vscode.TreeItemCollapsibleState.None);
        //         const treeData = new TreeData(data.title, vscode.TreeItemCollapsibleState.None, {
        //             title: '',
        //             command: 'vscode.open',
        //             arguments: [vscode.Uri.parse(url)],
        //             tooltip: ''
        //         });

        //         items.push(treeData);
        //     });
        //     return items;
        // }
        return [];
    }

    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
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

// export class FileSystemProvider implements vscode.TreeDataProvider<Entry> {

//     private _onDidChangeFile: vscode.EventEmitter<vscode.FileChangeEvent[]>;

//     constructor() {
//         this._onDidChangeFile = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
//     }

//     get onDidChangeFile(): vscode.Event<vscode.FileChangeEvent[]> {
//         return this._onDidChangeFile.event;
//     }

//     // tree data provider

//     async getChildren(element?: Entry): Promise<Entry[]> {
//         if (element) {
//             const children = await this.readDirectory(element.uri);
//             return children.map(([name, type]) => ({ uri: vscode.Uri.file(path.join(element.uri.fsPath, name)), type }));
//         }

//         const workspaceFolder = vscode.workspace.workspaceFolders.filter(folder => folder.uri.scheme === 'file')[0];
//         if (workspaceFolder) {
//             const children = await this.readDirectory(workspaceFolder.uri);
//             children.sort((a, b) => {
//                 if (a[1] === b[1]) {
//                     return a[0].localeCompare(b[0]);
//                 }
//                 return a[1] === vscode.FileType.Directory ? -1 : 1;
//             });
//             return children.map(([name, type]) => ({ uri: vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, name)), type }));
//         }

//         return [];
//     }

//     getTreeItem(element: Entry): vscode.TreeItem {
//         const treeItem = new vscode.TreeItem(element.uri, element.type === vscode.FileType.Directory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
//         if (element.type === vscode.FileType.File) {
//             treeItem.command = { command: 'fileExplorer.openFile', title: "Open File", arguments: [element.uri], };
//             treeItem.contextValue = 'file';
//         }
//         return treeItem;
//     }
// }


// export class FileExplorer {

//     private fileExplorer: vscode.TreeView<Entry>;

//     constructor(context: vscode.ExtensionContext) {
//         const treeDataProvider = new FileSystemProvider();
//         this.fileExplorer = vscode.window.createTreeView('fileExplorer', { treeDataProvider });
//         vscode.commands.registerCommand('fileExplorer.openFile', (resource) => {
//             return this.openResource(resource);
//         });
//     }

//     private openResource(resource: vscode.Uri): void {
//         vscode.window.showTextDocument(resource);
//     }
// }

// interface Entry {
//     uri: vscode.Uri;
//     type: vscode.FileType;
// }
