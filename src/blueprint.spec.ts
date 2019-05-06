import { expect } from "chai";
import "mocha";

import { Entity } from "./Entity";
import { Blueprint, BlueprintArray } from "./blueprint";
import { Component } from "./Component";

class comp1 implements Component {
    name: string;
    state: string;
}
class comp2 implements Component {
    name: string;
    state: {stuff: number, stuff2: { inner: string }};
}

let comps = {
    'COMP1': new comp1(),
    'COMP2': new comp2()
}

describe("Blueprints work", function() {
  it("Is set to true", function() {

    enum types {
        Test,
        Test2
    }

      let arr: {[k in types]: Blueprint<typeof comps, typeof types>} = {
        [types.Test]: {
            name: 'Test',
            blueprints: ['Test', 'Test2'],
            components: {COMP1: ''}
        },
        [types.Test2]: {
            name: 'Test2',
            blueprints: ['Test2'],
            components: {}
        }
      };
  });
});
