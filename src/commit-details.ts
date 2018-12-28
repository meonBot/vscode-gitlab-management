// import * as child_process from 'child_process';
// import * as vscode from 'vscode';

// class CommitDetails {
//     static runProcess(command: string): Promise<string> {
//         let terminalPath = vscode.workspace.getConfiguration().get('terminal.integrated.shell.windows');
//         let workspace: string =
//             vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';

//         return new Promise((resolve, reject) => {
//             child_process.exec(command, { cwd: workspace, shell: terminalPath as any },
//                 (error, stdout, stderr) => {
//                     if (error) {
//                         reject([stdout, stderr]);
//                     } else {
//                         resolve(stdout);
//                     }
//                 });
//         });
//     }
// }
