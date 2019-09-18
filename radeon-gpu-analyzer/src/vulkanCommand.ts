import * as vscode from 'vscode';
import { RgaCommand } from './rgaCommand';

export class VulkanCommand extends RgaCommand
{
    private targetProfile = '';

    private initializeTargetProfile() : Thenable<any>
    {
        // TODO query from file extension
        var picks = ['comp', 'frag', 'vert', 'tesc', 'tese', 'geom']; 
        return super.showQuickPick(picks, "Shader type.", (pick) => {
                this.targetProfile = pick;
        })
    }

    protected getOptions()
    {
        var config = vscode.workspace.getConfiguration('rga');
        var userDefineOptions = config.get<string>('arguments.vulkan');
        var options = new Array<[string, string]>(
            ['-s', 'vulkan'],
            ['-c', this.getTargetAsic()],
            ['--isa', this.getIsaPath()],
            ['--il', this.getIlPath()],
            ['', userDefineOptions],
            ['--' + this.targetProfile, this.getSourcePath()],
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