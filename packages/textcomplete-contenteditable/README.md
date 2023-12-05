# @textcomplete/contenteditable

Textcomplete editor for contenteditable. (Experimental)

[![npm version](https://badge.fury.io/js/@textcomplete%2Fcontenteditable.svg)](http://badge.fury.io/js/@textcomplete%2Fcontenteditable)

Check the live demo [here](https://yuku.takahashi.coffee/textcomplete/#textcomplete-contenteditable).

## Install

```bash
npm install --save @textcomplete/core @textcomplete/contenteditable
```

## Synopsis

```js
const { Textcomplete } = require("@textcomplete/core")
const { ContenteditableEditor } = require("@textcomplete/contenteditable")

const editor = new ContenteditableEditor(myContenteditableElement)
const textcomplete = new Textcomplete(editor, strategies, option)
```

## Usage

Read the [document](https://yuku.takahashi.coffee/textcomplete/).

## License

&copy; Yuku Takahashi - This software is licensed under the MIT license.
