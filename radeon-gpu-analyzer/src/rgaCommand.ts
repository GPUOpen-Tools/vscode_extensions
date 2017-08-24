import * as vscode from 'vscode';

export abstract class RgaCommand 
{
    private sourcePath = '';
    private isaPath = '';
    private ilPath = '';
    private targetAsic = '';
    private entryPoint = '';
    private terminal : vscode.Terminal;

    constructor (terminal : vscode.Terminal)
    {
        this.terminal = terminal;
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

    protected getEntryPoint() : string
    {
        return this.entryPoint;
    }

    protected getTerminal() : vscode.Terminal
    {
        return this.terminal;
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

    private initializeEntryPoint() : boolean
    {
        var selection = vscode.window.activeTextEditor.selection;
        var text = vscode.window.activeTextEditor.document.getText(selection);
        this.entryPoint = text;
        return true;
    }

    private initializeTargetAsic() : Thenable<any>
    {
        // TODO query from rga
        var picks =  ['gfx900', 'Ellesmere', 'Fiji', 
        'Baffin', 'Bonaire', '"Bristol Ridge"', 'Capeverde', 
        'Carrizo', 'Hainan', 'Hawaii', 
        'Iceland', 'Kalindi', 'Mullins', 'Oland', 
        'Pitcairn', 'Spectre', 'Spooky', 'Stoney', 
        'Tahiti', 'Tonga', 'gfx804']; 

        return this.showQuickPick(picks, (pick) => {
                this.targetAsic = pick;
        })
    }

    public async initializeCommand() : Promise<boolean>
    {
        var methods = this.getInitializingFunctions();
        methods.push(
            () => {return this.initializeEntryPoint()},
            () => {return this.initializeSourcePath()},
            () => {return this.initializeIsaPath()},
            () => {return this.initializeIlPath()},
            () => {return this.initializeTargetAsic()}   
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

    protected async showQuickPick(picks : string[], method : (pick) => void)
    {
        var promise = vscode.window.showQuickPick(picks);
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

    public execute() : void
    {
        var commandLine = this.buildCommandString();
        this.terminal.show(true);
        this.terminal.sendText(commandLine);
    }

    // Provide a way for the implementing command to add its own command line options.
    protected abstract getOptions() : Array<[string, string]>

    // Initializing code has to go here.
    protected abstract getInitializingFunctions() : Array<(() => Thenable<any> | boolean)>
}