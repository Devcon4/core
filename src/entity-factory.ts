import { BlueprintClass, BlueprintComponent, Blueprint } from "./blueprint";
import { Entity } from "./entity";
import { Component, ComponentClass } from "./component";

export class EntityFactory<T extends {[k: string]: Component}, U> {
    private blueprints: {[k in keyof U]: Blueprint<T, U>};
    private components: T;

    constructor(components: T, blueprints: {[k in keyof U]: Blueprint<T, U>}) {
        this.components = components;
        this.blueprints = blueprints;
    }

    public buidEntity(blueprintName: keyof U) {
        let masterBlueprint = this.blueprints[blueprintName];
        let entity = new Entity();

        let recur = (blueprint: Blueprint<T, U>) => {
            if(blueprint.blueprints) {
                for(let b of blueprint.blueprints) {
                    if(this.blueprints[b].blueprints) {
                        recur(this.blueprints[b]);
                    }

                    let arr = Object.entries(blueprint.components);
                    for(let [key, state] of arr) {
                        entity.putComponent(arr[key]);
                    }
                }
            }
        }

        recur(masterBlueprint);
        return entity;
    }

    // TODO - Consider a caching strategy if we've already built an entity;
    
    // constructor(blueprintTemplates: Set<Blueprint<T, U>>, componentModule) {
    //     if(this.validateBlueprints(blueprintTemplates)) {
    //         this.components = componentModule;
    //         this.blueprints = this.buildBlueprintsFromTemplates(blueprintTemplates);
    //     }
    // }

    // /**
    //  * Creates a component of the specified class and adds it to the entity.
    //  * @param name The name of blueprint to build the entity from.
    //  * @returns The newly created entity built from given blueprint.
    //  */
    // public buildEntity(name: string): Entity {
    //     return this.getEntityFromBlueprint(this.getBlueprintFromName(name), new Entity());
    // }

    // private getEntityFromBlueprint(blueprint: BlueprintClass, entity: Entity): Entity {

    //     // Recursively add components from inherited blueprints
    //     blueprint.blueprintNames.forEach(x => {
    //         entity = this.getEntityFromBlueprint(this.getBlueprintFromName(x), entity);
    //     });

    //     blueprint.blueprintComponents.forEach(x => {
    //         entity.putComponent(<any>x.component);

    //         // Overwrite values of component based off of blueprint;
    //         if (x.values) {
    //             let component = entity.getComponent(<any>x.component);
    //             Object.getOwnPropertyNames(x.values).forEach(value => component[value] = x.values[value]);
    //         }
    //     });

    //     return entity;
    // }

    // private getBlueprintFromName(name: string): BlueprintClass {
    //     let blueprint = Array.from(this.blueprints).find(x => x.name === name);
    //     if (!blueprint) {
    //         throw new Error("Cannot find blueprint by that name.");
    //     }
    //     return blueprint;
    // }

    // private buildBlueprintsFromTemplates(blueprintTemplates: Set<Blueprint<T, U>>): Set<BlueprintClass> {
    //     return new Set(Array.from(blueprintTemplates, x => new Blueprint<T, U>({
    //         name: x.name,
    //         components: this.getComponentsFromTemplates(x.components),
    //         blueprints: this.hasBlueprints(x) ? x.blueprints : []
    //     })));
    // }

    // private hasBlueprints(blueprintTemplate: Blueprint<T>) {
    //     return blueprintTemplate.blueprints && blueprintTemplate.blueprints.length > 0;
    // }

    // /**
    //  * Converts template components to blueprint components.
    //  * @throws if the list is empty.
    //  * @param components template array for the blueprints components.
    // */
    // private getComponentsFromTemplates(components): BlueprintComponent[] {
    //     if (!components || components.length === 0) {
    //         throw new Error("Blueprint must implement one or more components.");
    //     } else {
    //         return components.map(x => new BlueprintComponent({
    //             component: this.components[x.name], 
    //             values: x.values
    //         }));
    //     }
    // }

    // private validateBlueprints(blueprints: Set<Blueprint<T>>): boolean {
    //     if(Array.from(blueprints).some(b => !b.name || b.name.length < 1)) {
    //         throw new Error('All blueprints must have a name.');
    //     }
    //     if(Array.from(blueprints).some(b => !b.components || b.components.length === 0)) {
    //         throw new Error('All blueprints must implement one or more components.');
    //     }
    //     // TODO - All blueprint name references must exist.
    //     // TODO - All component name references must exist.
    //     // TODO - All component values must exist.
    //     // TODO - Log problem blueprint for each of these issues to aid in debugging. 
    //     return true;
    // }
}