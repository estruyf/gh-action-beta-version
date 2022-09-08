# GitHub Action to update the version of a package.json file

This action updates the version of a package.json file with the number of the current build.

## Inputs

### `build-id`

**Required** The build id to use as the version number.

### `path`

**Required** The path to the package.json file. Default: `package.json`.

## Example usage

```yaml
uses: estruyf/gh-action-beta-version@v0.0.1
with:
  build-id: $GITHUB_RUN_ID
  path: package.json
```