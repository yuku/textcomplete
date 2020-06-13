Textcomplete provides custom events for most actions. Generally, these come in an infinitive and past participle form - where the infinitive (ex. `show`) is triggered at the start of an event, and its past participle form (ex. `shown`) is triggered on the completion of an action.

An infinitive events provide `preventDefault` functionality. This provides the ability to stop the execution of an action before it starts.

Event Type | Description 
-----------|---------------------------------------------------------------------------------------------------------------------------
show       | This event is fired immediately when the dropdown is going to be shown.
shown      | This event is fired when the dropdown has been made visible to the user (will wait for CSS transitions to complete).
render     | This event is fired immediately when dropdown items are goint to be visible to the user.
rendered   | This event is fired when the dropdown items have been visible to the user (will wait for CSS transitions to complete).
select     | This event is fired immediately when a dropdown item is selected.
selected   | This event is fired when the selected dropdown item was applied to the editor (will wait for CSS transitions to complete).
hide       | This event is fired immediately when the dropdown is going to be hidden.
hidden     | This event is fired when the dropdown has finished being hidden from the user (will wait for CSS transitions to complete).

The native `input` event is dispatched to the textarea element when its value is changed because a search result has been selected.
