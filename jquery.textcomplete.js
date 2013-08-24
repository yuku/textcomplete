;(function ($) {

  'use strict';

  /**
   * Exclusive execution control utility.
   */
  var lock = (function () {
    var table, i;
    table = {};
    i = 0;
    return function (func) {
      var id;
      id = i;
      i += 1;
      return function () {
        var args, free;
        if (table[id]) return;
        table[id] = true;
        free = function () { table[id] = false; };
        args = [free];
        func.apply(this, args.concat(toArray(arguments)));
      };
    };
  })();

  /**
   * Convert arguments into a real array.
   */
  var toArray = function (args) {
    var i, l, result;
    result = [];
    for (i = 0, l = args.length; i < l; i++) result[i] = args[i];
    return result;
  };

  /**
   * Bind the func to the context.
   */
  var bind = function (func, context) {
    if (func.bind) {
      // Use native Function#bind if it's available.
      return func.bind(context);
    } else {
      return function () {
        func.apply(context, arguments);
      };
    }
  };

  /**
   * Default template function.
   */
  var identity = function (obj) { return obj; };

  var Completer = (function () {
    var html, css;

    html = {
      wrapper: '<div class="js-textcomplete"></div>',
      list: '<span class="js-textcomplete-list"></span>',
      item: '<span class="js-textcomplete-item"></span>'
    };
    css = {
      wrapper: {
        position: 'relative',
        display: 'inline-block'
      },
      list: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: '100',
        display: 'none'
      },
      item: {
        position: 'relative',
        display: 'block'
      }
    };

    function Completer(el, strategies) {
      var $wrapper, $list;

      $wrapper = $(html.wrapper).css(css.wrapper);
      $list = $(html.list).css(css.list);

      this.el = el;
      this.$el = $(el);
      this.$el.wrap($wrapper).before($list);
      this.strategies = strategies;
    }

    $.extend(Completer.prototype, {
      // Callbacks
      // =========

      searchCallbackFactory: function (free) {
        var self = this;
        return function (data) {
          self.renderList(data);
          free();
        };
      },

      /**
       * Keyup event handler.
       */
      onKeyup: function (e) {
        var searchQuery, term;

        searchQuery = this.extractSearchQuery(this.getTextFromHeadToCaret());
        if (searchQuery.length) {
          term = searchQuery[1];
          if (this.term === term) return; // Ignore shift-key or something.
          this.term = term;
          this.search(searchQuery);
        } else {
          this.term = null;
          this.listView.deactivate();
        }
      },

      onSelect: function (value) {
        var pre, post;
        pre = this.getTextFromHeadToCaret();
        post = this.el.value.substring(this.el.selectionEnd);
        pre = pre.replace(this.strategy.match, this.strategy.replace(value));
        this.el.value = pre + post;
        this.el.focus();
        this.el.selectionStart = this.el.selectionEnd = pre.length;
      },
      /**
       * Returns caret's relative coordinates from textarea's left top corner.
       */
      getCaretPosition: function () {
        // Browser native API does not provide the way to know the position of
        // caret in pixels, so that here we use a kind of hack to accomplish
        // the aim. First of all it puts a div element and completely copies
        // the textarea's style to the element, then it inserts the text and a
        // span element into the textarea.
        // Consequently, the span element's position is the thing what we want.

        if (!this.el.selectionEnd) return;
        var css, styles, i, l, div, $div, span, $span, position;

        css = {
          position: 'absolute',
          overflow: 'auto',
          'white-space': 'pre-wrap',
          top: 0,
          left: -9999
        };
        styles = ['border-bottom-width', 'border-left-width',
          'border-right-width', 'border-top-width', 'font-family',
          'font-size', 'font-style', 'font-variant', 'font-weight',
          'height', 'letter-spacing', 'word-spacing', 'line-height',
          'padding-bottom', 'padding-left', 'padding-right', 'padding-top',
          'text-decoration', 'width'];
        for (i = 0, l = styles.length; i < l; i++) {
          css[styles[i]] = this.$el.css(styles[i]);
        }

        $div = $('<div></div>').css(css).text(this.getTextFromHeadToCaret());
        $span = $('<span></span>').text('&nbsp;').appendTo($div);
        this.$el.before($div);
        position = $span.position();
        position.top += $span.height() + 6;  // heuristic
        $div.remove();
        return position;
      },

      getTextFromHeadToCaret: function () {
        return this.el.value.substring(0, this.el.selectionEnd);
      },

      /**
       * Parse the value of textarea and extract search query.
       */
      extractSearchQuery: function (text) {
        // If a search query found, it returns used strategy and the query
        // term. If the caret is currently in a code block or search query does
        // not found, it returns an empty array.

        var name, strategy, match;
        for (name in this.strategies)
            if (this.strategies.hasOwnProperty(name)) {
          strategy = this.strategies[name];
          match = text.match(strategy.match);
          if (match) { return [strategy, match[strategy.index]]; }
        }
        return [];
      },

      search: lock(function (free, searchQuery) {
        var term, strategy;
        this.strategy = searchQuery[0];
        term = searchQuery[1];
        this.strategy.search(term, this.searchCallbackFactory(free));
      })

    });

    return Completer;
  })();

  $.fn.textcomplete = function (strategies) {
    this.each(function () {
      window.c = new Completer(this, strategies);
    });
  };

})(window.jQuery);
