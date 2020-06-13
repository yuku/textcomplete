# Release

Update "version" of package.json and change unreleased section of [CHANGELOG.md](https://github.com/yuku-t/textcomplete/blob/master/CHANGELOG.md) to the new version. Then,

```bash
git tag v$(jq -r .version package.json)
npm run build
npm publish
```
