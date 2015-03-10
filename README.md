Autocomplete for Textarea
=========================

[![npm version](https://badge.fury.io/js/jquery-textcomplete.svg)](http://badge.fury.io/js/jquery-textcomplete)
[![Bower version](https://badge.fury.io/bo/jquery-textcomplete.svg)](http://badge.fury.io/bo/jquery-textcomplete)
[![Analytics](https://ga-beacon.appspot.com/UA-4932407-14/jquery-textcomplete/readme)](https://github.com/igrigorik/ga-beacon)

Introduces autocompleting power to textareas, like a GitHub comment form has.

![Demo](http://yuku-t.com/jquery-textcomplete/media/images/demo.gif)

[Demo](http://yuku-t.com/jquery-textcomplete/).

Synopsis
--------

```js
$('textarea').textcomplete([{
    match: /(^|\s)(\w{2,})$/,
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

Dependencies
------------

- jQuery (>= 1.7.0) OR Zepto (>= 1.0)

Documents
---------

See [doc](https://github.com/yuku-t/jquery-textcomplete/tree/master/doc) dir.

License
-------

Licensed under the MIT License.

Credits
-------

### Contributors

Patches and code improvements were contributed by:

https://github.com/yuku-t/jquery-textcomplete/graphs/contributors
