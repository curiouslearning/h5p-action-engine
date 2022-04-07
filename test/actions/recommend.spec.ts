import _ from 'lodash';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import BranchingAction, {IBranchData, IBranchObject} from '../../src/actions/branchingAction';
import { IActionObject, IPermissionsObject } from '../../src/models/models';
import * as twoBranchRaw from '../fixtures/branchData/2-branch.json';
import * as fiveBranchRaw from '../fixtures/branchData/5-branch.json';
import * as tenBranchRaw from '../fixtures/branchData/10-branch.json';

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

describe ('/actions/branchingAction.ts', () => {
    let
        permissions,
        params,
        twoBranch,
        fiveBranch,
        tenBranch;
    beforeEach(() => {
        twoBranch = _.cloneDeep(twoBranchRaw);
        fiveBranch = _.cloneDeep(fiveBranchRaw);
        tenBranch = _.cloneDeep(tenBranchRaw);
        permissions = _.cloneDeep(basePermissions);
        params = _.cloneDeep(baseParams);
        params.action = sandbox.stub().returns(true);
        params.orgList = permissions;

    });

    afterEach(() => {
        sandbox.restore();
    });

    it('picks branch 1 of 2', async () => {
        const {branchData, statements} = twoBranch;
        const expected = branchData.branchData[0].value;
        
        const callBack = sandbox.stub();
        const action = new BranchingAction(branchData, callBack, [statements[0]])
        await action.execute();
        sinon.assert.calledWith(callBack, expected);
    });

    it('picks branch 2 of 2', async () => {
        const {branchData, statements} = twoBranch;
        const expected = branchData.branchData[1].value;
        
        const callBack = sandbox.stub();
        const action = new BranchingAction(branchData, callBack, statements)
        await action.execute();
        sinon.assert.calledWith(callBack, expected);
   });

    it('picks branch 3 of 5', async () => {
        const {branchData, statements} = fiveBranch;
        const expected = branchData.branchData[2].value;

        const callBack = sandbox.stub();
        const action = new BranchingAction(branchData, callBack, statements);
        await action.execute();
        sinon.assert.calledWith(callBack, expected);
    });

    it('picks branch 4 of 10', async () => {
        const {branchData, statements} = tenBranch;
        const expected = branchData.branchData[3].value;

        const callBack = sandbox.stub();
        const action = new BranchingAction(branchData, callBack, statements);
        await action.execute();
        sinon.assert.calledWith(callBack, expected);
    });

    it('picks the base branch', async () => {
        const {branchData} = tenBranch;
        const expected = branchData.baseBranch.value;

        const callBack = sandbox.stub();
        const action = new BranchingAction(branchData, callBack, []);
        await action.execute();
        sinon.assert.calledWith(callBack, expected);
    });

    it('will not execute without permission', async () => {
        const {branchData, statements} = tenBranch;

        branchData.org = "invalidOrg";
        const callBack = sandbox.stub();
        const action = new BranchingAction(branchData, callBack, statements);
        await action.execute();
        sinon.assert.notCalled(callBack);
        chai.expect(action.evaluated).to.be.true;
    });

    it('throws an exception on improper action data', async () => {
        try {
            const callBack = () => {};
            const action = new BranchingAction({}, callBack, [], false);
            throw new Error("Expected constructor to throw error!")
        } catch(e) {
            chai.expect(e.message).to.equal("param 'data' must implement the IBranchObject interface")
        }
    });
})
