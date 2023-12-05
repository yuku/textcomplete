# Textcomplete

Autocomplete for HTMLTextAreaElement and more.

![Publish](https://github.com/yuku/textcomplete/workflows/Publish/badge.svg)
![Test](https://github.com/yuku/textcomplete/workflows/Test/badge.svg)
![GitHub pages](https://github.com/yuku/textcomplete/workflows/GitHub%20pages/badge.svg)

![](./docs/images/demo.gif)

See more at [yuku.takahashi.coffee/textcomplete](https://yuku.takahashi.coffee/textcomplete/)

## Packages

Textcomplete consists of subpackages:

| Name                          | Description                                |
|-------------------------------|--------------------------------------------|
| @textcomplete/core            | Core of Textcomplete.                      |
| @textcomplete/textarea        | Editor for HTMLTextAreaElement.            |
| @textcomplete/contenteditable | Editor for contenteditable. (Experimental) |
| @textcomplete/codemirror      | Editor for CodeMirror. (Experimental)      |
| @textcomplete/utils           | Utility functions for editors.             |

## Development

### View documentation

```bash
yarn install
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
