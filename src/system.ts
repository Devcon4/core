import { Engine } from "./Engine";
import { Component } from "./component";

abstract class System<T extends keyof U, U extends {[k: string]: Component}> {
  private _priority: number;
  private readonly _engines: Engine<U>[];
  public requiredComponent: T;

  constructor() {
    this._priority = 0;
    this._engines = [];
  }

  get priority() {
    return this._priority;
  }

  get engines() {
    return Object.freeze(this._engines.slice(0));
  }

  set priority(value: number) {
    this._priority = value;
    for (let engine of this._engines) {
      engine.notifyPriorityChange(this);
    }
  }

  onAttach(engine: Engine<U>) {
    const index = this._engines.indexOf(engine);
    if (index === -1) {
      this._engines.push(engine);
    }
  }

  onDetach(engine: Engine<U>) {
    const index = this._engines.indexOf(engine);
    if (index !== -1) {
      this._engines.splice(index, 1);
    }
  }

  abstract update(engine: Engine<U>, delta: number): void;
}

export { System };
