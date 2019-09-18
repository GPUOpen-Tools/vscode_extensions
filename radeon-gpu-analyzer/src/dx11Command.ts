import * as vscode from 'vscode';
import { RgaCommand } from './rgaCommand';

export class Dx11Command extends RgaCommand
{
    private targetProfile = '';

    private initializeTargetProfile() : Thenable<any>
    {
        var picks = ['cs_5_0', 
                    'ps_5_0',  
                    'vs_5_0',  
                    'ds_5_0',  
                    'gs_5_0',  
                    'hs_5_0',  
                    'lib_5_0'];
        return super.showQuickPick(picks, "Shader model.", (pick) => {
                this.targetProfile = pick;
        })
    }

    protected getOptions()
    {
        var config = vscode.workspace.getConfiguration('rga');
        var userDefineOptions = config.get<string>('arguments.dx11');
        var options = new Array<[string, string]>(
            ['-s', 'dx11'],
            ['-c', this.getTargetAsic()],
            ['--isa', this.getIsaPath()],
            ['--il', this.getIlPath()],
            ['-f', this.getEntryPoint()],
            ['-p', this.targetProfile],
            ['', userDefineOptions],
            ['', this.getSourcePath()],
            ['', this.getCustomArguments()]
        );
        return options;
    }

    protected getInitializingFunctions()
    {
        var methods = [
            () => {return this.initializeEntryPoint()},
            () => {return this.initializeTargetProfile()} 
        ];
        return methods;
    }
}