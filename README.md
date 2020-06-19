# Textcomplete

> Autocomplete for HTMLTextAreaElement and more.

![](./docs/images/demo.gif)

## Packages

Textcomplete consists of subpackages:

Name                          | Description
------------------------------|-------------------------------------------
@textcomplete/core            | Core of Textcomplete.
@textcomplete/textarea        | Editor for HTMLTextAreaEleemnt.
@textcomplete/contenteditable | Editor for contenteditable. (Experimental)
@textcomplete/codemirror      | Editor for CodeMirror. (Experimental)
@textcomplete/utils           | Utility functions for editors.

## Development

### View Document

```bash
yarn install
yarn lerna bootstrap
yarn docs
```

then open http://localhost:1234.

### Release

```bash
yarn release
```

then create a release for the shown tag.

## License

&copy; Yuku Takahashi - This software is licensed under the MIT license.
