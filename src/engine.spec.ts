import { expect } from "chai";
import * as sinon from 'sinon';
import "mocha";

import { Engine } from "./engine";
import { EntityFactory } from "./entity-factory";
import { Component } from "./Component";

describe("Engine works", function () {
    class comp1 implements Component {
        value: any;
        name: string; stuff1 = 1;
        constructor() {}
     }
    class comp2 implements Component {
        value: any;
        name: string; stuff2 = 1; }
    class fakeComp1 { stuff3 = 1; }

    let comps = {
        'COMP1': new comp1(),
        'COMP2': new comp2(),
    };

    it("BuildEntity gets called", function () {
        var mockBuildEntity = sinon.fake();
        var mockEntityFactory = {buildEntity: mockBuildEntity};
        let engine = new Engine({}, new Set());
        engine['entityFactory'] = <EntityFactory<typeof comps>>mockEntityFactory;
        engine.buildEntity('test');
        sinon.assert.called(mockBuildEntity);
        sinon.assert.calledWith(mockBuildEntity, 'test')
    });
    it("BuildEntity gets name based off enum", function () {
        enum types { blueprint1, blueprint2 };
        var mockBuildEntity = sinon.fake();
        var mockEntityFactory = {buildEntity: mockBuildEntity};
        let engine = new Engine({}, new Set(), types);
        engine['entityFactory'] = <EntityFactory<typeof comps>>mockEntityFactory;
        engine.buildEntity(types.blueprint2);
        sinon.assert.calledWith(mockBuildEntity, 'blueprint2');
    });
    it("BuildEntity throws if type not found", function () {
        enum types { blueprint1, blueprint2 };
        var mockBuildEntity = sinon.fake();
        var mockEntityFactory = {buildEntity: mockBuildEntity};

        

        let engine = new Engine(comps, new Set(), types);
        engine['entityFactory'] = <EntityFactory<typeof comps>>mockEntityFactory;
        expect(() => engine.buildEntity(`test`)).to.throw('Invalid blueprint type: test');
        sinon.assert.notCalled(mockBuildEntity);
    });

    it('Add blueprint', () => {
        let comps = {
            'COMP1': new comp1(),
            'COMP2': new comp2(),
        };

        let engine = new Engine(comps, new Set());
    });
});