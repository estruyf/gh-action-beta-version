import * as core from '@actions/core';
import fs from 'fs';
import util from 'util';

async function run(): Promise<void> {
  try {
    const buildId = core.getInput('build-id');
    const filePath = core.getInput('path');

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

    const version = pkgJson.version.split('.');
    pkgJson.version = `${version[0]}.${version[1]}.${buildId.substring(0, 7)}`;
    pkgJson.preview = true;

    const writeFile = util.promisify(fs.writeFile);
    await writeFile(filePath, JSON.stringify(pkgJson, null, 2), "utf-8");

    const summary = core.summary.addHeading(`Version info`);
    summary.addDetails(`Version`, pkgJson.version);

    core.setOutput('version', pkgJson.version);
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

run();