import * as vscode from 'vscode';
import { RgaCommand } from './rgaCommand';

export class AmdilCommand extends RgaCommand
{
    protected getOptions()
    {
        var config = vscode.workspace.getConfiguration('rga');
        var userDefineOptions = config.get<string>('arguments.amdil');
        var options = new Array<[string, string]>(
            ['-s', 'amdil'],
            ['-c', this.getTargetAsic()],
            ['--isa', this.getIsaPath()],
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