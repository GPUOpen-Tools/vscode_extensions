import * as vscode from 'vscode';
import { RgaCommand } from './rgaCommand';

export class SpirvCommand extends RgaCommand
{
    protected getOptions()
    {
        var config = vscode.workspace.getConfiguration('rga');
        var userDefineOptions = config.get<string>('arguments.spirv');
        var options = new Array<[string, string]>(
            ['-s', 'vk-spv-txt-offline'],
            ['-c', this.getTargetAsic()],
            ['--isa', this.getIsaPath()],
            ['--il', this.getIlPath()],
            ['', userDefineOptions],
            ['', this.getSourcePath()],
            ['', this.getCustomArguments()]
        );
        return options;
    }

    protected getInitializingFunctions()
    {
        return [];
    }
}