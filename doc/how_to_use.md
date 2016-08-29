How to use
==========

jQuery MUST be loaded ahead.

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/jquery.textcomplete.js"></script>
```

Then `jQuery.fn.textcomplete` is defined. The method MUST be called for textarea elements, contenteditable elements or `input[type="text"]`.

```js
$('textarea').textcomplete(strategies, option);  // Recommended.
// $('[contenteditable="true"]').textcomplete(strategies, option);
// $('input[type="text"]').textcomplete(strategies, option);
```

The `strategies` is an Array. Each element is called as strategy object.

```js
var strategies = [
  // There are two strategies.
  strategy,
  { /* the other strategy */ }
];
```

The `strategy` is an Object which MUST have `match`, `search` and `replace` and MAY have `index`, `template`, `cache`, `context` and `idProperty`.

```js
var strategy = {
  // Required
  match:      matchRegExpOrFunc,
  search:     searchFunc,
  replace:    replaceFunc,

  // Optional                 // Default
  cache:      cacheBoolean,   // false
  context:    contextFunc,    // function (text) { return true; }
  id:         idString,       // null
  idProperty: idPropertyStr,  // null
  index:      indexNumber,    // 2
  template:   templateFunc,   // function (value) { return value; }
}
```

The `matchRegExpOrFunc` MUST be a RegExp or a Function which returns a RegExp.
And `indexNumber` and `contextFunc` MUST be a Number and a Function respectively.

`contextFunc` is called with the current value of the target textarea and it works as a preprocessor. When it returns `false`, the strategy is skipped. When it returns a String, `matchRegExpOrFunc` tests the returned string.

`matchRegExpOrFunc` MUST contain capturing groups and SHOULD end with `$`. The word captured by `indexNumber`-th group is going to be the `term` argument of `searchFunc`. `indexNumber` defaults to 2.

```js
// Detect the word starting with '@' as a query term.
var matchRegExpOrFunc = /(^|\s)@(\w*)$/;
var indexNumber = 2;
// Normalizing the input text.
var contextFunc = function (text) { return text.toLowerCase(); };
```

The `searchFunc` MUST be a Function which gets two arguments, `term` and `callback`. It MAY have the third argument `match` which is the result of regexp matching. It MUST invoke `callback` with an Array. It is guaranteed that the function will be invoked exclusively even though it contains async call.

If you want to execute `callback` multiple times per a search, you SHOULD give `true` to the second argument while additional execution remains. This is useful to use data located at both local and remote. Note that you MUST invoke `callback` without truthy second argument at least once per a search.

The `cacheBoolean` MUST be a Boolean. It defaults to `false`. If it is `true` the `searchFunc` will be memoized by `term` argument. This is useful to prevent excessive API access.

TextComplete automatically make the dropdown unique when the callbacked array consists of Strings. If it consists of Objects and the dropdown should be unique, use `idPropertyStr` for teaching the specified property is good to identify each elements.

```js
var searchFunc = function (term, callback, match) {
  // term === match[indexNumber]
  callback(cache[term], true); // Show local cache immediately.

  $.getJSON('/search', { q: term })
    .done(function (resp) {
      callback(resp); // `resp` must be an Array
    })
    .fail(function () {
      callback([]); // Callback must be invoked even if something went wrong.
    });
};
```

The `templateFunc` MUST be a Function which returns a string. The function is going to be called as an iterator for the array given to the `callback` of `searchFunc`. You can change the style of each dropdown item.

```js
var templateFunc = function (value, term) {
  // `value` is an element of array callbacked by searchFunc.
  return '<b>' + value + '</b>';
};
// Default:
//   templateFunc = function (value) { return value; };
```

The `replaceFunc` MUST be a Function which returns a String, an Array of two Strings or `undefined`. It is invoked when a user will click and select an item of autocomplete dropdown.

```js
var replaceFunc = function (value, event) { return '$1@' + value + ' '; };
```

The result is going to be used to replace the value of textarea using `String.prototype.replace` with `matchRegExpOrFunc`:

```js
textarea.value = textarea.value.replace(matchRegExpOrFunc, replaceFunc(value, event));
```

Suppose you want to do autocomplete for HTML elements, you may want to reposition the cursor in the middle of elements after the autocomplete. In this case, you can do that by making `replaceFunc` return an Array of two Strings. Then the cursor points between these two strings.

```js
var replaceFunc = function (value) {
  return ['$1<' + value + '>', '</' + value + '>'];
};
```

If `undefined` is returned from a `replaceFunc`, textcomplete does not replace the text.

If `idString` is given, textcomplete sets the value as `data-strategy` attribute of the dropdown element. You can change dropdown style by using the property.

The `option` is an optional Object which MAY have `appendTo`, `height` , `maxCount`, `placement`, `header`, `footer`, `zIndex`, `debounce` and `onKeydown`. If `appendTo` is given, the element of dropdown is appended into the specified element. If `height` is given, the dropdown element's height will be fixed.

```js
var option = {
  adapter:           adapterClass,              // undefined
  appendTo:          appendToString,            // 'body'
  className:         classNameStr,              // DEPRECATED ''
  debounce:          debounceNumber,            // undefined
  dropdownClassName: dropdownClassNameStr,      // 'dropdown-menu textcomplete-dropdown'
  footer:            footerStrOrFunc,           // undefined
  header:            headerStrOrFunc,           // undefined
  height:            heightNumber,              // undefined
  maxCount:          maxCountNumber,            // 10
  noResultsMessage:  noResultsMessageStrOrFunc, // undefined
  onKeydown:         onKeydownFunc,             // undefined
  placement:         placementStr,              // ''
  rightEdgeOffset:   rightEdgeOffsetInteger,    // 30
  zIndex:            zIndexStr,                 // '100'
};
```

The `maxCountNumber` MUST be a Number and default to 10. Even if `searchFunc` callbacks with large array, the array will be truncated into `maxCountNumber` elements.

If `placementStr` includes 'top', it positions the drop-down to above the caret. If `placementStr` includes 'absleft' and 'absright', it positions the drop-down absolutely to the very left and right respectively. You can mix them.

You can override the z-index property and the class attribute of dropdown element using `zIndex` and `dropdownClassName` option respectively.

If you want to add some additional keyboard shortcut, set a function to `onKeydown` option. The function will be called with two arguments, the keydown event and commands hash.

```js
var onKeydownFunc = function (e, commands) {
  // `commands` has `KEY_UP`, `KEY_DOWN`, `KEY_ENTER`, `KEY_PAGEUP`, `KEY_PAGEDOWN`,
  // `KEY_ESCAPE` and `SKIP_DEFAULT`.
  if (e.ctrlKey && e.keyCode === 74) {
    // Treat CTRL-J as enter key.
    return commands.KEY_ENTER;
  }
  // If the function does not return a result or undefined is returned,
  // the plugin uses default behavior.
};
```

Textcomplete debounces `debounceNumber` milliseconds, so `searchFunc` is not called until user stops typing.

```js
var placementStr = 'top|absleft';
```

If you want to use textcomplete with a rich editor, please write an adapter for it and give the adapter as `adapterClass`.

Finally, if you want to stop autocompleting, give `'destroy'` to `textcomplete` method as follows:

```js
$('textarea').textcomplete('destroy');
```

Example
-------

```js
$('textarea').textcomplete([
  { // mention strategy
    match: /(^|\s)@(\w*)$/,
    search: function (term, callback) {
      callback(cache[term], true);
      $.getJSON('/search', { q: term })
        .done(function (resp) { callback(resp); })
        .fail(function ()     { callback([]);   });
    },
    replace: function (value) {
      return '$1@' + value + ' ';
    },
    cache: true
  },
  { // emoji strategy
    match: /(^|\s):(\w*)$/,
    search: function (term, callback) {
      var regexp = new RegExp('^' + term);
      callback($.grep(emojies, function (emoji) {
        return regexp.test(emoji);
      }));
    },
    replace: function (value) {
      return '$1:' + value + ': ';
    }
  }
], { maxCount: 20, debounce: 500 });
```
