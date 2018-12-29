'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { setBranchArray } from './data-index';
import { GitlabToken } from './gitlab-token';
import { MrAssigned } from './mr-assigned';
import { MrClosed } from './mr-closed';
import { MrMerged } from './mr-merged';
import { MrOpened } from './mr-opened';
import { RepositoryData } from './repo-data';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "syncfusion-gitlab-management" is now active!');

    GitlabToken.setContext(context);

    reload();

    setInterval(() => {
        reload();
    }, 50000);

    let setAccessToken = vscode.commands.registerCommand('extension.setAccessToken', async () => {
        let response = await vscode.window.showInputBox({
            placeHolder: 'Enter your gitlab access token here',
            password: true
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

    context.subscriptions.push(repoRefresh, mrOpened, mrAssigned, mrMerged, mrClosed, setAccessToken,
        setBranch);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

export function reload() {
    vscode.window.registerTreeDataProvider('gitlab-management-repo', new RepositoryData());
    vscode.window.registerTreeDataProvider('gitlab-management-pr-opened', new MrOpened());
    vscode.window.registerTreeDataProvider('gitlab-management-pr-assigned', new MrAssigned());
    vscode.window.registerTreeDataProvider('gitlab-management-pr-merged', new MrMerged());
    vscode.window.registerTreeDataProvider('gitlab-management-pr-closed', new MrClosed());
}
