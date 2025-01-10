export function createStore<StoreShape>(initialState: StoreShape) {
  let currentState = initialState;

  const listeners = new Set<(state: StoreShape) => void>();

  return {
    setState,
    getState,
    emitChanges: forceEmit,
    subscribe,
  };

  function subscribe(listener: (state: StoreShape) => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function setState(fn: (state: StoreShape) => StoreShape, publish = true) {
    currentState = fn(currentState);
    if (publish) {
      listeners.forEach((listener) => listener(currentState));
    }
  }

  function getState() {
    return currentState;
  }

  function forceEmit() {
    listeners.forEach((listeners) => listeners(currentState));
  }
}

export type CustomStore<T> = ReturnType<typeof createStore<T>>;

export class GlobalStore<StoreShape> {
  private state: StoreShape;
  private subscriptions = new Set<(state: StoreShape) => void>();

  constructor(initialState: StoreShape) {
    this.state = initialState;
    this.subscribe = this.subscribe.bind(this);
  }

  get() {
    return this.state;
  }

  set(f: (state: StoreShape) => StoreShape) {
    this.state = f(this.state);
    this.subscriptions.forEach((listener) => listener(this.state));
  }

  select<SelectedValue>(selector: (state: StoreShape) => SelectedValue) {
    return selector(this.state);
  }

  subscribe(listener: (state: StoreShape) => void) {
    this.subscriptions.add(listener);
    return () => this.subscriptions.delete(listener);
  }
}

const a = new GlobalStore({ a: 1 }).select((state) => state);

export interface ValueStoreOptions<StoreName extends string> {
  name: StoreName;
}

export interface ValueStore<StoreName extends string, StoreShape> {
  name: StoreName;
  get(): StoreShape;
  set(fn: (shape: Partial<StoreShape>, publish?: boolean) => StoreShape): void;
  subscribe(listener: (state: StoreShape) => void): void;
}
export function createValueStore<StoreName extends string, StoreShape>(
  initialState: StoreShape,
  options: ValueStoreOptions<StoreName>,
): ValueStore<StoreName, StoreShape> {
  const store = createStore(initialState);
  return {
    name: options.name,
    get: store.getState,
    set: store.setState,
    subscribe: store.subscribe,
  };
}
