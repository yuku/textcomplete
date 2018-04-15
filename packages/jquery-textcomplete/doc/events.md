Events
======

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
