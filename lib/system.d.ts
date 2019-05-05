import { Engine } from "./Engine";
import { Component } from "./component";
declare abstract class System<T extends keyof U, U extends {
    [k: string]: Component;
}> {
    private _priority;
    private readonly _engines;
    requiredComponent: T;
    constructor();
    priority: number;
    readonly engines: readonly Engine<U>[];
    onAttach(engine: Engine<U>): void;
    onDetach(engine: Engine<U>): void;
    abstract update(engine: Engine<U>, delta: number): void;
}
export { System };
