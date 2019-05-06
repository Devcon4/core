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

export class Blueprint<T extends {[k: string]: Component}, U> {
    name: keyof U;
    components: Partial<{ [k in keyof T]: T[k][keyof Pick<T[k], 'state'>]}>;
    blueprints?: Array<keyof U>;

    constructor(args: Partial<Blueprint<T, U>>) {
        Object.assign(this, args);
    }
}

/*
export interface Blueprint<T extends {[k: string]: Component}, U> {
    name: string;
    components: Partial<{ [k in keyof T]: T[k][keyof Pick<T[k], 'state'>]}>,
    blueprints?: Array<keyof U>;
}

*/

export function BlueprintArray<T extends {[k: string]: Component}, U extends {[k: string]: Blueprint<T, U>}>(blueprints: U) {
    return blueprints;
}
