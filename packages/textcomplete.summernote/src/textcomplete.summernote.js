import Editor, {ENTER, UP, DOWN, OTHER} from 'textcomplete/lib/editor';

import bindAll from 'lodash.bindall';

const CALLBACK_METHODS = ['onKeydown', 'onKeyup'];

/**
 * @extends Editor
 * @prop {JQuery} $el
 */
class Summernote extends Editor {
  /**
   * @param {JQuery} $el - the jQuery object.
   */
  constructor($el) {
    super();
    this.$el = $el;

    bindAll(this, CALLBACK_METHODS);
    this.startListening();
  }

  /** @override */
  finalize() {
    super.finalize();
    this.stopListening();
    this.$el = null;
    return this;
  }

  onKeydown(we, e) {
  }

  onKeyup(we, e) {
  }

  /**
   * @private
   */
  startListening() {
    this.$el.on('summernote.keydown', this.onKeydown);
    this.$el.on('summernote.keyup', this.onKeyup);
  }

  /**
   * @private
   */
  stopListening() {
    this.$el.off('summernote.keydown', this.onKeydown);
    this.$el.off('summernote.keyup', this.onKeyup);
  }
}
