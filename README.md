Autocomplete for Textarea
=========================

[![Bower version](https://badge.fury.io/bo/jquery-textcomplete.svg)](http://badge.fury.io/bo/jquery-textcomplete)
[![Analytics](https://ga-beacon.appspot.com/UA-4932407-14/jquery-textcomplete/readme)](https://github.com/igrigorik/ga-beacon)


Introduces autocompleting power to textareas, like a GitHub comment form has.

![Demo](http://yuku-t.com/jquery-textcomplete/media/images/demo.gif)

[Demo](http://yuku-t.com/jquery-textcomplete/).

Dependency
----------

- jQuery (>= 1.7.0) OR Zepto (>= 1.0)

How to use
----------

Note: The key words "MUST", "SHOULD", and "MAY" in this document are to be interpreted as described in [RFC 2119](http://www.ietf.org/rfc/rfc2119.txt).

-----

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
  match:     matchRegExp,
  search:    searchFunc,
  replace:   replaceFunc,

  // Optional                 // Default
  index:     indexNumber,     // 2
  template:  templateFunc,    // function (value) { return value; }
  cache:     cacheBoolean     // false
}
```

The `matchRegExp` and `indexNumber` MUST be a RegExp and a Number respectively. `matchRegExp` MUST contain capturing groups and SHOULD end with `$`. `indexNumber` defaults to 2. The word captured by `indexNumber`-th group is going to be the `term` argument of `searchFunc`.

```js
// Detect the word starting with '@' as a query term.
var matchRegExp = /(^|\s)@(\w*)$/;
var indexNumber = 2;
```

The `searchFunc` MUST be a Function which gets two arguments, `term` and `callback`. It MUST invoke `callback` with an Array. It is guaranteed that the function will be invoked exclusively even though it contains async call.

If you want to execute `callback` multiple times per a search, you SHOULD give `true` to the second argument while additional execution remains. This is useful to use data located at both local and remote. Note that you MUST invoke `callback` without truthy second argument at least once per a search.

The `cacheBoolean` MUST be a Boolean. It defaults to `false`. If it is `true` the `searchFunc` will be memoized by `term` argument. This is useful to prevent excessive API access.

```js
var searchFunc = function (term, callback) {
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

The `option` is an optional Object which MAY have `appendTo`, `height` , `maxCount`, `placement`, `header`, `footer` and `zIndex`. If `appendTo` is given, the element of dropdown is appended into the specified element. If `height` is given, the dropdown element's height will be fixed.

```js
var option = {
  appendTo:  appendToElement, // $('body')
  height:    heightNumber,    // undefined
  maxCount:  maxCountNumber,  // 10
  placement: placementStr,    // ''
  header:    headerStrOrFunc, // undefined
  footer:    footerStrOrFunc, // undefined
  zIndex:    zIndexStr        // '100'
};
```

The `maxCountNumber` MUST be a Number and default to 10. Even if `searchFunc` callbacks with large array, the array will be truncated into `maxCountNumber` elements.

If `placementStr` includes 'top', it positions the drop-down to above the caret. If `placementStr` includes 'absleft' and 'absright', it positions the drop-down absolutely to the very left and right respectively. You can mix them.

You can override the z-index property of dropdown element using `zIndex` option.

```js
var placementStr = 'top|absleft';
```

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
]);

// You can append strategies to an already existing textcomplete object.
$('textarea').textcomplete([
    {
        // Yet another strategy
    }
]);
```

Style
-----

The HTML generated by jquery-textcomplete is compatible with [Bootstrap](http://twbs.github.io/bootstrap/)'s dropdown. So all Bootstrap oriented css files are available.

This repository also includes jquery.autocomplete.css. It is useful to be used as the starting point.

Events
------

textComplete fires a number of events.

- `textComplete:show` - Fired when a dropdown is shown.
- `textComplete:hide` - Fired when a dropdown is hidden.
- `textComplete:select` - Fired with the selected value when a dropdown is selected.

```javascript
$('#textarea')
    .textcomplete([/* ... */])
    .on({
        'textComplete:select': function (e, value, strategy) {
            alert(value);
        },
        'textComplete:show': function (e) {
            $(this).data('autocompleting', true);
        },
        'textComplete:hide': function (e) {
            $(this).data('autocompleting', false);
        }
    });
```

FAQ
---

### Can I change the trigger token, like use `@` instead of `:`?

Use the following `match` and `replace` at your strategy:

```js
match: /(^|\s)@(\w*)$/,
replace: function (value) { return '$1@' + value + ' '; }
```

If you use `@` just for trigger and want to remove it when a user makes her choice:

```js
match: /(^|\s)(@\w*)$/
replace: function (value) { return '$1' + value + ' '; }
```

### Can I use both local data and remote data per a search?

Invoking `callback(localData, true)` and `callback(remoteData)` is what you have to do.

```js
search: function (term, callback) {
  callback(cache[term], true);
  $.getJSON('/search', { q: term })
    .done(function (resp) { callback(resp); })
    .fail(function ()     { callback([]);   });
}
```

### I want to cache the remote server's response.

Turn on the `cache` option.

### I want to send back value / name combos.

Feel free to callback `searchFunc` with an Array of Object. `templateFunc` and `replaceFunc` will be invoked with an element of the array.

### I want to use same strategies to autocomplete on several textareas. 

TextComplete is applied to all textareas in the jQuery object.

```js
// All class="commentBody" elements share strategies.
$('.commentBody').textcomplete([ /* ... */ ]);
```

### How to trigger textcomplete manually?

Use `trigger` as follows:

```js
// Put manual search query.
$('textarea').textcomplete('trigger', 'query');

// Use current texts. It depends on the position of cursor.
$('textarea').textcomplete('trigger');
```

If you want to show textcomplete when a textarea gets focus, `trigger` MUST be called at next tick.

```js
$('textarea').on('focus', function () {
    var element = this;
    // Cursor has not set yet. And wait 100ms to skip global click event.
    setTimeout(function () {
        // Cursor is ready.
        $(element).textcomplete('trigger');
    }, 100);
});
```

License
-------

Licensed under the MIT License.

Credits
-------

### Contributors

Patches and code improvements were contributed by:

https://github.com/yuku-t/jquery-textcomplete/graphs/contributors
