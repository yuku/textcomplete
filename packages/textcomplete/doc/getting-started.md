## Install and Require

### NPM Package

If your project is using npm, you can install [textcomplete](https://www.npmjs.com/package/textcomplete) package by `npm` command:

```
npm install textcomplete
```

Now it is requireable as a Common JS module:

```js
var Textcomplete = require('textcomplete');
var Textarea = require('textcomplete/lib/textarea');
```

### Traditional

You can download a released package from the [release page](https://github.com/yuku-t/textcomplete/releases) containing bundled scripts in `dist` directory:

```html
<script src="path/to/textcomplete/dist/textcomplete.js"></script>
<script>
  var Textarea = Textcomplete.editors.Textarea;
</script>
```

Note that these scripts are ignored by the Git repository so that they do not appear on the GitHub Web UI.

### Synopsis

First of all, create an *editor* object. An editor encapsulates an HTML element where users will be writing text. There are two editors available:

* Textarea (bundled with this library)
* [ContentEditable](https://github.com/yuku/textcomplete.contenteditable) &ndash; When loaded after Textcomplete, the ContentEditable editor is available via `Textcomplete.editors.ContentEditable`.

```js
var textareaElement = document.getElementById('your-textarea-element')
var editor = new Textarea(textareaElement);
```

Initialize a [`Textcomplete`] with the editor and optional [`Textcomplete~Options`]:

```js
var textcomplete = new Textcomplete(editor, {
  dropdown: {
    maxCount: Infinity
  }
})
```

Register an array of [`Strategy~Properties`] to specify its behavior:

```js
textcomplete.register([{
  // Emoji strategy
  match: /(^|\s):(\w+)$/,
  search: function (term, callback) {
    callback(emojies.filter(emoji => { return emoji.startsWith(term); }));
  },
  replace: function (value) {
    return '$1:' + value + ': ';
  }
}]);
```

You can also pass `index` to specify the match group to use as the query.
The default value is `2`.

The `match` strategy argument can also be a function that returns an
Array of strings with the `index` property, with the same semantics as
the return type of [`String#match`].

Now, the `textcomplete` listens keyboard event on the `editor` and render autocomplete dropdown
when one of the registered strategy matches to the current `editor`'s value.

[`Strategy~Properties`]: api.md#strategyproperties
[`String#match`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
[`Textarea`]: api.md#textarea
[`Textcomplete`]: api.md#textcomplete
[`Textcomplete~Options`]: api.md#textcompleteoptions
