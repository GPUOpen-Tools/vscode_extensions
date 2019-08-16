import * as vscode from 'vscode';
import { RgaCommand } from './rgaCommand';

export class Dx12Command extends RgaCommand
{
    private targetProfile = '';

    private initializeTargetProfile() : Thenable<any>
    {
        var picks = [
            'cs_6_0', 'cs_6_1', 'cs_6_2', 'cs_6_3', 'cs_6_4', 
            'cs_5_0', 'cs_5_1', 
            'ps_5_0', 'ps_5_1', 
            'vs_5_0', 'vs_5_1', 
            'ds_5_0', 'ds_5_1', 
            'gs_5_0', 'gs_5_1', 
            'hs_5_0', 'hs_5_1', 
            'lib_5_0', 'lib_5_1'];
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
            ['--cs-dxil-dis', this.getIlPath()], // RGA 2.2 can't output AMD IL for compute. Thus we just show the DXC output in DXIL.
            ['--cs-entry', this.getEntryPoint()],
            ['--cs-model', this.targetProfile],
            ['', userDefineOptions],
            ['--cs', this.getSourcePath()],
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