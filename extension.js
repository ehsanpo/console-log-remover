const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.commands.registerCommand('console-log-remover.removeConsoleLogs', async () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showInformationMessage('No active editor!');
            return;
        }

        const document = editor.document;
        const text = document.getText();
        
        // Regex to match console.log statements
        const consoleLogRegex = /console\.log\s*\([^)]*\);?/g;
        
        const newText = text.replace(consoleLogRegex, '');
        
        // Create a WorkspaceEdit to perform the replacement
        const edit = new vscode.WorkspaceEdit();
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
        );
        
        edit.replace(document.uri, fullRange, newText);
        
        // Apply the edit
        await vscode.workspace.applyEdit(edit);
        
        // Format the document to clean up any extra spaces
        await vscode.commands.executeCommand('editor.action.formatDocument');
        
        vscode.window.showInformationMessage('Console.log statements removed!');
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};