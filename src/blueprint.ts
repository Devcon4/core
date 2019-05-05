import { Component } from "./component";

export class BlueprintClass {
    name: string;
    blueprintComponents: BlueprintComponent[] = [];
    blueprintNames: string[] = [];

    constructor(blueprint?: Partial<BlueprintClass>) {
        Object.assign(this, blueprint);
    }
}

export class BlueprintComponent {
    component: Component;
    values: any;

    constructor(blueprintComponent?: Partial<BlueprintComponent>) {
        Object.assign(this, blueprintComponent);
    }
}

export interface Blueprint<T extends {[k: string]: Component}> {
    name: string;
    components: Partial<{ [k in keyof T]: T[k][keyof Pick<T[k], 'value'>]}>,
    blueprints?: string[]
}