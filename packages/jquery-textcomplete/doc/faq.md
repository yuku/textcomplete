FAQ
===

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

### I want to search case-insensitivly.

You can do case-insensitive comparison inside the search callback:

```js
search: function (term, callback) {
    term = term.toLowerCase();
    callback($.map(words, function (word) {
        return word.toLowerCase().indexOf(term) === 0 ? word : null;
    }));
},
```

or normalize the term with `context`:

```js
context: function (text) { return text.toLowerCase(); },
```
