import { Component } from "./component";
export declare class BlueprintClass {
    name: string;
    blueprintComponents: BlueprintComponent[];
    blueprintNames: string[];
    constructor(blueprint?: Partial<BlueprintClass>);
}
export declare class BlueprintComponent {
    component: Component;
    values: any;
    constructor(blueprintComponent?: Partial<BlueprintComponent>);
}
export interface Blueprint {
    name: string;
    components: {
        name: string;
        values?: any;
    }[];
    blueprints?: string[];
}
