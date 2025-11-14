let setLoaderFn = null;

export const loader = {
  start() {
    if (setLoaderFn) setLoaderFn(true);
  },
  stop() {
    if (setLoaderFn) setLoaderFn(false);
  },
  register(fn) {
    setLoaderFn = fn;
  }
};
