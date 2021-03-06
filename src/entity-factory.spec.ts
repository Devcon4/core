import { expect } from "chai";
import "mocha";

import { EntityFactory } from "./entity-factory";
import { Component } from "./Component";
import { Blueprint } from "./blueprint";

describe("Entity factory works", function () {
    it("Can make entity", function () {
        class TestComponent1 implements Component {
            state: number;
            name: string;
        }

        enum types {
            blueprint1 = 'blueprint1',
            blueprint2 = 'blueprint2'
        }

        let comps = { 'COMP1': new TestComponent1() };

        let testBlueprints: {[k in types]: Blueprint<typeof comps, typeof types>} = {
            blueprint1: {
                name: "blueprint1",
                components: {COMP1: 2}
            },
            blueprint2: {
                name: 'blueprint2',
                components: {COMP1: 4}
            }
        };

        const factory = new EntityFactory<typeof comps, typeof types>(comps, testBlueprints);
        let entity = factory.buidEntity('blueprint2');
        expect(entity.hasComponent(TestComponent1)).to.be.true;
    });

    it("Built entity inherits components from other blueprints", function () {
        class TestComponent1 implements Component {
            state: number;
            name: string;
        }
        class TestComponent2 implements Component {
            state: number;
            name: string;
        }
        class TestComponent3 implements Component {
            state: number;
            name: string;
        }
        class TestComponent4 implements Component {
            state: number;
            name: string;
        }

        enum types {
            base = 'base',
            inherits = 'inherits',
            inheritsTwice = 'inheritsTwice'
        }

        let comps = { 'COMP1': new TestComponent1(), 'COMP2': new TestComponent2(), 'COMP3': new TestComponent3(), 'COMP4': new TestComponent4() };

        let testBlueprints: {[k in types]: Blueprint<typeof comps, typeof types>} = {
            base: {
                name: 'base',
                components: {COMP1: 1}
            },
            inherits: {
                name: 'inherits',
                components: {COMP2: 2, COMP3: 3},
                blueprints: ['base']
            },
            inheritsTwice: {
                name: 'inheritsTwice',
                components: {COMP4: 4},
                blueprints: ['inheritsTwice']
            }
        };

        const factory = new EntityFactory<typeof comps, typeof types>(comps, testBlueprints);
        let entity = factory.buidEntity('inheritsTwice');
        expect(entity.hasComponent(TestComponent1)).to.be.true;
        expect(entity.hasComponent(TestComponent2)).to.be.true;
        expect(entity.hasComponent(TestComponent3)).to.be.true;
        expect(entity.hasComponent(TestComponent4)).to.be.true;
    });

    it("Child blueprint overrides inherited component values", function () {
        class TestComponent1 implements Component {
            name: string; state = 'default'; state2 = 'untouched' }
        class TestComponent2 implements Component {
            name: string; state = 'default'; }
        class TestComponent3 implements Component {
            name: string; state = 'default'; }
        let testComponents = { TestComponent1, TestComponent2, TestComponent3 };

        let testBlueprints = new Set([
            {
                "name": "Base",
                "blueprints": [],
                "components": [
                    { "name": "TestComponent1", "values": {value: 'baseChanged'} },
                    { "name": "TestComponent2", "values": {value: 'baseChanged'} },
                    { "name": "TestComponent3", "values": {} }
                ]
            },
            {
                "name": "Inherits",
                "blueprints": ["Base"],
                "components": [
                    { "name": "TestComponent2", "values": {value: 'inheritsChanged'} }
                ]
            }
        ]);
        const factory = new EntityFactory(testBlueprints, testComponents);
        let entity = factory.buildEntity(<any>"Inherits");
        expect(entity.getComponent(TestComponent1).value).to.equal('baseChanged');
        expect(entity.getComponent(TestComponent1).value2).to.equal('untouched');
        expect(entity.getComponent(TestComponent2).value).to.equal('inheritsChanged');
        expect(entity.getComponent(TestComponent3).value).to.equal('default');
    });

    it("Blueprint must implement at least one component", function () {
        const factory = new EntityFactory(new Set(), {});
        expect(() => factory['getComponentsFromTemplates']([])).to.throw();
    });
    
    it("Blueprint type must exist", function () {
        //TODO enter actual array of types
        const factory = new EntityFactory(new Set(), {});
        expect(() => factory['getBlueprintFromName'](<any>'NotFound')).to.throw();
    });

    it("Blueprint templates must all have a name", function () {
        let testBlueprints = new Set([
            {
                "name": "Base",
                "blueprints": [],
                "components": [
                    { "name": "TestComponent1", "values": {value: 'baseChanged'} },
                    { "name": "TestComponent2", "values": {value: 'baseChanged'} },
                    { "name": "TestComponent3", "values": {} }
                ]
            },
            {
                "name": <string><unknown>undefined,
                "blueprints": ["Base"],
                "components": [
                    { "name": "TestComponent2", "values": {value: 'inheritsChanged'} }
                ]
            }
        ]);
        expect(() => new EntityFactory(testBlueprints, {})).to.throw('All blueprints must have a name.');
    });

    it("Blueprint templates must all implement one or more components", function () {
        let testBlueprints = new Set([
            {
                "name": "Same",
                "components": [
                    { "name": "TestComponent1" }
                ]
            },
            {
                "name": "different",
                "components": []
            }
        ]);
        expect(() => new EntityFactory(testBlueprints, {})).to.throw('All blueprints must implement one or more components.');
    });
});
