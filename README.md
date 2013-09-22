Autocomplete for Textarea
=========================

Introduces autocompleting power to textareas, like a GitHub comment form has.

![Demo](/media/images/demo.gif)

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

Then `jQuery.fn.textcomplete` is defined. The method MUST be called for textarea elements, and the receiver SHOULD include an element.

```js
$('textarea').textcomplete(strategies);
```

The `strategies` is an Object not an Array. Each value is called a strategy object and the corresponding key is the name of the strategy.

```js
var strategies = {
  // There are two strategies called 'foo' and 'bar.'
  // The plugin does not care these property names so you should use
  // meaningful names.
  foo: strategy,
  bar: otherStrategy
};
```

The `strategy` is an Object which MUST have `match`, `search` and `replace` and MAY have `index`, `maxCount` and `template`.

```js
var strategy = {
  // Required
  match:    matchRegExp,
  search:   searchFunc,
  replace:  replaceFunc,

  // Optional
  index:    indexNumber,
  maxCount: maxCountNumber,
  template: templateFunc,
  cache:    cacheBoolean
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

The `maxCountNumber` MUST be a Number and default to 10. Even if `searchFunc` callbacks with large array, the array will be truncated into `maxCountNumber` elements.

The `cacheBoolean` MUST be a Boolean. It defaults to `false`. If it is `true` the `searchFunc` will be memoized by `term` argument. This is useful to prevent excessive API access.

```js
var searchFunc = function (term, callback) {
  callback(cache[term], true); // Show local cache immediately.

  $.getJSON('/search', { q: term })
    .done(function (resp) {
      callback(resp); // Resp must be an Array
    })
    .fail(function () {
      callback([]); // Callback must be invoked even if something went wrong.
    });
};
```

The `templateFunc` MUST be a Function which gets and returns a string. The function is going to be called as an iteretor for the array given to the `callback` of `searchFunc`.

```js
var templateFunc = function (value) {
  // `value` is an element of callbacked array.
  return '<b>' + value + '</b>';
};
```

The `replaceFunc` MUST be a Function which returns a String or an Array of two Strings. It is going to be invoked when a user will click and select an item of autocomplete dropdown.

```js
var replaceFunc = function (value) { return '$1@' + value + ' '; };
```

The result is going to be used to replace the textarea's text content using `String.prototype.replace` with `matchRegExp`:

```js
textarea.value = textarea.value.replace(matchRegExp, replaceFunc(value));
```

Suppose you want to do autocomplete for HTML elements, you may want to reposition the cursor in the middle of elements after the autocomplete. In this case, you can do that by making `replaceFunc` return an Array of two Strings. Then the cursor points between these two strings.

```js
var replaceFunc = function (value) {
  return ['$1<' + value + '>', '</' + value + '>'];
}
```

Example
-------

```js
$('textarea').textcomplete({
  // mention strategy
  mention: {
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

  // emoji strategy
  emoji: {
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
});
```

Style
-----

The HTML generated by jquery-textcomplete is compatible with [Bootstrap](http://twbs.github.io/bootstrap/)'s dropdown. So all Bootstrap oriented css files are available.

This repository also includes jquery.autocomplete.css. It is useful to be used as the starting point.

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

### I want to set the width of textarea in % form.

Apply `display: block` too.

```css
textarea {
  width: 100%;
  display: block; /* Default: inline-block */
}
```

If you need `inline-block` textarea for design reason, you have to wrap it by `inline-block` element.

```html
<span style="width: 70%;">
  <textarea style="display: block; width: 100%;"></textarea>
</span>
<span style="width: 30%;">
  30% width contents
</span>
```

### I want to send back value / name combos.

Feel free to callback `searchFunc` with an Array of Object. `templateFunc` and `replaceFunc` will be invoked with an element of the array.

Todo
----

- Tests

License
-------

Licensed under the MIT License
