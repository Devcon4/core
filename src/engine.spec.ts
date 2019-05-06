import { expect } from "chai";
import * as sinon from 'sinon';
import "mocha";

import { Engine } from "./engine";
import { EntityFactory } from "./entity-factory";
import { Component } from "./Component";

describe("Engine works", function () {
    class comp1 implements Component {
        state: number;
        name: string; stuff1 = 1;
        constructor() {}
     }
    class comp2 implements Component {
        state: string;
        name: string; stuff2 = 1; }
    class fakeComp1 { stuff3 = 1; }

    let comps = {
        'COMP1': new comp1(),
        'COMP2': new comp2(),
    };

    it("BuildEntity gets called", function () {
        enum types { blueprint1, blueprint2 };
        var mockBuildEntity = sinon.fake();
        var mockEntityFactory = {buildEntity: mockBuildEntity};
        let engine = new Engine({}, types);
        engine.addBlueprint({
            name: 'blueprint1',
            components: {}
        });
        engine['entityFactory'] = <EntityFactory<typeof comps>>mockEntityFactory;
        engine.buildEntity(types.blueprint1);
        sinon.assert.called(mockBuildEntity);
        sinon.assert.calledWith(mockBuildEntity, types.blueprint1)
    });
    it("BuildEntity gets name based off enum", function () {
        enum types { blueprint1, blueprint2 };
        var mockBuildEntity = sinon.fake();
        var mockEntityFactory = {buildEntity: mockBuildEntity};
        let engine = new Engine({}, types);
        engine['entityFactory'] = <EntityFactory<typeof comps>>mockEntityFactory;
        engine.buildEntity(types.blueprint2);
        sinon.assert.calledWith(mockBuildEntity, 'blueprint2');
    });
    it("BuildEntity throws if type not found", function () {
        enum types { blueprint1, blueprint2 };
        var mockBuildEntity = sinon.fake();
        var mockEntityFactory = {buildEntity: mockBuildEntity};

        

        let engine = new Engine(comps, types);
        engine['entityFactory'] = <EntityFactory<typeof comps>>mockEntityFactory;
        expect(() => engine.buildEntity(`test`)).to.throw('Invalid blueprint type: test');
        sinon.assert.notCalled(mockBuildEntity);
    });

    it('Add blueprint', () => {
        enum types { blueprint1, blueprint2 };
        let comps = {
            'COMP1': new comp1(),
            'COMP2': new comp2(),
        };

        let engine = new Engine(comps, types);
        engine.addBlueprint({
            name: 'blueprint1',
            blueprints: ['blueprint1'],
            components: {COMP1: 1}
        });
    });
});