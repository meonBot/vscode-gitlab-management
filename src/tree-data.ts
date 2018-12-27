import * as vscode from 'vscode';

export class TreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    onDidChangeTreeData?: vscode.Event<vscode.TreeItem | null | undefined> | undefined;

    constructor() {
        console.log('tree-data');
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: vscode.TreeItem | undefined): vscode.ProviderResult<vscode.TreeItem[]> {
        let items = [];
        for (let i = 0; i < 5; i++) {
            const item = new vscode.TreeItem(`test ${i}`, vscode.TreeItemCollapsibleState.None);
            items.push(item);
        }
        return items;
    }
}
