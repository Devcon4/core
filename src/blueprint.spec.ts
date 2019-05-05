import { expect } from "chai";
import "mocha";

import { Entity } from "./Entity";
import { Blueprint } from "./blueprint";
import { Component } from "./Component";

class comp1 implements Component {
    name: string;
    value: string;
}
class comp2 implements Component {
    name: string;
    value: {stuff: number, stuff2: { inner: string }};
}

let comps = {
    'COMP1': new comp1(),
    'COMP2': new comp2()
}

describe("Blueprints work", function() {
  it("Is set to true", function() {
      let blueprint: Blueprint<typeof comps> = {
          name: 'test',
          components: {COMP2: {
              stuff: 3,
              stuff2: {
                  inner: ''
              }
          }}
      }; 
  });
});
