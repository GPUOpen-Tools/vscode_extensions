import * as vscode from 'vscode';
import {QuickPickItem} from 'vscode';
import * as child from 'child_process';

export abstract class RgaCommand 
{
    private sourcePath = '';
    private isaPath = '';
    private ilPath = '';
    private targetAsic = '';
    private selections = [];
    private output : vscode.OutputChannel;
    private context: vscode.ExtensionContext;

    private static RING_SIZE = 10; // Controls the number of custom arguments to cache.
    private customArguments = '';

    constructor (context: vscode.ExtensionContext, output : vscode.OutputChannel)
    {
        this.output = output;
        this.context = context;
    }

    protected getSourcePath() : string
    {
        return this.sourcePath;
    }

    protected getIsaPath() : string
    {
        return this.isaPath;
    }

    protected getIlPath() : string
    {
        return this.ilPath;
    }

    protected getTargetAsic() : string
    {
        return this.targetAsic;
    }

    protected getFirstSelection() : string
    {
        return this.selections[0];
    }

    protected getSelections() : string[]
    {
        return this.selections;
    }

    protected getOutputChannel() : vscode.OutputChannel
    {
        return this.output;
    }

    protected getContex() : vscode.ExtensionContext
    {
        return this.context;
    }

    protected getCustomArguments() : string
    {
        return this.customArguments;
    }

    protected initializeSourcePath() : boolean
    {
        this.sourcePath = '"' + vscode.window.activeTextEditor.document.uri.fsPath + '"';
        return true;
    }

    private initializeIsaPath() : boolean
    {
        this.isaPath = '"' + vscode.window.activeTextEditor.document.uri.fsPath + '.isa' + '"';
        return true;
    }

    private initializeIlPath() : boolean
    {
        this.ilPath = '"' + vscode.window.activeTextEditor.document.uri.fsPath + '.il' + '"';
        return true;
    }

    protected initializeSelections() : boolean
    {
        var selections = vscode.window.activeTextEditor.selections;
        var success = true;
        selections.forEach(selection => {
            var text = vscode.window.activeTextEditor.document.getText(selection);
            
            var regex = new RegExp('^[a-zA-Z][a-zA-Z0-9]*$');
            var match = text.match(regex);
            
            if(match === null || match.length !== 1)
            {
                vscode.window.showInformationMessage("Please select only whole words as entry points.")
                success = false;
            }
    
            this.selections.push(text);            
        });
        return success;
    }

    private initializeTargetAsic() : Thenable<any>
    {
        // TODO query from rga
        var picks =  ['gfx1010', 'gfx1012', 'gfx906', 'gfx902', 'gfx900', 'Ellesmere', 'Fiji', 
        'Baffin', 'Bonaire', '"Bristol Ridge"', 'Capeverde', 
        'Carrizo', 'Hainan', 'Hawaii', 
        'Iceland', 'Kalindi', 'Mullins', 'Oland', 
        'Pitcairn', 'Spectre', 'Spooky', 'Stoney', 
        'Tahiti', 'Tonga', 'gfx804']; 

        return this.showQuickPick(picks, "Target ASIC.", (pick) => {
                this.targetAsic = pick;
        });
    }

    private storePick(pick : string, key : string)
    {
        var picks = this.loadPicks(key);
        // Only keep a small number of picks here, so even if we use an array this should be reasonably fast.
        var found : boolean = false;
        var foundIndex = 0;
        for(var i = 0; i < picks.length; ++i)
        {
            if(picks[i] == pick)
            {
                found = true;
                foundIndex = i;
                break;
            }
        }

        var next = this.context.globalState.get<number>("RgaCommand." + key + ".next");
        if(!next)
        {
            next = 0;
        }

        if(!found)
        {
            if(picks.length < RgaCommand.RING_SIZE)
            {
                picks.push(pick);
                this.context.globalState.update("RgaCommand." + key, picks);
            }
            else
            {            
                // Need to replace the next pick in the ring.
                picks[next] = pick;
                next = (next + 1) % RgaCommand.RING_SIZE;
                this.context.globalState.update("RgaCommand." + key + ".next", next);
                this.context.globalState.update("RgaCommand." + key, picks);
            }
        }
        else
        {
            // Make sure the pick is moved to the front.
            var last = (next + picks.length - 1) % picks.length;
            var tmp = picks[last];
            picks[last] = picks[foundIndex];
            picks[foundIndex] = tmp;
            this.context.globalState.update("RgaCommand." + key, picks);
        }
    }

    private loadPicks(key : string) : Array<string>
    {
        var customArguments = this.context.globalState.get<Array<string>>("RgaCommand." + key);
        var picks = new Array<string>();
        if(customArguments)
        {
            picks = picks.concat(customArguments);
        }
        return picks;
    }

    private reorderPicks(picks : Array<string>, key : string) : Array<string>
    {
        // reorder the elements: last pick has to be on top
        var next = this.context.globalState.get<number>("RgaCommand." + key + ".next");
        if(!next)
        {
            next = 0;
        }
        
        var reorderedPicks = new Array<string>(picks.length);
        for(var i = 0; i < reorderedPicks.length; ++i)
        {
            var j = (next + picks.length - 1 - i) % picks.length;
            reorderedPicks[i] = picks[j];
        }
        return reorderedPicks;
    }

    protected pickCustomArguments(text : string) : Thenable<any>
    {
        return this.showQuickCustomPicks("customArguments", text, (pick) => {
            this.customArguments = pick;
            return true;
        });
    }

    protected initializeCustomArguments() : Thenable<any>
    {
        return this.pickCustomArguments("Custom arguments - Leave empty to skip.");
    }

    public async initializeCommand() : Promise<boolean>
    {
        this.initializeSelections(); 

        var methods = [];
        methods.push(
            () => {return this.initializeTargetAsic()},
            () => {return this.initializeSourcePath()},
            () => {return this.initializeIsaPath()},
            () => {return this.initializeIlPath()}
        );

        methods = methods.concat(this.getInitializingFunctions());
        
        methods.push(
            () => {return this.initializeCustomArguments()}
        );
        return this.callAll(methods);
    }  

    private async callAll(methods : (() => Thenable<any> | boolean)[])  : Promise<boolean>
    {
        for(var i = 0; i < methods.length; ++i)
        {
            if(! await methods[i]()) 
            {
                return false;
            }
        }
        return true; // Success
    }

    protected buildCommandString() 
    {
        var options = this.getOptions();
        var opts = new Array<string>();
        options.forEach((element) => opts.push(element[0] + ' ' + element[1]));
        var config = vscode.workspace.getConfiguration('rga');
        var rgaPath = config.get<string>('path');
        return rgaPath + ' ' + opts.join(' ');
    }

    protected async showQuickPick(picks : string[], hint : string, method : (pick) => void)
    {
        var promise = vscode.window.showQuickPick(picks, {placeHolder : hint});
        promise.then((pick) => {
            if(pick)
            {
                method(pick);              
                return true;
            }
            return false;
        });
        return promise;
    }

    // Shows quick picks but also lets the user insert custom strings. This is not currently supported by the VS Code API, thus we have to get creative :( 
    protected async showQuickInput(picks : string[], hint : string, method : (input) => void)
    {
        var disposables = [];
        try {
            var promise = new Promise((resolve, _) => {
                var quickPick = vscode.window.createQuickPick();
                quickPick.placeholder = hint;
                var resolved = false;
                var tmpPicks = [""].concat(picks);
                quickPick.items = tmpPicks.map(label => ({label}));
                quickPick.onDidChangeValue((value) => {
                    tmpPicks = [value].concat(picks);
                    quickPick.items = tmpPicks.map(label => ({label}));
                });
                quickPick.onDidAccept(() => {
                    resolved = true;
                    quickPick.hide();
                });
                quickPick.onDidHide(() => {
                    if(resolved) {
                        resolve(quickPick.selectedItems[0])
                    }
                    else {
                        resolve(undefined);
                    }
                });
                quickPick.show();
            });
            promise.then((pick : vscode.QuickPickItem) => {
                if(pick)
                {
                    method(pick.label);              
                    return true;
                }
                return false;
            });
            return promise;
        }
        finally {
            disposables.forEach(element => element.dispose());
        }
    }

    // Shows quick pick that lets the user also insert custom strings. Caches the last RING_SIZE custom arguments as additional quick picks.
    protected showQuickCustomPicks(key : string, hint : string, method : (pick) => boolean) : Thenable<any>
    {
        var picks = this.loadPicks(key);
        picks = this.reorderPicks(picks, key);
        return this.showQuickInput(picks, hint, (pick) => {
            if(method(pick) && pick !== "")
            {
                this.storePick(pick, key);
            }
        });
    }

    public execute() : void
    {
        var commandLine = this.buildCommandString();
        var rga : child.ChildProcess = child.exec(commandLine, (error: Error, stdout: string, stderr: string) => {
            this.output.show(true);
            this.output.appendLine(commandLine);
            this.output.appendLine(stdout);
        });
    }

    // Provide a way for the implementing command to add its own command line options.
    protected abstract getOptions() : Array<[string, string]>

    // Initializing code has to go here.
    protected abstract getInitializingFunctions() : Array<(() => Thenable<any> | boolean)>
}