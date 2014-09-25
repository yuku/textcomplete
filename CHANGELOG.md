# Changelog

## `v0.3.3` - Sep 25, 2014.

- Add `className` option.
- [Fix #118] Ignore `.textcomplete('destory')` on non-initialized elements.
- [Fix #119] Trigger completer with the current text by default.
- [Fix #120] Hide dropdown before destroying it.
- [Fix #121] Don't throw an exception even if a jquery click event is manually triggered.
- Add `match` as the third argument of a search function.

## `v0.3.2` - Sep 16, 2014

- Add `IETextarea` adapter which supports IE8
- Add `idProperty` option.
- Add `adapter` option.
- Rename `Input` as `Adapter`.

## `v0.3.1` - Sep 10, 2014

- Add `context` strategy option.
- Recycle `.dropdown-menu` element if available.
- Add `debounce` option.

## `v0.3.0` - Sep 10, 2014

- Revive `header` and `footer` options.
- Consider the `tab-size` of textarea.
- Revive `height` option.
- Add `zIndex` option.

## `v0.3.0-beta2` - Sep 9, 2014

- Make sure that all demos work fine.

## `v0.3.0-beta1` - Aug 31, 2014

- Huge refactoring.

## `v0.2.6` - Aug 16, 2014

- Repair contenteditable.

## `v0.2.5` - Aug 7, 2014

- Enhance contenteditable support. [[#98]](https://github.com/yuku-t/jquery-textcomplete/pull/98) (Thanks for [@mikol](https://github.com/mikol))
- Support absolute left/right placement. [[#96]](https://github.com/yuku-t/jquery-textcomplete/pull/96) (Thanks for [@ericktai](https://github.com/ericktai))
- Support absolute height, scrollbar, pageup and pagedown. [[#87]](https://github.com/yuku-t/jquery-textcomplete/pull/87) (Thanks for [@alan2wong](https://github.com/alan2wong))

## `v0.2.4` - Jul 2, 2014

- Fix horizonal position on contentEditable elements. [[#92]](https://github.com/yuku-t/jquery-textcomplete/pull/92)

## `v0.2.3` - Jun 24, 2014

- Option to supply list view position function. [[#88]](https://github.com/yuku-t/jquery-textcomplete/pull/88)

## `v0.2.2` - Jun 8, 2014 

- Append dropdown element to body element by default.
- Tiny refactoring. [#84]
- Ignore tab key when modifier keys are being pushed. [[#85]](https://github.com/yuku-t/jquery-textcomplete/pull/85)
- Manual triggering.

## `v0.2.1` - May 15, 2014

- Support `appendTo` option.
- `header` and `footer` supports a function.
- Remove textcomplate-wrapper element.

## `v0.2` - May 2, 2014

- Contenteditable support.
- Several bugfixes.
- Support `header` and `footer` setting.

## `v0.1.4.1` - April 4, 2014

- Support placement option.
- Emacs-style prev/next keybindings.
- Replay searchFunc for the last term on slow network env.
- Several bugfixes.

## `v0.1.3` - March 7, 2014

- Several bugfixes.
- Support RTL positioning.

## `v0.1.2` - February 8, 2014

- Enable to append strategies on the fly.
- Enable to stop autocompleting.
- Enable to apply multiple textareas at once.
- Don't show popup on pressing arrow up and down keys.
- Hide dropdown by pressing ESC key.
- Prevent showing a dropdown when it just autocompleted.
- ~~Support RTL positioning.~~

## `v0.1.1` - February 2, 2014

- Introduce `textComplete:show`, `textComplete:hide` and `textComplete:select` events.

## `v0.1.0` - October 28, 2013

- Now strategies argument is an Array of strategy objects.

## `v0.0.4` - October 28, 2013

- Several bugfixes.
- Up and Down arrows cycle instead of exit.
- Support Zepto.
- Support jQuery.overlay.

## `v0.0.3` - September 11, 2013

- Some performance improvement.
- Implement lazy callbacking on search function.

## `v0.0.2` - September 8, 2013

- Support IE8.
- Some performance improvement.
- Implement cache option.

## `v0.0.1` - September 2, 2013

- Initial release.
