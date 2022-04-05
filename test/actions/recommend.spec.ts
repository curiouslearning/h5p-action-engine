import _ from 'lodash';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import * as reqsRaw from '../fixtures/reqObjects/singleReqObject.json';
import * as multiReqsRaw from '../fixtures/reqObjects/multiReqObject.json';
import * as apiResponseRaw from '../fixtures/statements/apiResponse.json';
import * as multiStatementsRaw from '../fixtures/statements/multiReqObjectStatements.json'
import Recommend from '../../src/actions/action';
import { IActionObject, IPermissionsObject } from '../../src/models/models';
import { hasUncaughtExceptionCaptureCallback } from 'process';

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

describe ('/actions/recommend.ts', () => {
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

    it('recommends option 1 of 2', async () => {
        throw new Error("Test Is Not Implemented");
    });

    it('recommends option 2 of 2', async () => {
        throw new Error("Test Is Not Implemented");
    });

    it('recommends option 3 of 5', async () => {
        throw new Error("Test Is Not Implemented");
    });

    it('recommends option 4 of 10', async () => {
        throw new Error("Test Is Not Implemented");
    });

    it('recommends the base case', async () => {
        throw new Error("Test Is Not Implemented");
    });

    it('will not execute without permission', async () => {
        throw new Error("Test Is Not Implemented");
    });

    it('throws an exception on improper action data', async () => {
        throw new Error("Test Is Not Implemented");
    });
})
