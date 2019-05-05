import { Component, ComponentClass } from "./component";
import { Engine } from "./engine";
import { Entity } from "./entity";
interface Family {
    readonly entities: ReadonlyArray<Entity>;
    includesEntity(entity: Entity): boolean;
}
declare class FamilyBuilder<T extends {
    [k: string]: Component;
}> {
    private _engine;
    private _cached;
    private readonly _include;
    private readonly _exclude;
    constructor(engine?: Engine<T>);
    include(...classes: ComponentClass<Component>[]): this;
    exclude(...classes: ComponentClass<Component>[]): this;
    changeEngine(engine: Engine<T>): this;
    setCached(cached: boolean): void;
    build(): Family;
}
export { Family, FamilyBuilder };
