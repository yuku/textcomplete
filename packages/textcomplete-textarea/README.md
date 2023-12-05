# @textcomplete/textarea

Textcomplete editor for HTMLTextAreaElement.

[![npm version](https://badge.fury.io/js/@textcomplete%2Ftextarea.svg)](http://badge.fury.io/js/@textcomplete%2Ftextarea)

Check the live demo [here](https://yuku.takahashi.coffee/textcomplete/#textcomplete-textarea).

## Install

```bash
npm install --save @textcomplete/core @textcomplete/textarea
```

## Synopsis

```js
const { Textcomplete } = require("@textcomplete/core")
const { TextareaEditor } = require("@textcomplete/textarea")

const editor = new TextareaEditor(textareaElement)
const textcomplete = new Textcomplete(editor, strategies, option)
```

## Usage

Read the [document](https://yuku.takahashi.coffee/textcomplete/).

## License

&copy; Yuku Takahashi - This software is licensed under the MIT license.
