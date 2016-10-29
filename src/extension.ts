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

  public provideCompletionItems (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> {
    const input = document.getText(new vscode.Range(position.line, position.character - 1, position.line, position.character))
    const code = document.getText()
    this.markSense.createSnippets(code)
    const items = this.markSense.search(input)

    const completionItems = items.map(item => new vscode.CompletionItem(item, vscode.CompletionItemKind.Snippet))

    return Promise.resolve<vscode.CompletionItem[]>(completionItems);
	}

	// public resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken): any | Thenable<any> {
  // }
}