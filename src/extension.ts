'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MrAssigned } from './mr-assgined';
import { MrOpened } from './mr-opened';
import { RepositoryData } from './repo-data';
import * as path from 'path';
import * as child_process from 'child_process';
import { MrClosed } from './mr-closed';
import { MrMerged } from './mr-merged';
import { GitlabToken } from './gitlab-token';
import { setBranchArray } from './data-index';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "syncfusion-gitlab-management" is now active!');

    reload();

    setInterval(() => {
        reload();
    }, 50000);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', async () => {
        // const url = 'https://jsonplaceholder.typicode.com/posts';
        // let json = await GitlabSyncfusion.getData(url);
        // console.log(json);

        // let obj = new RepositoryData();
        // obj.setFavorite();
        // obj.refresh();

        let terminalPath = vscode.workspace.getConfiguration().get('terminal.integrated.shell.windows');
        let workspace: string =
            vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
        let stdOutput = child_process.execSync('git show --name-only --pretty="" b946f269',
            { cwd: workspace, shell: terminalPath as any });

        let files = stdOutput.toString().split('\n');

        // let fileUri =
        //     vscode.Uri.file('E:\\development\\source\\gitlab\\Projects\\Source\\ej2-list-components\\src\\list-view\\virtualization.ts');

        let fileUri = vscode.Uri.file(path.resolve(workspace + '/' + files[0]));
        vscode.commands.executeCommand<void>('vscode.diff', toGitUri(fileUri, "b946f269~"), toGitUri(fileUri, "b946f269"),
            "Diff: b946f269", { preview: true });
    });

    let setAccessToken = vscode.commands.registerCommand('extension.setAccessToken', async () => {
        // vscode.window.registerTreeDataProvider('gitlab-management-repo', new RepositoryData());
        // vscode.window.showInformationMessage('Refreshed Repositories');

        let response = await vscode.window.showInputBox({
            placeHolder: 'Enter your gitlab access token here',
            password: true,
            value: "YeZxsZsQq8hyUCPK-Ses"
        });

        if (response) {
            GitlabToken.setToken(response);
            vscode.window.showInformationMessage('Your gitlab token is updated');
        }
    });

    let setBranch = vscode.commands.registerCommand('extension.setBranch', async () => {

        let response = await vscode.window.showInputBox({
            placeHolder: 'Enter your current release branch name',
            value: 'release/16.4.0.1'
        });

        if (response) {
            setBranchArray(response);
        }
    });

    let repoRefresh = vscode.commands.registerCommand('extension.repoRefresh', async () => {
        vscode.window.registerTreeDataProvider('gitlab-management-repo', new RepositoryData());
        // vscode.window.showInformationMessage('Refreshed Repositories');
    });

    let mrOpened = vscode.commands.registerCommand('extension.mrOpened', async () => {
        vscode.window.registerTreeDataProvider('gitlab-management-pr-opened', new MrOpened());
        // vscode.window.showInformationMessage('Refreshed Merge Requests opened by me');
    });

    let mrAssigned = vscode.commands.registerCommand('extension.mrAssigned', async () => {
        vscode.window.registerTreeDataProvider('gitlab-management-pr-assigned', new MrAssigned());
        // vscode.window.showInformationMessage('Refreshed Merge Requests assigned to you');
    });

    let mrMerged = vscode.commands.registerCommand('extension.mrMerged', async () => {
        vscode.window.registerTreeDataProvider('gitlab-management-pr-merged', new MrMerged());
        // vscode.window.showInformationMessage('Refreshed Merge Requests merged by you');
    });

    let mrClosed = vscode.commands.registerCommand('extension.mrClosed', async () => {
        vscode.window.registerTreeDataProvider('gitlab-management-pr-closed', new MrClosed());
        // vscode.window.showInformationMessage('Refreshed Merge Requests closed by you');
    });

    context.subscriptions.push(disposable, repoRefresh, mrOpened, mrAssigned, mrMerged, mrClosed, setAccessToken,
        setBranch);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function toGitUri(uri: vscode.Uri, ref: string): vscode.Uri {
    return uri.with({
        scheme: 'git',
        path: uri.path,
        query: JSON.stringify({
            path: uri.fsPath,
            ref
        })
    });
}

export function reload() {
    vscode.window.registerTreeDataProvider('gitlab-management-repo', new RepositoryData());
    vscode.window.registerTreeDataProvider('gitlab-management-pr-opened', new MrOpened());
    vscode.window.registerTreeDataProvider('gitlab-management-pr-assigned', new MrAssigned());
    vscode.window.registerTreeDataProvider('gitlab-management-pr-merged', new MrMerged());
    vscode.window.registerTreeDataProvider('gitlab-management-pr-closed', new MrClosed());
}
