import { Blueprint } from "./blueprint";
import { Entity } from "./entity";
export declare class EntityFactory {
    private blueprints;
    private components;
    constructor(blueprintTemplates: Set<Blueprint>, componentModule: any);
    buildEntity(name: string): Entity;
    private getEntityFromBlueprint;
    private getBlueprintFromName;
    private buildBlueprintsFromTemplates;
    private hasBlueprints;
    private getComponentsFromTemplates;
    private validateBlueprints;
}
