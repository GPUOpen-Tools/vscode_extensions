import * as vscode from 'vscode';
import { RgaCommand } from './rgaCommand';

export class HlslCommand extends RgaCommand
{
    private targetProfile = '';

    private initializeTargetProfile() : Thenable<any>
    {
        var picks = ['cs_5_0', 'cs_5_1', 'ps_5_0', 'ps_5_1', 'vs_5_0', 'vs_5_1', 'ds_5_0', 'ds_5_1', 'gs_5_0', 'gs_5_1', 'hs_5_0', 'hs_5_1', 'lib_5_0', 'lib_5_1'];
        return super.showQuickPick(picks, (pick) => {
                this.targetProfile = pick;
        })
    }

    protected getOptions()
    {
        var config = vscode.workspace.getConfiguration('rga');
        var userDefineOptions = config.get<string>('arguments.hlsl');
        var options = new Array<[string, string]>(
            ['-s', 'hlsl'],
            ['-c', this.getTargetAsic()],
            ['--isa', this.getIsaPath()],
            ['--il', this.getIlPath()],
            ['-f', this.getEntryPoint()],
            ['-p', this.targetProfile],
            ['', userDefineOptions],
            ['', this.getSourcePath()]
        );
        return options;
    }

    protected getInitializingFunctions()
    {
        var methods = [
            () => {return this.initializeTargetProfile()} 
        ];
        return methods;
    }
}