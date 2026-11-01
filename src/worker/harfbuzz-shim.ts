/**
 * Cloudflare Workers forbids compiling WebAssembly from bytes at runtime, which is what
 * `harfbuzzjs` (used by Satori) does by default. This shim replaces the `harfbuzzjs`
 * module (see `alias` in wrangler.jsonc) and instantiates the *pre-compiled* `hb.wasm`
 * module that wrangler bundles for us.
 *
 * Satori does `await harfbuzzjs`, so we export a lazy thenable: nothing runs at global scope.
 */
// NOTE: relative paths on purpose. esbuild's `alias` rewrites *sub-paths* of an aliased
// package too, so `harfbuzzjs/hb.wasm` would resolve back into this file.
import hbWasm from "../../node_modules/harfbuzzjs/hb.wasm";
import createHarfBuzz from "../../node_modules/harfbuzzjs/hb.js";
import hbjs from "../../node_modules/harfbuzzjs/hbjs.js";

let instance: Promise<unknown> | null = null;

function load(): Promise<unknown> {
  if (!instance) {
    // Emscripten's loader probes `__filename` / `self.location.href`; neither exists on Workers.
    // The wasm is provided through `instantiateWasm` below, so any placeholder value is fine.
    const g = globalThis as Record<string, unknown>;
    g.__filename ??= "/hb.js";
    g.__dirname ??= "/";
    instance = createHarfBuzz({
      instantiateWasm(
        imports: WebAssembly.Imports,
        receiveInstance: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void
      ) {
        WebAssembly.instantiate(hbWasm, imports).then((inst) => receiveInstance(inst, hbWasm));
        return {};
      },
    }).then((hb) =>
      hbjs(
        // `addFunction` builds tiny wasm modules from bytes at runtime, which Workers forbids.
        // It is only needed for blob destructors / draw & font callbacks (unused by Satori),
        // so a null function pointer is enough: wasm memory is reclaimed with the isolate.
        new Proxy(hb as object, {
          get(target, key, receiver) {
            if (key === "addFunction") return () => 0;
            if (key === "removeFunction") return () => undefined;
            return Reflect.get(target, key, receiver);
          },
        })
      )
    );
    instance.catch(() => {
      instance = null; // allow retry on next request
    });
  }
  return instance;
}

const lazyHarfBuzz = {
  then(resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) {
    return load().then(resolve, reject);
  },
};

export default lazyHarfBuzz;
