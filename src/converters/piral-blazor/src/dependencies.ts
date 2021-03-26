import { addReference } from './interop';
import type { createConverter } from './converter';

export function createDependencyLoader(convert: ReturnType<typeof createConverter>, lazy = true) {
  let dependency: () => Promise<any>;

  return {
    getDependency() {
      return dependency;
    },
    defineBlazorReferences(references) {
      const load = async () => {
        for (const reference of references) {
          await addReference(reference);
        }
      };
      let result = !lazy && convert.loader.then(load);
      dependency = () => result || (result = load());
    },
  };
}
