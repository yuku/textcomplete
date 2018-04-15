# Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/) by version 1.0.0.

This change log adheres to [keepachangelog.com](http://keepachangelog.com).

## [Unreleased]

## [1.8.4] - 2017-08-29
### Fixed
- On IE: Correct alignment of jquery-textcomplete-dropdown when scrolling down in iframe ([#310](https://github.com/yuku-t/jquery-textcomplete/pull/310))

## [1.8.3] - 2017-08-29
### Fixed
- Fix splitting text nodes when moving caret in contenteditable ([#311](https://github.com/yuku-t/jquery-textcomplete/pull/311))

## [1.8.2] - 2017-07-11
### Fixed
- Fix for multiple ckeditors ([#309](https://github.com/yuku-t/jquery-textcomplete/pull/309))

## [1.8.1] - 2017-06-27
### Fixed
- Attach textcomplete to the active CKEditor only ([#294](https://github.com/yuku-t/jquery-textcomplete/pull/294))

## [1.8.0] - 2016-11-15
### Added
- Skip search after pressing shift, ctrl, alt, pageup and pagedown keys ([#292](https://github.com/yuku-t/jquery-textcomplete/pull/292))

## [1.7.3] - 2016-09-20
### Fixed
- Remove dependency on Redmine / issue_notes undefined ([#288](https://github.com/yuku-t/jquery-textcomplete/pull/288))

## [1.7.2] - 2016-09-12
### Fixed
- Fixed issue #258 Control gets stuck when callback function triggered with empty array ([#261](https://github.com/yuku-t/jquery-textcomplete/pull/261))

## [1.7.1] - 2016-08-29
### Added
- Build dist files

## [1.7.0] - 2016-08-29
### Added
- Add `rightEdgeOffset` option ([#281](https://github.com/yuku-t/jquery-textcomplete/pull/281))

## [1.6.3] - 2016-08-26
### Fixed
- Reverts v1.6.2 ([#284](https://github.com/yuku-t/jquery-textcomplete/pull/284))

## [1.6.2] - 2016-07-08
### Fixed
- Fix dropdown showing out of viewport ([#262](https://github.com/yuku-t/jquery-textcomplete/pull/262))

## [1.6.1] - 2016-07-08
### Fixed
- Support for match functions in select phase ([#272](https://github.com/yuku-t/jquery-textcomplete/pull/272))

## [1.6.0] - 2016-06-28
### Added
- Don't search on Esc key ([#269](https://github.com/yuku-t/jquery-textcomplete/pull/269))

### Fixed
- Set lineheight for textareas ([#263](https://github.com/yuku-t/jquery-textcomplete/pull/263))

## [1.5.0] - 2016-06-07
### Added
- Add dropdownClassName option

## [1.4.0] - 2016-06-01
### Added
- Add CKEditor adapter ([#253](https://github.com/yuku-t/jquery-textcomplete/pull/253)

## [1.3.5] - 2016-05-27
### Fixed
- better support for contenteditables in iframes (ckeditor, tinymce, etc) ([#252](https://github.com/yuku-t/jquery-textcomplete/pull/252))

## [1.3.4] - 2016-04-20
### Fixed
- Fix endless loop when RTL ([#247](https://github.com/yuku-t/jquery-textcomplete/pull/247))

## [1.3.3] - 2016-04-04
### Fixed
- Fix uncaught TypeError.

## [1.3.2] - 2016-03-27
### Fixed
- Fix dropdown position problem with `line-height: normal`.

## [1.3.1] - 2016-03-23
### Fixed
- Fix `input[type=search]` support.

## [1.3.0] - 2016-03-20
### Added
- Add optional "id" strategy parameter.

## [1.2.2] - 2016-03-19
### Fixed
- Remove dropdown element after `textcomplete('destroy')`.
- Skip search after pressing tab.
- Fix dropdown-menu positioning problem using textarea-caret package.

## [1.2.1] - 2016-03-14
### Fixed
- Build dist files.

## [1.2.0] - 2016-03-14
### Added
- Support `input[type=search]` ([#236](https://github.com/yuku-t/jquery-textcomplete/pull/236))

## [1.1.0] - 2016-03-10
### Added
- Add the ability to insert HTML into a "contenteditable" field. ([#217](https://github.com/yuku-t/jquery-textcomplete/pull/217))

### Fixed
- Position relative to appendTo element. ([#234](https://github.com/yuku-t/jquery-textcomplete/pull/234))
- Avoid dropdown bumping into right edge of window. ([#235](https://github.com/yuku-t/jquery-textcomplete/pull/235))
- Fix top position issue when window is scrolled up and parents has fix position. ([#229](https://github.com/yuku-t/jquery-textcomplete/pull/229))

## [1.0.0] - 2016-02-29
### Changed
- Adheres keepachangelog.com.

## [0.8.2] - 2016-02-29
### Added
- Add deactivate method to Completer. ([#233](https://github.com/yuku-t/jquery-textcomplete/pull/233))

## [0.8.1] - 2015-10-22
### Added
- Add condition to ignore skipUnchangedTerm for empty text. ([#210](https://github.com/yuku-t/jquery-textcomplete/pull/210))

## [0.8.0] - 2015-08-31
### Changed
- If undefined is returned from a replace callback dont replace the text. ([#204](https://github.com/yuku-t/jquery-textcomplete/pull/204))

## [0.7.3] - 2015-08-27
### Added
- Add `Strategy#el` and `Strategy#$el` which returns current input/textarea element and corresponding jquery object respectively.

## [0.7.2] - 2015-08-26
### Fixed
- Reset \_term after selected ([#170](https://github.com/yuku-t/jquery-textcomplete/pull/170))

## [0.7.1] - 2015-08-19
### Changed
- Remove RTL support because of some bugs.

## [0.7.0] - 2015-07-02
### Add
- Add support for a "no results" message like the header/footer. ([#179](https://github.com/yuku-t/jquery-textcomplete/pull/179))
- Yield the search term to the template function. ([#177](https://github.com/yuku-t/jquery-textcomplete/pull/177))
- Add amd wrapper. ([#167](https://github.com/yuku-t/jquery-textcomplete/pull/167))
- Add touch devices support. ([#163](https://github.com/yuku-t/jquery-textcomplete/pull/163))

### Changed
- Stop sharing a dropdown element.

## [0.6.1] - 2015-06-30
### Fixed
- Fix bug that Dropdown.\_fitToBottom does not consider window scroll

## [0.6.0] - 2015-06-30
### Added
- Now dropdown elements have "textcomplete-dropdown" class.

## [0.5.2] - 2015-06-29
### Fixed
- Keep dropdown list in browser window. ([#172](https://github.com/yuku-t/jquery-textcomplete/pull/172))

## [0.5.1] - 2015-06-08
### Changed
- Now a replace function is invoked with a user event.

## [0.5.0] - 2015-06-08
### Added
- Support `onKeydown` option.

## [0.4.0] - 2015-03-10
### Added
- Publish to [npmjs](https://www.npmjs.com/package/jquery-textcomplete).
- Support giving a function which returns a regexp to `match` option for dynamic matching.

## [0.3.9] - 2015-03-03
### Fixed
- Deactivate dropdown on escape. ([#155](https://github.com/yuku-t/jquery-textcomplete/pull/155))

## [0.3.8] - 2015-02-26
### Fixed
- Fix completion with enter key. ([#154](https://github.com/yuku-t/jquery-textcomplete/pull/154))
- Fix empty span node is inserted. ([#153](https://github.com/yuku-t/jquery-textcomplete/pull/153))

## [0.3.7] - 2015-01-21
### Added
- Support input([type=text]. [#149](https://github.com/yuku-t/jquery-textcomplete/pull/149))

## [0.3.6] - 2014-12-11
### Added
- Support element.contentEditable compatibility check. ([#147](https://github.com/yuku-t/jquery-textcomplete/pull/147))

### Fixed
- Fixes the fire function for events with additional parameters. ([#145](https://github.com/yuku-t/jquery-textcomplete/pull/145))

## [0.3.5] - 2014-12-11
### Added
- Adds functionality to complete selection on space key. ([#141](https://github.com/yuku-t/jquery-textcomplete/pull/141))

### Fixed
- Loading script in head and destroy method bugfixes. ([#143](https://github.com/yuku-t/jquery-textcomplete/pull/143))

## [0.3.4] - 2014-12-03
### Fixed
- Fix error when destroy is called before the field is focused. ([#138](https://github.com/yuku-t/jquery-textcomplete/pull/138))
- Fix IE bug where it would only trigger when tha carrot was at the end of the line. ([#133](https://github.com/yuku-t/jquery-textcomplete/pull/133))

## [0.3.3] - 2014-09-25
### Added
- Add `className` option.
- Add `match` as the third argument of a search function.

### Fixed
- Ignore `.textcomplete('destory')` on non-initialized elements. ([#118](https://github.com/yuku-t/jquery-textcomplete/pull/118))
- Trigger completer with the current text by default. ([#119](https://github.com/yuku-t/jquery-textcomplete/pull/119))
- Hide dropdown before destroying it. ([#120](https://github.com/yuku-t/jquery-textcomplete/pull/120))
- Don't throw an exception even if a jquery click event is manually triggered. ([#121](https://github.com/yuku-t/jquery-textcomplete/pull/121))

## [0.3.2] - 2014-09-16
### Added
- Add `IETextarea` adapter which supports IE8
- Add `idProperty` option.
- Add `adapter` option.

### Changed
- Rename `Input` as `Adapter`.

## [0.3.1] - 2014-09-10
### Added
- Add `context` strategy option.
- Add `debounce` option.

### Changed
- Recycle `.dropdown-menu` element if available.

## [0.3.0] - 2014-09-10
### Added
- Consider the `tab-size` of textarea.
- Add `zIndex` option.

### Fixed
- Revive `header` and `footer` options.
- Revive `height` option.

## [0.3.0-beta2] - 2014-09-09
### Fixed
- Make sure that all demos work fine.

## [0.3.0-beta1] - 2014-08-31
### Fixed
- Huge refactoring.

## [0.2.6] - 2014-08-16
### Fixed
- Repair contenteditable.

## [0.2.5] - 2014-08-07
### Added
- Enhance contenteditable support. ([#98](https://github.com/yuku-t/jquery-textcomplete/pull/98))
- Support absolute left/right placement. ([#96](https://github.com/yuku-t/jquery-textcomplete/pull/96))
- Support absolute height, scrollbar, pageup and pagedown. ([#87](https://github.com/yuku-t/jquery-textcomplete/pull/87))

## [0.2.4] - 2014-07-02
### Fixed
- Fix horizonal position on contentEditable elements. ([#92](https://github.com/yuku-t/jquery-textcomplete/pull/92))

## [0.2.3] - 2014-06-24
### Added
- Option to supply list view position function. ([#88](https://github.com/yuku-t/jquery-textcomplete/pull/88))

## [0.2.2] - 2014-06-08
### Added
- Append dropdown element to body element by default.
- Tiny refactoring. [#84]
- Ignore tab key when modifier keys are being pushed. ([#85](https://github.com/yuku-t/jquery-textcomplete/pull/85))
- Manual triggering.

## [0.2.1] - 2014-05-15
### Added
- Support `appendTo` option.
- `header` and `footer` supports a function.

### Changed
- Remove textcomplate-wrapper element.

## [0.2.0] - 2014-05-02
### Added
- Contenteditable support.
- Several bugfixes.
- Support `header` and `footer` setting.

## [0.1.4.1] - 2014-04-04
### Added
- Support placement option.
- Emacs-style prev/next keybindings.
- Replay searchFunc for the last term on slow network env.

### Fixed
- Several bugfixes.

## [0.1.3] - 2014-04-07
### Added
- Support RTL positioning.

### Fixed
- Several bugfixes.

## [0.1.2] - 2014-02-08
### Added
- Enable to append strategies on the fly.
- Enable to stop autocompleting.
- Enable to apply multiple textareas at once.
- Don't show popup on pressing arrow up and down keys.
- Hide dropdown by pressing ESC key.
- Prevent showing a dropdown when it just autocompleted.

## [0.1.1] - 2014-02-02
### Added
- Introduce `textComplete:show`, `textComplete:hide` and `textComplete:select` events.

## [0.1.0] - 2013-10-28
### Added
- Now strategies argument is an Array of strategy objects.

## [0.0.4] - 2013-10-28
### Added
- Up and Down arrows cycle instead of exit.
- Support Zepto.
- Support jQuery.overlay.

### Fixed
- Several bugfixes.

## [0.0.3] - 2013-09-11
### Added
- Some performance improvement.
- Implement lazy callbacking on search function.

## [0.0.2] - 2013-09-08
### Added
- Support IE8.
- Some performance improvement.
- Implement cache option.

## 0.0.1 - 2013-09-02
### Added
- Initial release.

[Unreleased]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.8.4...HEAD
[1.8.4]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.8.3...v1.8.4
[1.8.3]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.8.2...v1.8.3
[1.8.2]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.8.1...v1.8.2
[1.8.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.8.0...v1.8.1
[1.8.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.7.3...v1.8.0
[1.7.3]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.7.2...v1.7.3
[1.7.2]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.7.1...v1.7.2
[1.7.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.7.0...v1.7.1
[1.7.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.6.3...v1.7.0
[1.6.3]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.6.2...v1.6.3
[1.6.2]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.6.1...v1.6.2
[1.6.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.3.5...v1.4.0
[1.3.5]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.3.4...v1.3.5
[1.3.4]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.3.3...v1.3.4
[1.3.3]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.2.2...v1.3.0
[1.2.2]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.8.2...v1.0.0
[0.8.2]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.8.1...v0.8.2
[0.8.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.7.3...v0.8.0
[0.7.3]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.7.2...v0.7.3
[0.7.2]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.7.1...v0.7.2
[0.7.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.6.1...v0.7.0
[0.6.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.5.2...v0.6.0
[0.5.2]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.3.9...v0.4.0
[0.3.9]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.3.8...v0.3.9
[0.3.8]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.3.7...v0.3.8
[0.3.7]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.3.6...v0.3.7
[0.3.6]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.3.5...v0.3.6
[0.3.5]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.3.4...v0.3.5
[0.3.4]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.3.0-beta2...v0.3.0
[0.3.0-beta2]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.3.0-beta1...v0.3.0-beta2
[0.3.0-beta1]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.2.6...v0.3.0-beta1
[0.2.6]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.1.4.1...v0.2.0
[0.1.4.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.1.3...v0.1.4.1
[0.1.3]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.0.4...v0.1.0
[0.0.4]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/yuku-t/jquery-textcomplete/compare/v0.0.1...v0.0.2
