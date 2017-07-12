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
If the literal fits into 16bit, only 16bit values are shown.
If a literal maps to zero, no tooltip is shown.

## Known Issues

- Negated literals are not recognized.
- Hovering over floating point values interprets the pre-decimal positions as hexadecimal value.

## Release Notes

### 1.0.2
- Added NumPy license.

### 1.0.1
- Recognize hexadecimal numbers only.
- If the literal fits into 16bits, only those conversions are shown.

### 1.0.0
- Initial release.

## License

This extension is under the MIT license. See [License](https://github.com/GPUOpen-Tools/vscode-extensions/blob/master/LICENSE) file for full license information.

It contains parts of [NumPy](https://github.com/numpy/numpy), which is under BSD-3-Clause License:

```
Copyright (c) 2005-2017, NumPy Developers.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

    * Redistributions of source code must retain the above copyright
       notice, this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above
       copyright notice, this list of conditions and the following
       disclaimer in the documentation and/or other materials provided
       with the distribution.

    * Neither the name of the NumPy Developers nor the names of any
       contributors may be used to endorse or promote products derived
       from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```