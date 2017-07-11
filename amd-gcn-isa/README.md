# AMD GCN ISA

This extension provides a basic language support for the AMD GCN instruction set architecture.

## Features

For files with the extensions
- .isa
- .isa.txt
- .il
- .il.txt

the following tokens are emitted:
- `storage.type.amd-gcn-isa`
- `keyword.vector.amd-gcn-isa`
- `keyword.scalar.amd-gcn-isa`
- `keyword.control.label.amd-gcn-isa`
- `support.variable.vector.amd-gcn-isa`
- `support.variable.scalar.amd-gcn-isa`
- `comment.line.double-slash.amd-gcn-isa`
- `constant.numeric.float.amd-gcn-isa`
- `constant.numeric.integer.amd-gcn-isa`

For a starting point I recommend to add the following code snippet to your theme:

```json
{
    "scope": "storage.type.amd-gcn-isa",
    "settings": {
        "foreground": "#CC3333"
    }
},
{
    "scope": "keyword.vector.amd-gcn-isa",
    "settings": {
        "foreground": "#33CCCC"
    }
},
{
    "scope": "keyword.scalar.amd-gcn-isa",
    "settings": {
        "foreground": "#CC33CC"
    }
},
{
    "scope": "support.variable.vector.amd-gcn-isa",
    "settings": {
        "foreground": "#CCCC33"
    }
},
{
    "scope": "support.variable.scalar.amd-gcn-isa",
    "settings": {
        "foreground": "#6495ED"
    }
},
{
    "scope": "keyword.control.label.amd-gcn-isa",
    "settings": {
        "foreground": "#33CC33"
    }
}
```

## Release Notes

### 1.0.0
Initial release.

## License

This extension is under the MIT license. See [License](https://github.com/GPUOpen-Tools/vscode-extensions/blob/master/LICENSE) file for full license information.