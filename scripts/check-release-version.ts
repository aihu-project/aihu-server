import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

type PackageJson = { version?: unknown }

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))

const readVersion = (packageRoot: string): string => {
  const packageJson = JSON.parse(
    readFileSync(resolve(packageRoot, 'package.json'), 'utf8'),
  ) as PackageJson

  if (typeof packageJson.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(packageJson.version)) {
    throw new Error(
      `host package must use an exact stable semver version; found ${String(packageJson.version)}`,
    )
  }

  return packageJson.version
}

/** Verify that a release tag names exactly the host package version. */
export function checkReleaseVersion(tag: string, packageRoot = root): void {
  const version = readVersion(packageRoot)
  const expectedTag = `v${version}`
  if (tag !== expectedTag) {
    throw new Error(
      `release tag must equal host package version (${expectedTag}); found ${tag || '(empty)'}`,
    )
  }
}

if (process.argv[1]?.endsWith('check-release-version.ts')) {
  const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME ?? ''
  checkReleaseVersion(tag)
  console.log(`✓ release tag ${tag} matches @aihu/server@${tag.slice(1)}`)
}
