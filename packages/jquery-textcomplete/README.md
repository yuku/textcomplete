jquery-textcomplete is no longer maintained. Please use [textcomplete](https://github.com/yuku/textcomplete) instead.

# Autocomplete for Textarea

> Introduces autocompleting power to textareas, like a GitHub comment form has.

[![npm version](https://badge.fury.io/js/jquery-textcomplete.svg)](http://badge.fury.io/js/jquery-textcomplete)

## Synopsis

```js
$('textarea').textcomplete([{
    match: /(^|\b)(\w{2,})$/,
    search: function (term, callback) {
        var words = ['google', 'facebook', 'github', 'microsoft', 'yahoo'];
        callback($.map(words, function (word) {
            return word.indexOf(term) === 0 ? word : null;
        }));
    },
    replace: function (word) {
        return word + ' ';
    }
}]);
```

## Dependencies

- jQuery (>= 1.7.0) OR Zepto (>= 1.0)

## Documents

See [doc](https://github.com/yuku-t/jquery-textcomplete/tree/master/doc) dir.

## License

Licensed under the MIT License.

## Contributors

Patches and code improvements were contributed by:

https://github.com/yuku-t/jquery-textcomplete/graphs/contributors
