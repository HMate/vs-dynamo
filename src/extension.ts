import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand("vs-dynamo.visualize", () => {
        console.log("Command vs-dynamo.visualize started");
        const mediaUri = vscode.Uri.joinPath(context.extensionUri, "media");
        const panel = vscode.window.createWebviewPanel("dynamoViz", "Dynamo", vscode.ViewColumn.Active, {
            enableScripts: true,
            localResourceRoots: [mediaUri],
        });

        const webviewHtmlUri = vscode.Uri.joinPath(mediaUri, "index.html");
        const webviewJsUri = vscode.Uri.joinPath(mediaUri, "webview.js");
        const webviewJsSrc = panel.webview.asWebviewUri(webviewJsUri);
        panel.webview.html = getWebviewContent(panel.webview, webviewHtmlUri, webviewJsSrc);
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(webview: vscode.Webview, htmlPath: vscode.Uri, jsPath: vscode.Uri): string {
    let contents = fs.readFileSync(htmlPath.fsPath, "utf-8");
    contents = contents.replace(/\${webviewScriptJs}/g, jsPath.toString());
    contents = contents.replace(/\${webview.cspSource}/g, webview.cspSource);
    const nonce = getNonce();
    contents = contents.replace(/\${nonce}/g, nonce);
    return contents;
}

function getNonce(): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
