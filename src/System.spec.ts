import { expect } from "chai";
import "mocha";

import { System } from "./System";
import { Engine } from "./Engine";
import { Family, FamilyBuilder } from "./Family";
import { Component } from "./Component";

class TestClass1 implements Component {
  name: string;
}
class TestClass2 implements Component {
  name: string;
}

let comps = {
  'COMP1': new TestClass1(),
  'COMP2': new TestClass2()
}

type test = Pick<typeof comps, 'COMP1'>;

class MySystem<T extends typeof comps> extends System<keyof test, T> {
  public family: Family | null = null;

  onAttach(engine: Engine<T>) {
    super.onAttach(engine);
    this.family = new FamilyBuilder(engine).build();
  }

  onDetach(engine: Engine<T>) {
    super.onDetach(engine);
    this.family = null;
  }

  update(engine: Engine<T>, delta: number) {}
}

describe("Systems works", function() {
  it("Can be extended", function() {
    expect(new MySystem()).to.be.instanceof(System);
    expect(new MySystem()).to.be.instanceof(MySystem);
  });
  it("Attached systems should call the onAttach method", () => {
    const engine = new Engine(comps, new Set());
    const system = new MySystem();
    engine.addSystem(system);
    expect(system.family).to.not.be.equals(null);
  });
  it("Detached systems should call the onDetach method", () => {
    const engine = new Engine(comps, new Set());
    const system = new MySystem();
    engine.addSystem(system);
    engine.removeSystem(system);
    expect(system.family).to.be.equals(null);
  });
});
