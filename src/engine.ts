import { Entity } from "./entity";
import { System } from "./system";
import { EntityFactory } from "./entity-factory";
import { Blueprint } from "./blueprint";
import { Component } from "./component";

interface EngineEntityListener {
  onEntityAdded(entity: Entity): void;
  onEntityRemoved(entity: Entity): void;
}

//, U extends keyof T, V extends T[keyof T]
/**
 * An engine is the class than combines systems and entities.
 * You may have one Engine in your application, but you can make as many as
 * you want.
 */
class Engine<T extends {[k: string]: Component}, U> {
  /** Private array containing the current list of added entities. */
  private _entities: Entity[] = [];
  /** Private list of entity listeners */
  private readonly _entityListeners: EngineEntityListener[] = [];
  /** Private list of added systems. */
  private readonly _systems: System<any, T>[] = [];
  /** Checks if the system needs sorting of some sort */
  private _systemsNeedSorting: boolean = false;
  /** Factory for creating entities based off blueprints */
  private entityFactory: EntityFactory<T>;
  /** Enum of all blueprints for type checking purposes */
  private blueprintTypes?: U;

  public _components: T;
  private _blueprints: Set<Blueprint<T, U>> = new Set();
  lits: keyof T;

  /**
   * Constructs new engine.
   * @param blueprints Array of blueprints.
   * @param components Exported module containing all components.
   * @param blueprintTypes Optional enum of blueprint types for type checking. 
   */
  constructor(components: T, blueprintTypes?: U) {
    this._components = components;
    this.blueprintTypes = blueprintTypes ? blueprintTypes : undefined;
  }

  startup() {
    this.entityFactory = new EntityFactory(this._blueprints, this._components);
  }

  /**
   * Builds entity from blueprint.
   * @param type The enum type or name of blueprint to create entity from. 
   * @throws if the type doesn't match any added blueprintTypes.
   */
  buildEntity(type: string | number): Entity {
    if(this.blueprintTypes) {
      if(!this.blueprintTypes[type]) {
        throw new Error(`Invalid blueprint type: ${type}`); 
      } else {
        type = this.blueprintTypes[type];
      }
    }
    return this.entityFactory.buildEntity(<string>type);
  }
  /**
   * Computes an immutable list of entities added to the engine.
   */
  get entities() {
    return Object.freeze(this._entities.slice(0));
  }
  /**
   * Alerts the engine to sort systems by priority.
   * @param system The system than changed priority
   */
  notifyPriorityChange(system: System<any, T>) {
    this._systemsNeedSorting = true;
  }

  /**
   * Adds a listener for when entities are added or removed.
   * @param listener The listener waiting to add
   */
  addEntityListener(listener: EngineEntityListener) {
    if (this._entityListeners.indexOf(listener) === -1) {
      this._entityListeners.push(listener);
    }
    return this;
  }

  /**
   * Removes a listener from the entity listener list.
   * @param listener The listener to remove
   */
  removeEntityListener(listener: EngineEntityListener) {
    const index = this._entityListeners.indexOf(listener);
    if (index !== -1) {
      this._entityListeners.splice(index, 1);
    }
    return this;
  }

  /**
   * Add an entity to the engine.
   * The listeners will be notified.
   * @param entity The entity to add
   */
  addEntity(entity: Entity) {
    if (this._entities.indexOf(entity) === -1) {
      this._entities.push(entity);
      for (let listener of this._entityListeners) {
        listener.onEntityAdded(entity);
      }
    }
    return this;
  }

  /**
   * Add a list of entities to the engine.
   * The listeners will be notified once per entity.
   * @param entities The list of entities to add
   */
  addEntities(...entities: Entity[]) {
    for (let entity of entities) {
      this.addEntity(entity);
    }
    return this;
  }

  /**
   * Removes an entity to the engine.
   * The listeners will be notified.
   * @param entity The entity to remove
   */
  removeEntity(entity: Entity) {
    const index = this._entities.indexOf(entity);
    if (index !== -1) {
      this._entities.splice(index, 1);
      for (let listener of this._entityListeners) {
        listener.onEntityRemoved(entity);
      }
    }
  }

  /**
   * Removes a list of entities to the engine.
   * The listeners will be notified once per entity.
   * @param entities The list of entities to remove
   */
  removeEntities(...entities: Entity[]) {
    for (let entity of entities) {
      this.removeEntity(entity);
    }
    return this;
  }

  /**
   * Adds a system to the engine.
   * @param system The system to add.
   */
  addSystem<U extends keyof T>(system: System<U, T>) {
    const index = this._systems.indexOf(system);
    if (index === -1) {
      this._systems.push(system);
      system.onAttach(this);
      this._systemsNeedSorting = true;
    }
    return this;
  }

  /**
   * Adds a list of systems to the engine.
   * @param systems The list of systems to add.
   */
  addSystems<U extends keyof T>(...systems: System<U, T>[]) {
    for (let system of systems) {
      this.addSystem(system);
    }
  }

  /**
   * Removes a system to the engine.
   * @param system The system to remove.
   */
  removeSystem<U extends keyof T>(system: System<U, T>) {
    const index = this._systems.indexOf(system);
    if (index !== -1) {
      this._systems.splice(index, 1);
      system.onDetach(this);
    }
    return this;
  }

  /**
   * Removes a list of systems to the engine.
   * @param systems The list of systems to remove.
   */
  removeSystems<U extends keyof T>(...systems: System<U, T>[]) {
    for (let system of systems) {
      this.removeSystem(system);
    }
  }

  addBlueprint(blueprint: Blueprint<T, U>) {
    if (!this._blueprints.has(blueprint)) {
      this._blueprints.add(blueprint);
    }
  }

  addBlueprints(...blueprints: Blueprint<T, U>[]) {
    blueprints.forEach(this.addBlueprint);
  }

  removeBlueprint(blueprint: Blueprint<T, U>) {
    this._blueprints.delete(blueprint);
  }

  removeBlueprints(...blueprints: Blueprint<T, U>[]) {
    blueprints.forEach(this.removeBlueprint);
  }

  /**
   * Updates all systems added to the engine.
   * @param delta Time elapsed (in milliseconds) since the last update.
   */
  update(delta: number) {
    if (this._systemsNeedSorting) {
      this._systemsNeedSorting = false;
      this._systems.sort((a, b) => a.priority - b.priority);
    }
    for (let system of this._systems) {
      system.update(this, delta);
    }
  }
}

export { Engine, EngineEntityListener };
