+function ($) {
  'use strict';

  var include = function (zippedData, datum) {
    var i, elem;
    var idProperty = datum.strategy.idProperty
    for (i = 0; i < zippedData.length; i++) {
      elem = zippedData[i];
      if (elem.strategy !== datum.strategy) continue;
      if (idProperty) {
        if (elem.value[idProperty] === datum.value[idProperty]) return true;
      } else {
        if (elem.value === datum.value) return true;
      }
    }
    return false;
  };

  var dropdownViews = {};
  $(document).bind('click', function (e) {
    var id = e.originalEvent && e.originalEvent.keepTextCompleteDropdown;
    $.each(dropdownViews, function (key, view) {
      if (key !== id) { view.deactivate(); }
    });
  });

  // Dropdown view
  // =============

  // Construct Dropdown object.
  //
  // element - Textarea or contenteditable element.
  function Dropdown(element, completer, option) {
    this.$el       = Dropdown.findOrCreateElement(option);
    this.completer = completer;
    this.id        = completer.id + 'dropdown';
    this._data     = []; // zipped data.
    this.$inputEl  = $(element);
    this.option    = option;

    // Override setPosition method.
    if (option.listPosition) { this.setPosition = option.listPosition; }
    if (option.height) { this.$el.height(option.height); }
    var self = this;
    $.each(['maxCount', 'placement', 'footer', 'header', 'className'], function (_i, name) {
      if (option[name] != null) { self[name] = option[name]; }
    });
    this._bindEvents(element);
    dropdownViews[this.id] = this;
  }

  $.extend(Dropdown, {
    // Class methods
    // -------------

    findOrCreateElement: function (option) {
      var $parent = option.appendTo;
      if (!($parent instanceof $)) { $parent = $($parent); }
      var $el = $parent.children('.dropdown-menu')
      if (!$el.length) {
        $el = $('<ul class="dropdown-menu"></ul>').css({
          display: 'none',
          left: 0,
          position: 'absolute',
          zIndex: option.zIndex
        }).appendTo($parent);
      }
      return $el;
    }
  });

  $.extend(Dropdown.prototype, {
    // Public properties
    // -----------------

    $el:       null,  // jQuery object of ul.dropdown-menu element.
    $inputEl:  null,  // jQuery object of target textarea.
    completer: null,
    footer:    null,
    header:    null,
    id:        null,
    maxCount:  10,
    placement: '',
    shown:     false,
    data:      [],     // Shown zipped data.
    className: '',

    // Public methods
    // --------------

    destroy: function () {
      // Don't remove $el because it may be shared by several textcompletes.
      this.deactivate();

      this.$el.off('.' + this.id);
      this.$inputEl.off('.' + this.id);
      this.clear();
      this.$el = this.$inputEl = this.completer = null;
      delete dropdownViews[this.id]
    },

    render: function (zippedData) {
      var contentsHtml = this._buildContents(zippedData);
      var unzippedData = $.map(this.data, function (d) { return d.value; });
      if (this.data.length) {
        this._renderHeader(unzippedData);
        this._renderFooter(unzippedData);
        if (contentsHtml) {
          this._renderContents(contentsHtml);
          this._activateIndexedItem();
        }
        this._setScroll();
      } else if (this.shown) {
        this.deactivate();
      }
    },

    setPosition: function (position) {
      this.$el.css(this._applyPlacement(position));
      return this;
    },

    clear: function () {
      this.$el.html('');
      this.data = [];
      this._index = 0;
      this._$header = this._$footer = null;
    },

    activate: function () {
      if (!this.shown) {
        this.clear();
        this.$el.show();
        if (this.className) { this.$el.addClass(this.className); }
        this.completer.fire('textComplete:show');
        this.shown = true;
      }
      return this;
    },

    deactivate: function () {
      if (this.shown) {
        this.$el.hide();
        if (this.className) { this.$el.removeClass(this.className); }
        this.completer.fire('textComplete:hide');
        this.shown = false;
      }
      return this;
    },

    isUp: function (e) {
      return e.keyCode === 38 || (e.ctrlKey && e.keyCode === 80);  // UP, Ctrl-P
    },

    isDown: function (e) {
      return e.keyCode === 40 || (e.ctrlKey && e.keyCode === 78);  // DOWN, Ctrl-N
    },

    isEnter: function (e) {
      var modifiers = e.ctrlKey || e.altKey || e.metaKey || e.shiftKey;
      return !modifiers && (e.keyCode === 13 || e.keyCode === 9 || (this.option.completeOnSpace === true && e.keyCode === 32))  // ENTER, TAB
    },

    isPageup: function (e) {
      return e.keyCode === 33;  // PAGEUP
    },

    isPagedown: function (e) {
      return e.keyCode === 34;  // PAGEDOWN
    },

    // Private properties
    // ------------------

    _data:    null,  // Currently shown zipped data.
    _index:   null,
    _$header: null,
    _$footer: null,

    // Private methods
    // ---------------

    _bindEvents: function () {
      this.$el.bind('mousedown.' + this.id, '.textcomplete-item', $.proxy(this._onClick, this))
      this.$el.bind('mouseover.' + this.id, '.textcomplete-item', $.proxy(this._onMouseover, this));
      this.$inputEl.bind('keydown.' + this.id, $.proxy(this._onKeydown, this));
    },

    _onClick: function (e) {
      var $el = $(e.target);
      e.preventDefault();
      e.originalEvent.keepTextCompleteDropdown = this.id;
      if (!$el.hasClass('textcomplete-item')) {
        $el = $el.closest('.textcomplete-item');
      }
      var datum = this.data[parseInt($el.data('index'), 10)];
      this.completer.select(datum.value, datum.strategy);
      var self = this;
      // Deactive at next tick to allow other event handlers to know whether
      // the dropdown has been shown or not.
      setTimeout(function () { self.deactivate(); }, 0);
    },

    // Activate hovered item.
    _onMouseover: function (e) {
      var $el = $(e.target);
      e.preventDefault();
      if (!$el.hasClass('textcomplete-item')) {
        $el = $el.closest('.textcomplete-item');
      }
      this._index = parseInt($el.data('index'), 10);
      this._activateIndexedItem();
    },

    _onKeydown: function (e) {
      if (!this.shown) { return; }
      if (this.isUp(e)) {
        e.preventDefault();
        this._up();
      } else if (this.isDown(e)) {
        e.preventDefault();
        this._down();
      } else if (this.isEnter(e)) {
        e.preventDefault();
        this._enter();
      } else if (this.isPageup(e)) {
        e.preventDefault();
        this._pageup();
      } else if (this.isPagedown(e)) {
        e.preventDefault();
        this._pagedown();
      }
    },

    _up: function () {
      if (this._index === 0) {
        this._index = this.data.length - 1;
      } else {
        this._index -= 1;
      }
      this._activateIndexedItem();
      this._setScroll();
    },

    _down: function () {
      if (this._index === this.data.length - 1) {
        this._index = 0;
      } else {
        this._index += 1;
      }
      this._activateIndexedItem();
      this._setScroll();
    },

    _enter: function () {
      var datum = this.data[parseInt(this._getActiveElement().data('index'), 10)];
      this.completer.select(datum.value, datum.strategy);
      this._setScroll();
    },

    _pageup: function () {
      var target = 0;
      var threshold = this._getActiveElement().position().top - this.$el.innerHeight();
      this.$el.children().each(function (i) {
        if ($(this).position().top + $(this).outerHeight() > threshold) {
          target = i;
          return false;
        }
      });
      this._index = target;
      this._activateIndexedItem();
      this._setScroll();
    },

    _pagedown: function () {
      var target = this.data.length - 1;
      var threshold = this._getActiveElement().position().top + this.$el.innerHeight();
      this.$el.children().each(function (i) {
        if ($(this).position().top > threshold) {
          target = i;
          return false
        }
      });
      this._index = target;
      this._activateIndexedItem();
      this._setScroll();
    },

    _activateIndexedItem: function () {
      this.$el.find('.textcomplete-item.active').removeClass('active');
      this._getActiveElement().addClass('active');
    },

    _getActiveElement: function () {
      return this.$el.children('.textcomplete-item:nth(' + this._index + ')');
    },

    _setScroll: function () {
      var $activeEl = this._getActiveElement();
      var itemTop = $activeEl.position().top;
      var itemHeight = $activeEl.outerHeight();
      var visibleHeight = this.$el.innerHeight();
      var visibleTop = this.$el.scrollTop();
      if (this._index === 0 || this._index == this.data.length - 1 || itemTop < 0) {
        this.$el.scrollTop(itemTop + visibleTop);
      } else if (itemTop + itemHeight > visibleHeight) {
        this.$el.scrollTop(itemTop + itemHeight + visibleTop - visibleHeight);
      }
    },

    _buildContents: function (zippedData) {
      var datum, i, index;
      var html = '';
      for (i = 0; i < zippedData.length; i++) {
        if (this.data.length === this.maxCount) break;
        datum = zippedData[i];
        if (include(this.data, datum)) { continue; }
        index = this.data.length;
        this.data.push(datum);
        html += '<li class="textcomplete-item" data-index="' + index + '"><a>';
        html +=   datum.strategy.template(datum.value);
        html += '</a></li>';
      }
      return html;
    },

    _renderHeader: function (unzippedData) {
      if (this.header) {
        if (!this._$header) {
          this._$header = $('<li class="textcomplete-header"></li>').prependTo(this.$el);
        }
        var html = $.isFunction(this.header) ? this.header(unzippedData) : this.header;
        this._$header.html(html);
      }
    },

    _renderFooter: function (unzippedData) {
      if (this.footer) {
        if (!this._$footer) {
          this._$footer = $('<li class="textcomplete-footer"></li>').appendTo(this.$el);
        }
        var html = $.isFunction(this.footer) ? this.footer(unzippedData) : this.footer;
        this._$footer.html(html);
      }
    },

    _renderContents: function (html) {
      if (this._$footer) {
        this._$footer.before(html);
      } else {
        this.$el.append(html);
      }
    },

    _applyPlacement: function (position) {
      // If the 'placement' option set to 'top', move the position above the element.
      if (this.placement.indexOf('top') !== -1) {
        // Overwrite the position object to set the 'bottom' property instead of the top.
        position = {
          top: 'auto',
          bottom: this.$el.parent().height() - position.top + position.lineHeight,
          left: position.left
        };
      } else {
        position.bottom = 'auto';
        delete position.lineHeight;
      }
      if (this.placement.indexOf('absleft') !== -1) {
        position.left = 0;
      } else if (this.placement.indexOf('absright') !== -1) {
        position.right = 0;
        position.left = 'auto';
      }
      return position;
    }
  });

  $.fn.textcomplete.Dropdown = Dropdown;
}(jQuery);
