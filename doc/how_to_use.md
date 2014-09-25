How to use
==========

jQuery MUST be loaded ahead.

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/jquery.textcomplete.js"></script>
```

Then `jQuery.fn.textcomplete` is defined. The method MUST be called for textarea elements or contenteditable elements.

```js
$('textarea').textcomplete(strategies, option);  // Recommended.
// $('[contenteditable="true"]').textcomplete(strategies, option);
```

The `strategies` is an Array. Each element is called as strategy object.

```js
var strategies = [
  // There are two strategies.
  strategy,
  { /* the other strategy */ }
];
```

The `strategy` is an Object which MUST have `match`, `search` and `replace` and MAY have `index`, `template` and `cache`.

```js
var strategy = {
  // Required
  match:      matchRegExp,
  search:     searchFunc,
  replace:    replaceFunc,

  // Optional                 // Default
  index:      indexNumber,    // 2
  template:   templateFunc,   // function (value) { return value; }
  cache:      cacheBoolean,   // false
  context:    contextFunc,    // function (text) { return true; }
  idProperty: idPropertyStr   // null
}
```

The `matchRegExp`, `indexNumber` and `contextFunc` MUST be a RegExp, a Number and a Function respectively. `contextFunc` is called with the current value of the target textarea. It works as a preprocessor. When it returns `false`, the strategy is skipped. When it returns a String, `matchRegExp` tests the returned string. `matchRegExp` MUST contain capturing groups and SHOULD end with `$`. `indexNumber` defaults to 2. The word captured by `indexNumber`-th group is going to be the `term` argument of `searchFunc`.

```js
// Detect the word starting with '@' as a query term.
var matchRegExp = /(^|\s)@(\w*)$/;
var indexNumber = 2;
// Normalizing the input text.
var contextFunc = function (text) { return text.toLowerCase(); };
```

The `searchFunc` MUST be a Function which gets two arguments, `term` and `callback`. It MAY have the third argument `match` which is the result of regexp matching. It MUST invoke `callback` with an Array. It is guaranteed that the function will be invoked exclusively even though it contains async call.

If you want to execute `callback` multiple times per a search, you SHOULD give `true` to the second argument while additional execution remains. This is useful to use data located at both local and remote. Note that you MUST invoke `callback` without truthy second argument at least once per a search.

The `cacheBoolean` MUST be a Boolean. It defaults to `false`. If it is `true` the `searchFunc` will be memoized by `term` argument. This is useful to prevent excessive API access.

TextComplete automatically make the dropdown unique when the callbacked array consists of Strings. If it consists of Objects and the dropdown shoud be unique, use `idPropertyStr` for teaching the specified property is good to identify each elements.

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

The `templateFunc` MUST be a Function which returns a string. The function is going to be called as an iteretor for the array given to the `callback` of `searchFunc`. You can change the style of each dropdown item.

```js
var templateFunc = function (value) {
  // `value` is an element of array callbacked by searchFunc.
  return '<b>' + value + '</b>';
};
// Default:
//   templateFunc = function (value) { return value; };
```

The `replaceFunc` MUST be a Function which returns a String or an Array of two Strings. It is going to be invoked when a user will click and select an item of autocomplete dropdown.

```js
var replaceFunc = function (value) { return '$1@' + value + ' '; };
```

The result is going to be used to replace the value of textarea using `String.prototype.replace` with `matchRegExp`:

```js
textarea.value = textarea.value.replace(matchRegExp, replaceFunc(value));
```

Suppose you want to do autocomplete for HTML elements, you may want to reposition the cursor in the middle of elements after the autocomplete. In this case, you can do that by making `replaceFunc` return an Array of two Strings. Then the cursor points between these two strings.

```js
var replaceFunc = function (value) {
  return ['$1<' + value + '>', '</' + value + '>'];
};
```

The `option` is an optional Object which MAY have `appendTo`, `height` , `maxCount`, `placement`, `header`, `footer`, `zIndex` and `debounce`. If `appendTo` is given, the element of dropdown is appended into the specified element. If `height` is given, the dropdown element's height will be fixed.

```js
var option = {
  appendTo:  appendToElement, // $('body')
  height:    heightNumber,    // undefined
  maxCount:  maxCountNumber,  // 10
  placement: placementStr,    // ''
  header:    headerStrOrFunc, // undefined
  footer:    footerStrOrFunc, // undefined
  zIndex:    zIndexStr,       // '100'
  debounce:  debounceNumber,  // undefined
  adapter:   adapterClass,    // undefined
  className: classNameStr     // ''
};
```

The `maxCountNumber` MUST be a Number and default to 10. Even if `searchFunc` callbacks with large array, the array will be truncated into `maxCountNumber` elements.

If `placementStr` includes 'top', it positions the drop-down to above the caret. If `placementStr` includes 'absleft' and 'absright', it positions the drop-down absolutely to the very left and right respectively. You can mix them.

You can override the z-index property and the class attribute of dropdown element using `zIndex` and `className` option respectively.

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
