import { debuglog } from 'util';
import * as vscode from 'vscode';
import { MarkdownEditorProvider } from './markdownEditor';

export const extensionState: {
	activeDocument: vscode.TextDocument | undefined;
	activeWebviewPanel: vscode.WebviewPanel | undefined;
} = {
	// Need to manually track the current webview & document, since with a
	// CustomTextEditor, vscode.window.activeTextEditor is always undefined
	// https://github.com/microsoft/vscode/issues/102110#issuecomment-656868579
	activeDocument: undefined,
	activeWebviewPanel: undefined,
};

export function activate(context: vscode.ExtensionContext) {
	console.log('markdownEditor activated!');

	// Register our custom editor providers
	context.subscriptions.push(MarkdownEditorProvider.register(context));

	context.subscriptions.push(
		vscode.commands.registerCommand('markdownEditor.openCustomEditor', async (uri: vscode.Uri) => {
			handleOpenCustomEditor(uri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'markdownEditor.openWithCustomEditor',
			async (uri: vscode.Uri) => {
				handleOpenWithCustomEditor(uri);
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('markdownEditor.openDefaultEditor', async (uri: vscode.Uri) => {
			handleOpenDefaultEditor(uri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('markdownEditor.DEBUG', async (uri: vscode.Uri) => {
			console.log(
				JSON.stringify(
					{ state: extensionState, activeTextEditor: vscode.window.activeTextEditor },
					null,
					2
				)
			);
		})
	);

	// vscode.workspace.fs.writeFile(
	// 	vscode.Uri.file('test.txt'),
	// 	new TextEncoder().encode('test contents')
	// );
}

async function handleOpenDefaultEditor(uri: vscode.Uri) {
	console.log('handleOpenDefaultEditor');

	// Get URI of current markdown file which we keep track of in this extension as global state
	if (extensionState?.activeDocument?.uri === undefined) {
		vscode.window.showErrorMessage('extensionState?.activeDocument?.uri is undefined.');
	} else {
		// vscode.window.showInformationMessage('handleOpenDefaultEditor: ' + uri.toString());
		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		vscode.commands.executeCommand(
			'vscode.openWith',
			extensionState?.activeDocument?.uri,
			'default'
		);
	}
}

async function handleOpenCustomEditor(uri: vscode.Uri) {
	console.log('handleOpenCustomEditor');

	if (vscode.window.activeTextEditor === undefined) {
		vscode.window.showErrorMessage('No active text editor.');
	} else if (vscode.window.activeTextEditor.document.languageId !== 'markdown') {
		vscode.window.showErrorMessage('Active editor is not markdown.');
	} else {
		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		vscode.commands.executeCommand(
			'vscode.openWith',
			vscode.window.activeTextEditor.document.uri,
			MarkdownEditorProvider.viewType
		);
	}

	// TODO - Figure out how to open custom editor in current tab instead of new tab
	// Maybe try multiCommand.openFileInActiveEditor https://stackoverflow.com/a/60218926/3620725
	// The above code is a workaround (close current editor then open new editor)
	// vscode.commands.executeCommand(
	// 	'workbench.action.reopenWithEditor',
	// 	uri,
	// 	MarkdownEditorProvider.viewType
	// );
	//
}

async function handleOpenWithCustomEditor(uri: vscode.Uri) {
	console.log('handleOpenCustomEditor');

	if (uri === undefined) {
		vscode.window.showErrorMessage('Invalid URI.');
	} else {
		vscode.commands.executeCommand('vscode.openWith', uri, MarkdownEditorProvider.viewType);
	}

	// TODO - Figure out how to open custom editor in current tab instead of new tab
	// Maybe try multiCommand.openFileInActiveEditor https://stackoverflow.com/a/60218926/3620725
	// The above code is a workaround (close current editor then open new editor)
	// vscode.commands.executeCommand(
	// 	'workbench.action.reopenWithEditor',
	// 	uri,
	// 	MarkdownEditorProvider.viewType
	// );
	//
}
