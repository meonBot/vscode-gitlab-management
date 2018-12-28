import * as vscode from 'vscode';
import * as path from 'path';

function createResourceUri(relativePath: string): vscode.Uri {
    if (vscode.workspace.rootPath) {
        const absolutePath = path.join(vscode.workspace.rootPath, relativePath);
        return vscode.Uri.file(absolutePath);
    }
    return vscode.Uri.file('');
}

const gitSCM = vscode.scm.createSourceControl('git', 'Git');

export const index = gitSCM.createResourceGroup('index', 'Index');
index.resourceStates = [
    { resourceUri: createResourceUri('package.json') }
];

export const workingTree = gitSCM.createResourceGroup('workingTree', 'Changes');
workingTree.resourceStates = [
    { resourceUri: createResourceUri('package.json') }
];
