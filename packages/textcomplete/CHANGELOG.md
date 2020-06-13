# Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

This change log adheres to [keepachangelog.com](http://keepachangelog.com).

## [Unreleased]

## [0.18.2] 2020-06-10
### Fixed
- Check element exists before sending it an event

## [0.18.1] 2019-12-19
### Fixed
- Fix error while SSR

## [0.18.0] 2019-08-06
### Added
- Add parent property to `DropDownOptions` to enable specifying the element to append the drop down items to
- Add 'auto' placement feature
- When dropdown has scrollbar applied, scroll position will follow active item

## [0.17.1] - 2018-03-31
### Fixed
- Fix placement of dropdown menu in textarea with no line-height set.

## [0.17.0] - 2018-03-23
### Added
- Add hide method to textcomplete to deactivate dropdown manually

### Fixed
- Fix dropdown going off screen

## [0.16.1] - 2018-02-28
### Fixed
- Remove circluar dependency.

## [0.16.0] - 2017-12-19
### Changed
- Export `Textarea` and `Textcomplete` from main entry file. Now it no longer exports
  `Textcomplete` as default.

## [0.15.0] - 2017-12-14
### Added
- Add option for className of DropdownItem.

## [0.14.5] - 2017-12-05
### Fixed
- Avoid `Array#find` to support IE11.

## [0.14.4] - 2017-11-15
### Fixed
- Update undate to fix infinite loop.

## [0.14.3] - 2017-11-10
### Fixed
- Fix to make SearchResult.replace work with numeric matches. (thanks for [@mikemorton])

## [0.14.2] - 2017-09-25
### Fixed
- Deactivate dropdown if null change event is fired.
- Deactivate dropdown on enter instead of hide.

## [0.14.1] - 2017-09-24
### Fixed
- Hide dropdown on enter

## [0.14.0] - 2017-09-24
### Changed
- Change `Editor#getBeforeCuror` return type from `string` to `?string` for better selection handling.
  Now `Textarea` emits a change event if selection type is cursor.

### Fixed
- Remove `Editor#getAfterCursor` since it is not necessary.

## [0.13.1] - 2017-07-03
### Fixed
- Fix bug around revoking autocompletion. (Extract the feature as [yuku-t/undate](https://github.com/yuku-t/undate))

## [0.13.0] - 2017-06-27
### Added
- Enable to revoke autocompletion by ctrl-z.

## [0.12.1] - 2017-06-12
### Fixed
- Remove unused parameter.

## [0.12.0] - 2017-06-12
### Added
- Npm package contains .flow files.

## [0.11.0] - 2017-06-12
### Changed
- Accept a fuction that returns match data as `match` option.

## [0.10.0] - 2017-06-10
Textcomplete loses a lot of weight. Now it is smaller than jquery-textcomplete! Great job, [@glebm]!

### Added
- Dispatch an 'input' event on the textarea element. (thanks for [@glebm])

### Fixed
- Fix "undefined" appearing in the list. (thanks for [@glebm])

## [0.9.1] - 2017-06-10
### Fixed
- Fix incorrect line height computation. (thanks for [@glebm])

## [0.9.0] - 2017-06-08
### Changed
- `Dropdown~Offset` must have "lineHeight" property.
- Drop IE9 support. (thanks for [@glebm])
- Refactor a lot to be much smaller. (thanks for [@glebm])
- Rename finalize to destroy. (thanks for [@glebm])

## [0.8.0] - 2016-04-25
### Added
- Let textarea editor deactivate a dropdown on esc key.

## [0.7.1] - 2016-03-30
### Changed
- Use input event instead of keyup event.

### Fixed
- Fix a bug that a typeerror occurs on every normal keydown events.

## [0.7.0] - 2016-03-28
### Added
- Activate hovered dropdown item.
- Add `rotate` dropdown option.

### Changed
- Deactivate an active item by `DropdownItem#activate`.

### Fixed
- Don't trigger textcomplete by pressing shift, ctrl, alt and command keys.

## [0.6.0] - 2016-03-27
### Added
- Add `id` strategy parameter.

### Fixed
- Use [line-height](https://github.com/twolfson/line-height) package to fix a minor dropdown position problem.

## [0.5.1] - 2016-03-20
### Fixed
- Update `gh-pages` automatically when actually `master` branch is changed.
- Make demo page possible to run on Firefox.

## [0.5.0] - 2016-03-14
### Changed
- Divide Editor#move event into Editor#move and Editor#enter events.
- Prefer underscore over hyphen as file name.

## [0.4.0] - 2016-03-14
### Added
- Enable to preload third party editor classes via `Textcomplete.editors`.
- Enable to select dropdown by tab key.

### Changed
- Use methods instead of getter properties to define `Editor` class.
- Emit a custom event on Editor#change and Editor#move event.

### Fixed
- Fix dropdown position when window is scrolled.

## [0.3.0] - 2016-03-10
### Added
- Add "Getting Started", "Development" and "Events" documents.
- Add a contributing guide.
- Add `Dropdown#el` and `Dropdown#getActiveItem()` to its public interface.
- Add `render`, `select` and `selected` events to `Textcomplete`.
- Add `preventDefault` functionality to infinitive events.
- Enable to finalize `Textcomplete`.

### Changed
- Don't hide dropdown on blur event by default.
- Don't activate the first dropdown item by default.
- Emit `rendered` event whenever dropdown is rendered.

### Removed
- Remove `Dropdown#length`.
- Remove `Dropdown#selectActiveItem()`.

## [0.2.0] - 2016-02-29
### Added
- Enable to select dropdown in touch devices.
- Enable to use markdown in jsdoc.
- Add `cache`, `context` strategy parameters.
- Add `className`, `style`, `maxCount`, `header` and `footer` dropdown options.
- Add `show`, `shown`, `rendered`, `hide` and `hidden` events to `Textcomplete`.
- Support "rtl" textarea.

### Changed
- Exclude src/doc from Inch CI.

## [0.1.2] - 2016-02-22
### Added
- Add [jsdoc](https://github.com/jsdoc3/jsdoc) to `gh-pages`.

### Changed
- Use separated lodash npm packages instead of whole lodash code.

## [0.1.1] - 2016-02-22
### Added
- This CHANGELOG file.
- Update `gh-pages` automatically when `master` branch is changed.
- Create a corresponding GitHub release whenever a new npm package is published.

### Fixed
- Enable to require as a npm package.
- Don't lint js files in `dist/`, `lib/` and `powered-test/`.

## 0.1.0 - 2016-02-20 [YANKED]
### Added
- Initial release.

[Unreleased]: https://github.com/yuku-t/textcomplete/compare/v0.18.2...HEAD
[0.18.2]: https://github.com/yuku-t/textcomplete/compare/v0.18.1...v0.18.2
[0.18.1]: https://github.com/yuku-t/textcomplete/compare/v0.18.0...v0.18.1
[0.18.0]: https://github.com/yuku-t/textcomplete/compare/v0.17.1...v0.18.0
[0.17.1]: https://github.com/yuku-t/textcomplete/compare/v0.17.0...v0.17.1
[0.17.0]: https://github.com/yuku-t/textcomplete/compare/v0.16.1...v0.17.0
[0.16.1]: https://github.com/yuku-t/textcomplete/compare/v0.16.0...v0.16.1
[0.16.0]: https://github.com/yuku-t/textcomplete/compare/v0.15.0...v0.16.0
[0.15.0]: https://github.com/yuku-t/textcomplete/compare/v0.14.5...v0.15.0
[0.14.5]: https://github.com/yuku-t/textcomplete/compare/v0.14.4...v0.14.5
[0.14.4]: https://github.com/yuku-t/textcomplete/compare/v0.14.3...v0.14.4
[0.14.3]: https://github.com/yuku-t/textcomplete/compare/v0.14.2...v0.14.3
[0.14.2]: https://github.com/yuku-t/textcomplete/compare/v0.14.1...v0.14.2
[0.14.1]: https://github.com/yuku-t/textcomplete/compare/v0.14.0...v0.14.1
[0.14.0]: https://github.com/yuku-t/textcomplete/compare/v0.13.1...v0.14.0
[0.13.1]: https://github.com/yuku-t/textcomplete/compare/v0.13.0...v0.13.1
[0.13.0]: https://github.com/yuku-t/textcomplete/compare/v0.12.1...v0.13.0
[0.12.1]: https://github.com/yuku-t/textcomplete/compare/v0.12.0...v0.12.1
[0.12.0]: https://github.com/yuku-t/textcomplete/compare/v0.11.0...v0.12.0
[0.11.0]: https://github.com/yuku-t/textcomplete/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/yuku-t/textcomplete/compare/v0.9.1...v0.10.0
[0.9.1]: https://github.com/yuku-t/textcomplete/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/yuku-t/textcomplete/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/yuku-t/textcomplete/compare/v0.7.1...v0.8.0
[0.7.1]: https://github.com/yuku-t/textcomplete/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/yuku-t/textcomplete/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/yuku-t/textcomplete/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/yuku-t/textcomplete/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/yuku-t/textcomplete/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/yuku-t/textcomplete/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/yuku-t/textcomplete/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/yuku-t/textcomplete/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/yuku-t/textcomplete/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/yuku-t/textcomplete/compare/83a55de...v0.1.1
[@glebm]: https://github.com/glebm
