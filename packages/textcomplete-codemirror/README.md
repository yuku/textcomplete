# @textcomplete/codemirror

> Textcomplete editor for CodeMirror. (Experimental)

[![npm version](https://badge.fury.io/js/@textcomplete%2Fcodemirror.svg)](http://badge.fury.io/js/@textcomplete%2Fcodemirror)

## Install

```bash
npm install --save @textcomplete/core @textcomplete/codemirror codemirror
```

## Synopsis

```js
const { Textcomplete } = require("@textcomplete/core")
const { CodeMirrorEditor } = require("@textcomplete/codemirror")

const CodeMirror = require("codemirror")

const cm = CodeMirror(myElement)
const editor = new CodeMirrorEditor(cm)
const textcomplete = new Textcomplete(editor, strategies, option)
```

## Usage

Read the [document](https://yuku.takahashi.coffee/textcomplete/).

## License

&copy; Yuku Takahashi - This software is licensed under the MIT license.
