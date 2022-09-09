import * as core from '@actions/core';
import fs from 'fs';
import util from 'util';

async function run(): Promise<void> {
  try {
    // Required inputs
    const buildId = core.getInput('build-id', { required: true });
    const filePath = core.getInput('path', { required: true });

    // Optional inputs
    const appendOrReplace = core.getInput('append-or-replace');
    const preview = core.getInput('preview');
    const name = core.getInput('name');
    const displayName = core.getInput('display-name');
    const description = core.getInput('description');
    const icon = core.getInput('icon');
    const homepage = core.getInput('homepage');

    if (!buildId) {
      throw new Error('build-id is required');
    }

    const readFile = util.promisify(fs.readFile);
    const contents = await readFile(filePath, "utf-8");
    
    if (!contents) {
      throw new Error(`No contents found in ${filePath}`);
    }

    const pkgJson = JSON.parse(contents);

    if (!pkgJson.version) {
      throw new Error(`No version found in ${filePath}`);
    }

    const changes: string[] = [];

    const version = pkgJson.version.split('.');
    core.info(`Version before update: ${version.join('.')}`);
    core.info(`Build ID: ${buildId}`);

    if (appendOrReplace === 'append') {
      pkgJson.version = `${pkgJson.version}${buildId}`;
    } else {
      pkgJson.version = `${version[0]}.${version[1]}.${buildId}`;
    }

    changes.push(`Version: ${pkgJson.version}`);
    
    // Add the optional inputs
    if (preview !== undefined) {
      pkgJson.preview = preview;
      changes.push(`Preview: ${preview}`);
    }

    if (name !== undefined) {
      pkgJson.name = name;
      changes.push(`Name: ${name}`);
    }

    if (displayName !== undefined) {
      pkgJson.displayName = displayName;
      changes.push(`Display name: ${displayName}`);
    }

    if (description !== undefined) {
      pkgJson.description = description;
      changes.push(`Description: ${description}`);
    }

    if (icon !== undefined) {
      pkgJson.icon = icon;
      changes.push(`Icon: ${icon}`);
    }

    if (homepage !== undefined) {
      pkgJson.homepage = homepage;
      changes.push(`Homepage: ${homepage}`);
    }

    // Write the updated package.json
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(filePath, JSON.stringify(pkgJson, null, 2), "utf-8");

    await core.summary
      .addHeading(`Version info`)
      .addRaw(`Here is a list of the changes made to the package.json file:`)
      .addBreak()
      .addBreak()
      .addList(changes)
      .write();

    core.setOutput('version', pkgJson.version);
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

run();