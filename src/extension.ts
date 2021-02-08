import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
    let cachedPanel: vscode.WebviewPanel;
    let disposable = vscode.commands.registerCommand("vs-dynamo.visualize", () => {
        console.log("Command vs-dynamo.visualize started");

        const mediaUri = vscode.Uri.joinPath(context.extensionUri, "media");
        if (cachedPanel == null) {
            cachedPanel = vscode.window.createWebviewPanel("dynamoViz", "Dynamo", vscode.ViewColumn.Active, {
                enableScripts: true,
                localResourceRoots: [mediaUri],
            });
        }
        updateViewHtml(cachedPanel, mediaUri);
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function updateViewHtml(panel: vscode.WebviewPanel, mediaUri: vscode.Uri) {
    const webviewHtmlUri = vscode.Uri.joinPath(mediaUri, "index.html");
    const webviewJsUri = vscode.Uri.joinPath(mediaUri, "webview.js");
    const webviewJsSrc = panel.webview.asWebviewUri(webviewJsUri);
    const styleCssUri = vscode.Uri.joinPath(mediaUri, "webview-style.css");
    const styleCssSrc = panel.webview.asWebviewUri(styleCssUri);
    panel.webview.html = getWebviewContent(panel.webview, webviewHtmlUri, webviewJsSrc, styleCssSrc);
}

function getWebviewContent(
    webview: vscode.Webview,
    htmlPath: vscode.Uri,
    jsPath: vscode.Uri,
    styleCssUri: vscode.Uri
): string {
    let contents = fs.readFileSync(htmlPath.fsPath, "utf-8");
    contents = contents.replace(/\${webviewScriptJs}/g, jsPath.toString());
    contents = contents.replace(/\${webview.cspSource}/g, webview.cspSource);
    contents = contents.replace(/\${styleCss}/g, styleCssUri.toString());
    const nonce = getNonce();
    contents = contents.replace(/\${nonce}/g, nonce);
    return contents;
}

function getNonce(): string {
    let text = "9mIk3vIHBpl3Nox4V8vaKPXqK3uApnpc";
    return text;
}
