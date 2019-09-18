import * as vscode from 'vscode';
import { RgaCommand } from './rgaCommand';

export class Dx12Command extends RgaCommand
{
    private targetProfile = '';
    private gpsoPath = '';

    private initializeTargetProfile() : Thenable<any>
    {
        var picks = ['6_0', '6_1', '5_0', '5_1', '6_2', '6_3', '6_4'];
        return super.showQuickPick(picks, "Shader model.", (pick) => {
                this.targetProfile = pick;
        })
    }

    private initializeGpsoPath() : Thenable<any>
    {
        return this.showQuickCustomPicks("gpsoPath", ".gpso path - Leave empty for compute shaders.", (pick) => {
            this.gpsoPath = '"' + pick + '"';
            return true;
        });
    }

    protected getOptions()
    {
        var config = vscode.workspace.getConfiguration('rga');
        var userDefineOptions = config.get<string>('arguments.dx12');
        var options = new Array<[string, string]>(
            ['-s', 'dx12'],
            ['-c', this.getTargetAsic()],
            ['--isa', this.getIsaPath()],
            ['--gpso', this.gpsoPath],
            ['--all-hlsl', this.getSourcePath()],
            ['--all-model', this.targetProfile],
            ['', userDefineOptions],
            ['', this.getCustomArguments()]
        );
        return options;
    }

    protected getInitializingFunctions()
    {
        var methods = [
            () => {return this.initializeEntryPoint()},
            () => {return this.initializeTargetProfile()},
            () => {return this.initializeGpsoPath()} 
        ];
        return methods;
    }
}