'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function floatToInt32(text : string) 
{
    var buffer = new ArrayBuffer(4);
    var int32 = new Int32Array(buffer, 0, 1);
    var float32 = new Float32Array(buffer, 0, 1);
    float32[0] = parseFloat(text); 
    return int32[0];
}

// Reference implementation from numpy:
// https://github.com/numpy/numpy/blob/master/numpy/core/src/npymath/halffloat.c#L466
function halfbitsToFloatBits(h : number)
{
    // h is already 32bit
    var h_exp = h & 0x7c00;
    var f_sgn = (h & 0x8000) << 16;

    switch(h_exp) 
    {
         case 0x0000: /* 0 or subnormal */
            var h_sig = h & 0x03ff;

            /* Signed zero */
            if (h_sig == 0) 
            {
                return f_sgn;
            }
    
            /* Subnormal */
            h_sig <<= 1;
            while ( (h_sig & 0x0400) == 0) 
            {
                h_sig <<= 1;
                h_exp++;
            }
            
            var f_exp = (127 - 15 - h_exp) << 23;
            var f_sig = (h_sig & 0x03ff) << 13;
            return f_sgn + f_exp + f_sig;
        case 0x7c00: /* inf or NaN */
            /* All-ones exponent and a copy of the significand */
            return f_sgn + 0x7f800000 + ((h & 0x03ff) << 13);
        default: /* normalized */
            /* Just need to adjust the exponent and shift */
            return f_sgn + (((h & 0x7fff) + 0x1c000) << 13);
    }
}

// Returns a float32 number that has the same value 
// as the float16 number represented by the bits in h.
function asFloat32(halfBits : number)
{   
    var buffer = new ArrayBuffer(4);
    var uint32 = new Uint32Array(buffer, 0, 1);
    uint32[0] = halfbitsToFloatBits(halfBits);

    var float32 = new Float32Array(buffer, 0, 1); 
    return float32[0];
}

function createRow(type : string, value : string) 
{
    type = (type + ':          ').substring(0, 10);
    return '' + type + value + '\n'
}

function prepareHoverText(text : string)
{
    var asInt32;
    if(text.includes('.')) {
        asInt32 = floatToInt32(text);
    }
    else {
        asInt32 = parseInt(text);
    }

    var buffer = new ArrayBuffer(4);
    var int32Arr = new Int32Array(buffer, 0, 1);
    int32Arr[0] = asInt32;

    var float32Arr = new Float32Array(buffer, 0, 1);
    var int16Arr = new Int16Array(buffer, 0, 2);
    var uint32Arr = new Uint32Array(buffer, 0, 1);
    var uint16Arr = new Uint16Array(buffer, 0, 2);
    var float16high = asFloat32(int16Arr[1]);
    var float16low = asFloat32(int16Arr[0]);

    var hoverText = '' 
    + createRow('Float32', '' + float32Arr[0].toPrecision(8)) 
    + createRow('Float16', '' + float16high.toPrecision(5) + ' : ' + float16low.toPrecision(5)) 
    + createRow('Int32', '' + int32Arr[0]) 
    + createRow('Int16', '' + int16Arr[1] +  ' : ' + int16Arr[0]) 
    + createRow('Uint32', '' + uint32Arr[0]) 
    + createRow('Uint16', '' + uint16Arr[1] + ' : ' + uint16Arr[0]) 
    + '';

    var markedString : vscode.MarkedString = {
        language: 'html',
        value: hoverText
    }

    return markedString;
}

class LiteralPreviewHoverProvider implements vscode.HoverProvider
{
    private isActive = false;
    public setActive(active)
    {
        this.isActive = active;
    }

    public provideHover(document, position, token) 
    {
        if(this.isActive)
        {
            var range = document.getWordRangeAtPosition(position);
            var selectedText = document.getText(range);

            // Check if we have to display anything, 
            // i.e. we can make a number out of the selected text.
            if(Number(selectedText) != Number.NaN) {
                var hoverText = prepareHoverText(selectedText);
                return new vscode.Hover(hoverText);
            }
        }
    }
}

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) 
{
    var provider = new LiteralPreviewHoverProvider();
    vscode.languages.registerHoverProvider('*', provider);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var enableCommand = vscode.commands.registerCommand('extension.enablePreviewLiterals', () => {
        provider.setActive(true);
    });
    context.subscriptions.push(enableCommand);

    var disableCommand = vscode.commands.registerCommand('extension.disablePreviewLiterals', () => {
        provider.setActive(false);
    });
    context.subscriptions.push(disableCommand);
}

// This method is called when your extension is deactivated
export function deactivate() 
{
    // Empty
}