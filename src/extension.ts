import * as vscode from 'vscode'
import MarkSense from './marksense'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context) {
    vscode.languages.registerCompletionItemProvider('javascript', new MarkSenseCompletionItemProvider, '.')
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class MarkSenseCompletionItemProvider {

  private markSense: MarkSense

  constructor () {
    this.markSense = new MarkSense();
  }

  public provideCompletionItems (document, position, token) {
    const code = document.getText()
    this.markSense.generateSnippetTree(code)

    //const items = Object.keys(this.markSense.snippetTree).map(s => s.tokenizedCode);

    let myItem = new vscode.CompletionItem(`export const {{0:string}} => {\n  {{1:string}}\n}`, vscode.CompletionItemKind.Snippet)
    
    return Promise.resolve<vscode.CompletionItem[]>([myItem]);
	}

	// public resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken): any | Thenable<any> {
  // }
}