'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitlabSyncfusion } from './gitlab';
import { TreecategoryProvider } from './tree-data';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "syncfusion-gitlab-management" is now active!');

    vscode.window.registerTreeDataProvider('gitlab-management', new TreecategoryProvider());

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', async () => {
        const url = 'https://jsonplaceholder.typicode.com/posts';
        let json = await GitlabSyncfusion.getData(url);
        console.log(json);

        let obj = new TreecategoryProvider();
        obj.setFavorite();
        obj.refresh();
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
