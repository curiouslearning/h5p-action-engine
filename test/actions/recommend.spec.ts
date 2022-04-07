import _ from 'lodash';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import Recommend, {IRecData, IRecObject} from '../../src/actions/recommend';
import { IActionObject, IPermissionsObject } from '../../src/models/models';
import * as twoCaseRaw from '../fixtures/recData/2-case.json';
import * as fiveCaseRaw from '../fixtures/recData/5-case.json';
import * as tenCaseRaw from '../fixtures/recData/10-case.json';

const sandbox = sinon.createSandbox();

const basePermissions: IPermissionsObject = {
    name: 'testAction',
    permissions: ['testOrg1', 'testOrg2']
};

const baseParams: IActionObject = {
    name: "testAction",
    agent: {
        account: {
            name: "testAgent",
            homePage: "curiouslearning"
        }
    },
    org: "testOrg1",
    orgList: {
        name: 'testAction',
        permissions: []
    },
    prereqs: {
        name: "testAction",
        reqs: []
    },
};

describe ('/actions/recommend.ts', () => {
    let
        permissions,
        params,
        twoCase,
        fiveCase,
        tenCase;
    beforeEach(() => {
        twoCase = _.cloneDeep(twoCaseRaw);
        fiveCase = _.cloneDeep(fiveCaseRaw);
        tenCase = _.cloneDeep(tenCaseRaw);
        permissions = _.cloneDeep(basePermissions);
        params = _.cloneDeep(baseParams);
        params.action = sandbox.stub().returns(true);
        params.orgList = permissions;

    });

    afterEach(() => {
        sandbox.restore();
    });

    it('recommends option 1 of 2', async () => {
        const {recData, statements} = twoCase;
        const expected = recData.recData[0].value;
        
        const callBack = sandbox.stub();
        const action = new Recommend(recData, callBack, [statements[0]])
        await action.execute();
        sinon.assert.calledWith(callBack, expected);
    });

    it('recommends option 2 of 2', async () => {
        const {recData, statements} = twoCase;
        const expected = recData.recData[1].value;
        
        const callBack = sandbox.stub();
        const action = new Recommend(recData, callBack, statements)
        await action.execute();
        sinon.assert.calledWith(callBack, expected);
   });

    it('recommends option 3 of 5', async () => {
        const {recData, statements} = fiveCase;
        const expected = recData.recData[2].value;

        const callBack = sandbox.stub();
        const action = new Recommend(recData, callBack, statements);
        await action.execute();
        sinon.assert.calledWith(callBack, expected);
    });

    it('recommends option 4 of 10', async () => {
        const {recData, statements} = tenCase;
        const expected = recData.recData[3].value;

        const callBack = sandbox.stub();
        const action = new Recommend(recData, callBack, statements);
        await action.execute();
        sinon.assert.calledWith(callBack, expected);
    });

    it('recommends the base case', async () => {
        const {recData} = tenCase;
        const expected = recData.baseCase.value;

        const callBack = sandbox.stub();
        const action = new Recommend(recData, callBack, []);
        await action.execute();
        sinon.assert.calledWith(callBack, expected);
    });

    it('will not execute without permission', async () => {
        const {recData, statements} = tenCase;

        recData.org = "invalidOrg";
        const callBack = sandbox.stub();
        const action = new Recommend(recData, callBack, statements);
        await action.execute();
        sinon.assert.notCalled(callBack);
        chai.expect(action.evaluated).to.be.true;
    });

    it('throws an exception on improper action data', async () => {
        try {
            const callBack = () => {};
            const action = new Recommend({}, callBack, [], false);
            throw new Error("Expected constructor to throw error!")
        } catch(e) {
            chai.expect(e.message).to.equal("param 'data' must implement the IRecObject interface")
        }
    });
})
