import * as vscode from 'vscode';
import { RgaCommand } from './rgaCommand';

export class Dx12Command extends RgaCommand
{
    private targetProfile = '';

    private initializeTargetProfile() : Thenable<any>
    {
        var picks = ['cs_6_0', 'cs_6_1', 'cs_6_2', 'cs_6_3', 'cs_6_4'];
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