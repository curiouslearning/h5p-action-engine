import _ from 'lodash';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import * as reqsRaw from '../fixtures/reqObjects/singleReqObject.json';
import * as multiReqsRaw from '../fixtures/reqObjects/multiReqObject.json';
import * as apiResponseRaw from '../fixtures/statements/apiResponse.json';
import * as multiStatementsRaw from '../fixtures/statements/multiReqObjectStatements.json'
import Action from '../../src/actions/action';
import { IActionObject, IPermissionsObject } from '../../src/models/models';

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
    action: () => {return true;}
};

describe('/actions/action.ts', () => {
    let reqs, multiReqs, apiResponse, multiStatements, permissions, params;
    beforeEach(() => {
        reqs = _.cloneDeep(reqsRaw);
        multiReqs = _.cloneDeep(multiReqsRaw);
        apiResponse = _.cloneDeep(apiResponseRaw);
        multiStatements = _.cloneDeep(multiStatementsRaw);
        permissions = _.cloneDeep(basePermissions);
        params = _.cloneDeep(baseParams);
        params.action = sandbox.stub().returns(true);
        params.orgList = permissions;

    });

    afterEach(() => {
        sandbox.restore();
    });

    it('executes when it has permission and no prereqs', async () => {
        const action = new Action(params);
        const test = await action.execute();
        chai.expect(test).to.be.true;
    });

    it('executes when data and preReqs match', async () => {
        params.prereqs.reqs = multiReqs.values;
        const action = new Action(params, multiStatements.values, false);
        const test = await action.execute();
        chai.expect(test).to.be.true;
    });

    it('will not execute without permission', async () => {
        params.org = 'invalidOrg';
        const action = new Action(params);
        const test = await action.execute();
        chai.expect(test).to.be.false;
    }); 

    it('will not execute if prereqs are not met', async () => {
        reqs.values[0].result.score.scaled.operator = "LTE"
        params.prereqs.reqs = reqs.values;
        const action = new Action(params, [apiResponse.statements[0]], false);
        const test = await action.execute();
        chai.expect(test).to.be.false;
    });

    it('will not execute on both failed conditions', async () => {
        params.preReqs = multiReqs.values;
        params.org = "invalidOrg";
        const action = new Action(params, [], false);
        const test = await action.execute();
        chai.expect(test).to.be.false;
    });

    it('will throw an error on improperly formatted data', async () => {
        const badParams = {
            org: NaN,
            ...params
        };
        try {
           const action = new Action(badParams); 
           throw new Error("constructor did not throw!");
        } catch (e) {
           chai.expect(e.message).to.equal("param 'data' must implement the IActionObject interface") 
        }
    });
})