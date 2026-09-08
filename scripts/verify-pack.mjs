import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const dir = resolve(root, process.env.PACK_DIR ?? '.release/pack')
rmSync(dir, { recursive: true, force: true })
mkdirSync(dir, { recursive: true })
const source = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const packed = JSON.parse(
  execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', dir], {
    cwd: root,
    encoding: 'utf8',
  }),
)
if (packed.length !== 1) throw new Error('npm pack did not produce exactly one archive')
const archive = resolve(dir, packed[0].filename)
const files = readdirSync(dir).filter((x) => x.endsWith('.tgz'))
if (!existsSync(archive) || files.length !== 1)
  throw new Error('pack directory must contain exactly the captured tarball')
const got = JSON.parse(
  execFileSync('tar', ['-xOzf', archive, 'package/package.json'], { encoding: 'utf8' }),
)
for (const f of [
  'name',
  'version',
  'main',
  'module',
  'types',
  'exports',
  'dependencies',
  'optionalDependencies',
])
  if (JSON.stringify(got[f]) !== JSON.stringify(source[f]))
    throw new Error(`manifest field ${f} changed in tarball`)
if (JSON.stringify(got).includes('workspace:'))
  throw new Error('workspace dependency leaked into tarball')
const entries = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean)
for (const f of [
  'package/package.json',
  'package/README.md',
  'package/LICENSE',
  'package/dist/index.js',
  'package/dist/index.d.ts',
])
  if (!entries.includes(f)) throw new Error(`tarball is missing ${f}`)
if (entries.some((f) => /(^|\/)(?:src|tests|scripts|node_modules|\.github)(?:\/|$)/.test(f)))
  throw new Error('disallowed files leaked into tarball')
if (process.env.GITHUB_ENV)
  writeFileSync(process.env.GITHUB_ENV, `AIHU_PACK_PATH=${archive}\n`, { flag: 'a' })
console.log(`verified ${archive}: ${got.name}@${got.version}`)
