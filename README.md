# @aihu/server

Server runtime and native renderer for Aihu SSR.

This repository owns the server-side boundary: request routing, data loaders,
governed reads, streaming, SSR output, and the optional napi-rs renderer. It
stays provider-neutral: deployment adapters supply platform bindings and the
router remains a separate package.

## Install

```bash
npm install @aihu/server
# or
bun add @aihu/server
```

<sub><i>Auto-generated against `@aihu/server@0.6.1`.</i></sub>

## Package facts

| | |
|---|---|
| **Version** | `0.6.1` |
| **Tier** | B — Meta-framework — SSR + native renderer (napi-rs) |
| **Published files** | `dist`, `README.md`, `LICENSE` |
| **License** | MIT |

## Exports

| Subpath | ESM | CJS |
|---|---|---|
| `.` | `./dist/index.js` | `—` |
| `./native` | `./dist/native.js` | `—` |
| `./head-lowering` | `./dist/head-lowering.js` | `—` |


## Dependencies

**Dependencies:**

- `@aihu/agent` — `^0.2.0`
- `@aihu/agent-service` — `^0.4.0`
- `@aihu/plugin` — `^0.1.0`
- `@aihu/signals` — `^0.5.1`

**Build-time dependencies:**

- `@aihu/runtime` — `^6.1.0` (bundled SSR string helpers)

**Optional dependencies (platform-specific):**

- `@aihu/server-darwin-arm64` — `0.1.2`
- `@aihu/server-darwin-x64` — `0.1.2`
- `@aihu/server-linux-x64-gnu` — `0.1.2`
- `@aihu/server-win32-x64-msvc` — `0.1.2`


## See also

- [SSR & hydration guide](https://aihu.dev/guides/ssr-hydration)
- [@aihu/router](https://github.com/aihu-project/aihu/tree/main/packages/router)
- [@aihu-plugin/agent-readiness](https://github.com/aihu-project/aihu/tree/main/packages/plugin-agent-readiness)

## License

MIT — see [LICENSE](./LICENSE).
