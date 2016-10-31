import * as vscode from 'vscode'
import MarkSense from './marksense'

let markSense = new MarkSense()

export function activate(context: vscode.ExtensionContext) {
    vscode.languages.registerCompletionItemProvider('javascript', new MarkSenseCompletionItemProvider, '.')
    
    var watcher = vscode.workspace.createFileSystemWatcher("**/*.js");

    watcher.onDidChange((uri) => {
      const x = 1
    })
}

export function deactivate() {
  markSense = null
}

class MarkSenseCompletionItemProvider {

  public provideCompletionItems (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> {
    const input = document.getText(new vscode.Range(position.line, position.character - 1, position.line, position.character))
    const code = document.getText()
    markSense.createSnippets(code)
    const items = markSense.search(input)

    const completionItems = items.map(item => {
      let c = new vscode.CompletionItem(item.label, vscode.CompletionItemKind.Snippet)
      c.insertText = item.insertText
      c.filterText = item.filterText
      
      return c
    })
    return Promise.resolve<vscode.CompletionItem[]>(completionItems);
	}
}