import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

type PackageJson = {
  name?: unknown
  version?: unknown
  optionalDependencies?: Record<string, unknown>
}

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))

const readJson = (path: string): PackageJson =>
  JSON.parse(readFileSync(path, 'utf8')) as PackageJson

/**
 * Verify the standalone host/native release invariant.
 *
 * The host package and its four napi-rs platform packages share one explicit
 * version stream. A host release whose optional pins drift from the platform
 * manifests installs successfully but cannot load its renderer, so this check
 * is intentionally exact and runs before every publish.
 */
export function checkPlatformPins(packageRoot = root): void {
  const host = readJson(resolve(packageRoot, 'package.json'))
  const hostName = typeof host.name === 'string' ? host.name : 'host package'
  const optional = host.optionalDependencies ?? {}
  const expectedNames = [
    '@aihu/server-darwin-arm64',
    '@aihu/server-darwin-x64',
    '@aihu/server-linux-x64-gnu',
    '@aihu/server-win32-x64-msvc',
  ]
  const nativeNames = Object.keys(optional)
    .filter((name) => name.startsWith('@aihu/server-'))
    .sort()

  if (JSON.stringify(nativeNames) !== JSON.stringify(expectedNames)) {
    throw new Error(
      `${hostName} must pin exactly ${expectedNames.join(', ')}; found ${nativeNames.join(', ') || '(none)'}`,
    )
  }

  const versions = new Map<string, string>()
  for (const name of expectedNames) {
    const pin = optional[name]
    if (typeof pin !== 'string' || !/^\d+\.\d+\.\d+$/.test(pin)) {
      throw new Error(`${name} must use an exact stable version pin; found ${String(pin)}`)
    }

    const directory = name.slice('@aihu/server-'.length)
    const manifest = readJson(resolve(packageRoot, 'npm', directory, 'package.json'))
    if (manifest.name !== name || manifest.version !== pin) {
      throw new Error(
        `${name} manifest must be ${name}@${pin}; found ${String(manifest.name)}@${String(manifest.version)}`,
      )
    }
    versions.set(name, pin)
  }

  const uniqueVersions = [...new Set(versions.values())]
  if (uniqueVersions.length !== 1) {
    throw new Error(
      `native platform packages must share one version; found ${[...versions.entries()]
        .map(([name, version]) => `${name}@${version}`)
        .join(', ')}`,
    )
  }
}

if (process.argv[1]?.endsWith('check-platform-pins.ts')) {
  checkPlatformPins()
  console.log('✓ server native package pins are exact and synchronized')
}
