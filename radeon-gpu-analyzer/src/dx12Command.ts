import * as vscode from 'vscode';
import { RgaCommand } from './rgaCommand';

export class Dx12Command extends RgaCommand
{
    private targetProfile = '';

    private initializeTargetProfile() : Thenable<any>
    {
        var picks = ['cs_6_0', 'cs_6_1', 'cs_6_2', 'cs_6_3', 'cs_6_4', 
                    'ps_6_0', 'ps_6_1', 'ps_6_2', 'ps_6_3', 'ps_6_4', 
                    'vs_6_0', 'vs_6_1', 'vs_6_2', 'vs_6_3', 'vs_6_4', 
                    'ds_6_0', 'ds_6_1', 'ds_6_2', 'ds_6_3', 'ds_6_4', 
                    'gs_6_0', 'gs_6_1', 'gs_6_2', 'gs_6_3', 'gs_6_4',
                    'hs_6_0', 'hs_6_1', 'hs_6_2', 'hs_6_3', 'hs_6_4', 
                    'lib_6_0', 'lib_6_1', 'lib_6_2', 'lib_6_3', 'lib_6_4'];
        return super.showQuickPick(picks, (pick) => {
                this.targetProfile = pick;
        })
    }

    protected getOptions()
    {
        var config = vscode.workspace.getConfiguration('rga');
        var userDefineOptions = config.get<string>('arguments.dx12');
        var options = new Array<[string, string]>(
            ['-s', 'dx12'],
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
            () => {return this.initializeEntryPoint()},
            () => {return this.initializeTargetProfile()} 
        ];
        return methods;
    }
}