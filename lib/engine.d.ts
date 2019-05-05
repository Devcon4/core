import { Entity } from "./entity";
import { System } from "./system";
import { Blueprint } from "./blueprint";
import { Component } from "./component";
interface EngineEntityListener {
    onEntityAdded(entity: Entity): void;
    onEntityRemoved(entity: Entity): void;
}
declare class Engine<T extends {
    [k: string]: Component;
}> {
    private _entities;
    private readonly _entityListeners;
    private readonly _systems;
    private _systemsNeedSorting;
    private entityFactory;
    private blueprintTypes;
    private _components;
    private _blueprints;
    lits: keyof T;
    constructor(components: T, blueprints: Set<Blueprint>, blueprintTypes?: any);
    startup(): void;
    buildEntity(type: string | number): Entity;
    readonly entities: readonly Entity[];
    notifyPriorityChange(system: System<any, T>): void;
    addEntityListener(listener: EngineEntityListener): this;
    removeEntityListener(listener: EngineEntityListener): this;
    addEntity(entity: Entity): this;
    addEntities(...entities: Entity[]): this;
    removeEntity(entity: Entity): void;
    removeEntities(...entities: Entity[]): this;
    addSystem<U extends keyof T>(system: System<U, T>): this;
    addSystems<U extends keyof T>(...systems: System<U, T>[]): void;
    removeSystem<U extends keyof T>(system: System<U, T>): this;
    removeSystems<U extends keyof T>(...systems: System<U, T>[]): void;
    addBlueprint(blueprint: Blueprint): void;
    addBlueprints(...blueprints: Blueprint[]): void;
    removeBlueprint(blueprint: Blueprint): void;
    removeBlueprints(...blueprints: Blueprint[]): void;
    update(delta: number): void;
}
export { Engine, EngineEntityListener };
