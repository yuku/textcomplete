# textcomplete

Autocomplete for textarea elements.

[![NPM version](http://img.shields.io/npm/v/textcomplete.svg)](https://www.npmjs.com/package/textcomplete)
[![Build Status](https://travis-ci.org/yuku-t/textcomplete.svg?branch=master)](https://travis-ci.org/yuku-t/textcomplete)
[![Code Climate](https://codeclimate.com/github/yuku-t/textcomplete/badges/gpa.svg)](https://codeclimate.com/github/yuku-t/textcomplete)
[![Test Coverage](https://codeclimate.com/github/yuku-t/textcomplete/badges/coverage.svg)](https://codeclimate.com/github/yuku-t/textcomplete/coverage)
[![Stable Release Size](http://img.badgesize.io/https://unpkg.com/textcomplete/dist/textcomplete.min.js?compression=gzip)](https://github.com/ngryman/badge-size)
[![Analytics](https://ga-beacon.appspot.com/UA-4932407-14/textcomplete/readme)](https://github.com/igrigorik/ga-beacon)

## Requirements

Distributed scripts are self-contained.

To require as npm package, textcomplete requires the following to run:

- [Node.js](https://nodejs.org/)
- [npm] - normally comes with Node.js

## Usage

Textcomplete is easiest to use when installed with [npm]:

```bash
npm install --save textcomplete
```

Then you can load the module into your code with `require` call:

```js
var { Textcomplete, Textarea } = require('textcomplete');
```

The `Textarea` object is a kind of *editor class*. An editor encapsulates an HTML element where users input text. The `Textarea` editor is an editor for textarea element.

You can find some additional editors at [List of editors](https://github.com/yuku-t/textcomplete/wiki/Editors) wiki.

The `Textcomplete` is the core object of textcomplete.

```js
var editor = new Textarea(textareaElement);
var textcomplete = new Textcomplete(editor);
```

Register series of autocomplete strategies:

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
}, {
  // Another strategy
  ...
}]);
```

Now, the `textcomplete` listens keyboard event on the `editor` and render autocomplete dropdown when one of the strategy matches to the inputted value.

## Browser Support

 Chrome  | Firefox  | Internet Explorer |  Opera  | Safari
:-------:|:--------:|:-----------------:|:-------:|:-------:
 Current | Current  |       10+         | Current | Current

## Install

If your project is using npm, you can install [textcomplete](https://www.npmjs.com/package/textcomplete) package by `npm` command:

```bash
npm install --save textcomplete
```

if not, you can download released packages from the [release page](https://github.com/yuku-t/textcomplete/releases) which contain bundled scripts in `dist` directory.

## Contributing

To contribute to textcomplte, clone this repo locally and commit your code on a separate branch.
Please write unit tests for your code, and run the linter before opening a pull-request:

```bash
npm test # run linter and all tests
```

You can find more detail in our [contributing guide](https://github.com/yuku-t/textcomplete/blob/master/CONTRIBUTING.md).

## License

The [MIT](https://github.com/yuku-t/textcomplete/blob/master/LICENSE) License

[npm]: https://www.npmjs.com/
