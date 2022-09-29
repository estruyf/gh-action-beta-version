# GitHub Action to update the version of a package.json file

This action updates the version of a package.json file with the number of the current build.

## Inputs

**Required inputs**

- `build-id`: The build id to use as the version number.
- `path`: The path to the package.json file. Default: `package.json`.

**Optional inputs**

- `append-or-replace`: Append the `build-id` value to the version or replace the `patch` number with the build id. Options: `append` or `replace`. Default: `replace`.
- `name`: The name of the package.
- `display-name`: The display name of the package.
- `description`: The description of the package.
- `homepage`: The homepage of the package.
- `icon`: The icon of the package (used for Visual Studio Code extensions).
- `preview`: Specify if the package is a preview version (used for Visual Studio Code extensions).

## Example usage

```yaml
uses: estruyf/gh-action-beta-version@v0.0.12
with:
  build-id: ${{ github.run_id }}
  path: package.json
  append-or-replace: 'append'
```