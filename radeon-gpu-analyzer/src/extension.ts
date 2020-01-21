'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { RgaCommand } from './rgaCommand';
import { Dx11Command } from './dx11Command';
import { Dx12Command } from './dx12Command';
import { VulkanCommand } from './vulkanCommand';
import { SpirvCommand } from './spirvCommand';
import { AmdilCommand } from './amdilCommand';

function openTextDocumentSilent(uri : vscode.Uri, viewColumn : vscode.ViewColumn) : void
{
    try {
        vscode.workspace.openTextDocument(uri.path).then((textDocument) => {
            if(!textDocument.isClosed)
            {
                vscode.window.showTextDocument(textDocument, viewColumn, true); 
            }
        }, _ => console.log("Could not open " + uri.fsPath));    
    } catch (error) {
        console.log("Could not open " + uri.fsPath);
    }
}

function openIsaFile(uri : vscode.Uri) : void
{
    var config = vscode.workspace.getConfiguration('rga');
    var isaColumn = config.get<number>('viewColumn.isa');
    if(isaColumn != -1) 
    {
        isaColumn = Math.min(Math.max(isaColumn, 1), 3);
        openTextDocumentSilent(uri, isaColumn);
    }
}

function openIlFile(uri : vscode.Uri) : void
{        
    var config = vscode.workspace.getConfiguration('rga');
    var ilColumn = config.get<number>('viewColumn.il');
    if(ilColumn != -1) 
    {
        ilColumn = Math.min(Math.max(ilColumn, 1), 3);
        openTextDocumentSilent(uri, ilColumn);
    }
}

function executeCommand(command : RgaCommand, replayMap : Map<string, RgaCommand>)
{
    let execute = async () => {
        if(await command.initializeCommand())
        {
            replayMap.set(vscode.window.activeTextEditor.document.uri.path, command);
            command.execute();            
        }
    } 
    execute();
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) 
{
    let replayMap = new Map<string, RgaCommand>();

    let ilFileSystemWatcher = vscode.workspace.createFileSystemWatcher("**/*.il", false, false, true);
    ilFileSystemWatcher.onDidCreate(openIlFile);
    ilFileSystemWatcher.onDidChange(openIlFile);
    let isaFileSystemWatcher = vscode.workspace.createFileSystemWatcher("**/*.isa", false, false, true);
    isaFileSystemWatcher.onDidCreate(openIsaFile); 
    isaFileSystemWatcher.onDidChange(openIsaFile); 
    
    // only create one output channel that is shared for each invocation.
    var output = vscode.window.createOutputChannel("RGA Output");

    let callRgaDisposableDx11 = vscode.commands.registerCommand('extension.callRga.dx11', (editor) => {
        var command = new Dx11Command(context, output);
        executeCommand(command, replayMap);
    })

    let callRgaDisposableDx12 = vscode.commands.registerCommand('extension.callRga.dx12', (editor) => {
        var command = new Dx12Command(context, output);
        executeCommand(command, replayMap);
    })

    let callRgaDisposableVulkan = vscode.commands.registerCommand('extension.callRga.vulkan', (editor) => {
        var command = new VulkanCommand(context, output);
        executeCommand(command, replayMap);
    })

    let callRgaDisposableSpirv = vscode.commands.registerCommand('extension.callRga.spirv', (editor) => {
        var command = new SpirvCommand(context, output);
        executeCommand(command, replayMap);
    })

    let callRgaDisposableAmdil = vscode.commands.registerCommand('extension.callRga.amdil', (editor) => {
        var command = new AmdilCommand(context, output);
        executeCommand(command, replayMap);
    })

    let replayDisposable = vscode.commands.registerCommand('extension.replayRga', (editor) => {
        var command = replayMap.get(vscode.window.activeTextEditor.document.uri.path);
        if(command)
        {
            command.execute();
        }
    })

    context.subscriptions.push(ilFileSystemWatcher);
    context.subscriptions.push(isaFileSystemWatcher);
    context.subscriptions.push(callRgaDisposableAmdil);
    context.subscriptions.push(callRgaDisposableSpirv);
    context.subscriptions.push(callRgaDisposableVulkan);
    context.subscriptions.push(callRgaDisposableDx11);
    context.subscriptions.push(callRgaDisposableDx12);
    context.subscriptions.push(replayDisposable);
}

// this method is called when your extension is deactivated.
export function deactivate() 
{
    // nothing to do here
}