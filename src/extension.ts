'use strict'

import * as vscode from 'vscode'
import MarkSense from './marksense'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    vscode.languages.registerCompletionItemProvider('javascript', new MarkSenseCompletionItemProvider, '.')
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class MarkSenseCompletionItemProvider implements vscode.CompletionItemProvider {

  private markSense: MarkSense

  constructor () {
    this.markSense = new MarkSense();
  }

  public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> {
    const code = document.getText()
    this.markSense.generateSnippetTree(code)

    const items = Object.keys(this.markSense.snippetTree).map(snippet => snippet.tokenizedCode);

    let myItem = new vscode.CompletionItem(`export const {{0:string}} => {\n  {{1:string}}\n}`, vscode.CompletionItemKind.Snippet)
    return Promise.resolve<vscode.CompletionItem[]>([myItem]);
	}

	// public resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken): any | Thenable<any> {
  // }
}