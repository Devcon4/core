abstract class Component {
  readonly name: string;
  abstract state: unknown;
}

interface ComponentClass<T extends Component> {
  readonly name: string;
  readonly tag?: string;
  new (): T;
}

export { Component, ComponentClass };
