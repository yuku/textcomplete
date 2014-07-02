Autocomplete for Textarea
=========================

[![Analytics](https://ga-beacon.appspot.com/UA-4932407-14/jquery-textcomplete/readme)](https://github.com/igrigorik/ga-beacon)


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

Then `jQuery.fn.textcomplete` is defined. The method MUST be called for textarea elements or contenteditable elements.

```js
$('textarea').textcomplete(strategies, option);
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

The `strategy` is an Object which MUST have `match`, `search` and `replace` and MAY have `index`, `maxCount`, `template`, `cache`, `placement`, `header` and `footer`.

```js
var strategy = {
  // Required
  match:     matchRegExp,
  search:    searchFunc,
  replace:   replaceFunc,

  // Optional
  index:     indexNumber,     // 2
  maxCount:  maxCountNumber,  // 10
  template:  templateFunc,    // function (value) { return value; }
  cache:     cacheBoolean,    // false
  placement: placementStr     // undefined
  header:    headerStrOrFunc  // undefined
  footer:    footerStrOrFunc  // undefined
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

`placementStr` accepts only 'top' and which will cause the drop-down menu to render above the caret instead of below it.

```js
var placementStr = 'top';
```

The `option` is an optional Object which MAY have `appendTo`. If `appendTo` is given, the element of dropdown is appended into the specified element.

```js
var option = {
  appentTo: 'body' // suports Element and jQuery object
};
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
        'textComplete:select': function (e, value) {
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
$('textarea').data('textComplete').trigger('query');

// Use current texts. It depends on the position of cursor.
$('textarea').data('textComplete').trigger();
```

If you want to show textcomplete when a textarea gets focus, `trigger` MUST be called at next tick.

```js
$('textarea').on('focus', function () {
    var textComplete = $(this).data('textComplete');
    // Cursor has not set yet. And wait 100ms to skip global click event.
    setTimeout(function () {
        // Cursor is ready.
        textComplete.trigger();
    }, 100);
});
```

Todo
----

- Write tests
- Content editable support (at v0.2)

History
-------

### Jul 2, 2014 - v0.2.4

- Fix horizonal position on contentEditable elements. [[#92]](https://github.com/yuku-t/jquery-textcomplete/pull/92)

### Jun 24, 2014 - v0.2.3

- Option to supply list view position function. [[#88]](https://github.com/yuku-t/jquery-textcomplete/pull/88)

### Jun 8, 2014 - v0.2.2

- Append dropdown element to body element by default.
- Tiny refactoring. [#84]
- Ignore tab key when modifier keys are being pushed. [[#85]](https://github.com/yuku-t/jquery-textcomplete/pull/85)
- Manual triggering.

### May 15, 2014 - v0.2.1

- Support `appendTo` option.
- `header` and `footer` supports a function.
- Remove textcomplate-wrapper element.

### May 2, 2014 - v0.2

- Contenteditable support.
- Several bugfixes.
- Support `header` and `footer` setting.

### April 4, 2014 - v0.1.4.1

- Support placement option.
- Emacs-style prev/next keybindings.
- Replay searchFunc for the last term on slow network env.
- Several bugfixes.

### March 7, 2014 - v0.1.3

- Several bugfixes.
- Support RTL positioning.

### February 8, 2014 - v0.1.2

- Enable to append strategies on the fly.
- Enable to stop autocompleting.
- Enable to apply multiple textareas at once.
- Don't show popup on pressing arrow up and down keys.
- Hide dropdown by pressing ESC key.
- Prevent showing a dropdown when it just autocompleted.
- ~~Support RTL positioning.~~

### February 2, 2014 - v0.1.1

- Introduce `textComplete:show`, `textComplete:hide` and `textComplete:select` events.

### October 28, 2013 - v0.1.0

- Now strategies argument is an Array of strategy objects.

### October 28, 2013 - v0.0.4

- Several bugfixes.
- Up and Down arrows cycle instead of exit.
- Support Zepto.
- Support jQuery.overlay.

### September 11, 2013 - v0.0.3

- Some performance improvement.
- Imprement lazy callbacking on search function.

### September 8, 2013 - v0.0.2

- Support IE8.
- Some performance improvement.
- Imprement cache option.

### September 2, 2013 - v0.0.1

- Initial release.

License
-------

Licensed under the MIT License
