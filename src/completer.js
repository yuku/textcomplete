+function ($) {
  'use strict';

  // Exclusive execution control utility.
  //
  // func - The function to be locked. It is executed with a function named
  //        `free` as the first argument. Once it is called, additional
  //        execution are ignored until the free is invoked. Then the last
  //        ignored execution will be replayed immediately.
  //
  // Examples
  //
  //   var lockedFunc = lock(function (free) {
  //     setTimeout(function { free(); }, 1000); // It will be free in 1 sec.
  //     console.log('Hello, world');
  //   });
  //   lockedFunc();  // => 'Hello, world'
  //   lockedFunc();  // none
  //   lockedFunc();  // none
  //   // 1 sec past then
  //   // => 'Hello, world'
  //   lockedFunc();  // => 'Hello, world'
  //   lockedFunc();  // none
  //
  // Returns a wrapped function.
  var lock = function (func) {
    var locked, queuedArgsToReplay;

    return function () {
      // Convert arguments into a real array.
      var args = Array.prototype.slice.call(arguments);
      if (locked) {
        // Keep a copy of this argument list to replay later.
        // OK to overwrite a previous value because we only replay
        // the last one.
        queuedArgsToReplay = args;
        return;
      }
      locked = true;
      var self = this;
      args.unshift(function replayOrFree() {
        if (queuedArgsToReplay) {
          // Other request(s) arrived while we were locked.
          // Now that the lock is becoming available, replay
          // the latest such request, then call back here to
          // unlock (or replay another request that arrived
          // while this one was in flight).
          var replayArgs = queuedArgsToReplay;
          queuedArgsToReplay = undefined;
          replayArgs.unshift(replayOrFree);
          func.apply(self, replayArgs);
        } else {
          locked = false;
        }
      });
      func.apply(this, args);
    };
  };

  var isString = function (obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  };

  var uniqueId = 0;

  function Completer(element, option) {
    this.$el        = $(element);
    this.id         = 'textcomplete' + uniqueId++;
    this.strategies = [];
    this.views      = [];
    this.option     = $.extend({}, Completer.defaults, option);

    if (!this.$el.is('input[type=text]') && !this.$el.is('input[type=search]') && !this.$el.is('textarea') && !element.isContentEditable && element.contentEditable != 'true') {
      throw new Error('textcomplete must be called on a Textarea or a ContentEditable.');
    }

    // use ownerDocument to fix iframe / IE issues
    if (element === element.ownerDocument.activeElement) {
      // element has already been focused. Initialize view objects immediately.
      this.initialize()
    } else {
      // Initialize view objects lazily.
      var self = this;
      this.$el.one('focus.' + this.id, function () { self.initialize(); });

      // Special handling for CKEditor: lazy init on instance load
      if ((!this.option.adapter || this.option.adapter == 'CKEditor') && typeof CKEDITOR != 'undefined' && (this.$el.is('textarea'))) {
        CKEDITOR.on("instanceReady", function(event) {
          event.editor.once("focus", function(event2) {
            // replace the element with the Iframe element and flag it as CKEditor
            self.$el = $(event.editor.editable().$);
            if (!self.option.adapter) {
              self.option.adapter = $.fn.textcomplete['CKEditor'];
              self.option.ckeditor_instance = event.editor;
            }
            self.initialize();
          });
        });
      }
    }
  }

  Completer.defaults = {
    appendTo: 'body',
    className: '',  // deprecated option
    dropdownClassName: 'dropdown-menu textcomplete-dropdown',
    maxCount: 10,
    zIndex: '100',
    rightEdgeOffset: 30
  };

  $.extend(Completer.prototype, {
    // Public properties
    // -----------------

    id:         null,
    option:     null,
    strategies: null,
    adapter:    null,
    dropdown:   null,
    $el:        null,
    $iframe:    null,

    // Public methods
    // --------------

    initialize: function () {
      var element = this.$el.get(0);
      
      // check if we are in an iframe
      // we need to alter positioning logic if using an iframe
      if (this.$el.prop('ownerDocument') !== document && window.frames.length) {
        for (var iframeIndex = 0; iframeIndex < window.frames.length; iframeIndex++) {
          if (this.$el.prop('ownerDocument') === window.frames[iframeIndex].document) {
            this.$iframe = $(window.frames[iframeIndex].frameElement);
            break;
          }
        }
      }
      
      
      // Initialize view objects.
      this.dropdown = new $.fn.textcomplete.Dropdown(element, this, this.option);
      var Adapter, viewName;
      if (this.option.adapter) {
        Adapter = this.option.adapter;
      } else {
        if (this.$el.is('textarea') || this.$el.is('input[type=text]') || this.$el.is('input[type=search]')) {
          viewName = typeof element.selectionEnd === 'number' ? 'Textarea' : 'IETextarea';
        } else {
          viewName = 'ContentEditable';
        }
        Adapter = $.fn.textcomplete[viewName];
      }
      this.adapter = new Adapter(element, this, this.option);
    },

    destroy: function () {
      this.$el.off('.' + this.id);
      if (this.adapter) {
        this.adapter.destroy();
      }
      if (this.dropdown) {
        this.dropdown.destroy();
      }
      this.$el = this.adapter = this.dropdown = null;
    },

    deactivate: function () {
      if (this.dropdown) {
        this.dropdown.deactivate();
      }
    },

    // Invoke textcomplete.
    trigger: function (text, skipUnchangedTerm) {
      if (!this.dropdown) { this.initialize(); }
      text != null || (text = this.adapter.getTextFromHeadToCaret());
      var searchQuery = this._extractSearchQuery(text);
      if (searchQuery.length) {
        var term = searchQuery[1];
        // Ignore shift-key, ctrl-key and so on.
        if (skipUnchangedTerm && this._term === term && term !== "") { return; }
        this._term = term;
        this._search.apply(this, searchQuery);
      } else {
        this._term = null;
        this.dropdown.deactivate();
      }
    },

    fire: function (eventName) {
      var args = Array.prototype.slice.call(arguments, 1);
      this.$el.trigger(eventName, args);
      return this;
    },

    register: function (strategies) {
      Array.prototype.push.apply(this.strategies, strategies);
    },

    // Insert the value into adapter view. It is called when the dropdown is clicked
    // or selected.
    //
    // value    - The selected element of the array callbacked from search func.
    // strategy - The Strategy object.
    // e        - Click or keydown event object.
    select: function (value, strategy, e) {
      this._term = null;
      this.adapter.select(value, strategy, e);
      this.fire('change').fire('textComplete:select', value, strategy);
      this.adapter.focus();
    },

    // Private properties
    // ------------------

    _clearAtNext: true,
    _term:        null,

    // Private methods
    // ---------------

    // Parse the given text and extract the first matching strategy.
    //
    // Returns an array including the strategy, the query term and the match
    // object if the text matches an strategy; otherwise returns an empty array.
    _extractSearchQuery: function (text) {
      for (var i = 0; i < this.strategies.length; i++) {
        var strategy = this.strategies[i];
        var context = strategy.context(text);
        if (context || context === '') {
          var matchRegexp = $.isFunction(strategy.match) ? strategy.match(text) : strategy.match;
          if (isString(context)) { text = context; }
          var match = text.match(matchRegexp);
          if (match) { return [strategy, match[strategy.index], match]; }
        }
      }
      return []
    },

    // Call the search method of selected strategy..
    _search: lock(function (free, strategy, term, match) {
      var self = this;
      strategy.search(term, function (data, stillSearching) {
        if (!self.dropdown.shown) {
          self.dropdown.activate();
        }
        if (self._clearAtNext) {
          // The first callback in the current lock.
          self.dropdown.clear();
          self._clearAtNext = false;
        }
        self.dropdown.setPosition(self.adapter.getCaretPosition());
        self.dropdown.render(self._zip(data, strategy, term));
        if (!stillSearching) {
          // The last callback in the current lock.
          free();
          self._clearAtNext = true; // Call dropdown.clear at the next time.
        }
      }, match);
    }),

    // Build a parameter for Dropdown#render.
    //
    // Examples
    //
    //  this._zip(['a', 'b'], 's');
    //  //=> [{ value: 'a', strategy: 's' }, { value: 'b', strategy: 's' }]
    _zip: function (data, strategy, term) {
      return $.map(data, function (value) {
        return { value: value, strategy: strategy, term: term };
      });
    }
  });

  $.fn.textcomplete.Completer = Completer;
}(jQuery);
