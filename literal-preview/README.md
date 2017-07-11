# Literal Preview

This extension provides a way to preview hexadecimal literals in different numerical representations when hovering over them.

Open the command palette (`Ctrl+Shift+P`) and type `Enable: Preview Literals` to enable hovering over literals. Type `Disable: Preview Literals` to disable the feature.


## Features

Previewing a **hexadecimal** literal as 
- 32bit **floating point** value
- 2x 16bit **floating point** value
- 32bit **signed integer** value
- 2x 16bit **signed integer** value
- 32bit **unsigned integer** value
- 2x 16bit **unsigned integer** value
- 16bit or 32bit **binary**

The higher 16bit values are always shown first.
If the literal fits into 16bit, only the 16bit values are shown.
If a literal maps to zero, no tooltip is shown.

## Known Issues

- Negated literals are not recognized.
- Hovering over floating point values interprets the pre-decimal positions as hexadecimal value.

## Release Notes

### 1.0.0
Initial release.

## License

This extension is under the MIT license. See [License](https://github.com/GPUOpen-Tools/vscode-extensions/blob/master/LICENSE) file for full license information.