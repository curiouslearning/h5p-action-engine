import _ from 'lodash';
import chai from 'chai';
import Evaluator from '../../src/helpers/evaluator';
import * as reqsRaw from '../fixtures/reqObjects/singleReqObject.json';
import * as multiReqsRaw from '../fixtures/reqObjects/multiReqObject.json';
import * as apiResponseRaw from '../fixtures/statements/apiResponse.json';
import * as multiStatementsRaw from '../fixtures/statements/multiReqObjectStatements.json';
import { IReqOperators } from '../../src/models/models';
const agent = {
    account: {
        name: "testAgent",
        homePage: "curiouslearning"
    }
}
describe("/helpers/evaluator.ts", () => {
    let reqs, multiReqs, apiResponse, multiStatements;

    beforeEach(() => {
        //get a clean copy of each piece of data to avoid state passing between tests
        reqs = _.cloneDeep(reqsRaw);
        multiReqs = _.cloneDeep(multiReqsRaw);
        apiResponse = _.cloneDeep(apiResponseRaw);
        multiStatements = _.cloneDeep(multiStatementsRaw);
    });

    afterEach(() => {
    });

    it('returns true on single req, single statement evaluation', async () => {
        const preReqs = {
            name: "testAction",
            reqs: [...reqs.values]
        }
        const data = [apiResponse.statements[0]]
        const module = new Evaluator(agent, preReqs, false, data);
        const test = await module.eval();
        chai.expect(test, "expected response to be true").to.be.true;
    });

    it('returns false on incorrect agent', async () => {
        const preReqs = {
            name: "testAction",
            reqs: [...reqs.values]
        }
        const data = [apiResponse.statements[1]]
        const module = new Evaluator(agent, preReqs, false, data)
        const test = await module.eval();
        chai.expect(test, "expected response to be false").to.be.false;
    });

    it('returns false on failed GTE evaluation', async () => {
        const preReqs = {
            name: "testAction",
            reqs: [...reqs.values]
        }
        const data = [apiResponse.statements[2]]
        const module = new Evaluator(agent, preReqs, false, data)
        const test = await module.eval();
        chai.expect(test, "expected response to be false").to.be.false;

    });

    it('returns false with a PreReq and no statements', async () => {
        const preReqs = {
            name: "testAction",
            reqs: [...reqs.values]
        }
        const module = new Evaluator(agent, preReqs, false, [])
        const test = await module.eval();
        chai.expect(test, "expected response to be false").to.be.false;

    });

    it('returns true with no PreReqs', async () => {
        const preReqs = { 
            name: "testAction",
            reqs: []
        }
        const data = multiStatements.values;
        const module = new Evaluator (agent, preReqs, false, data);
        const test = await module.eval();
        chai.expect(test, "expected response to be true").to.be.true;
    })

    it('returns true with multiple PreReqs and matching statements', async () => {
        const preReqs = {
            name: "testAction",
            reqs: [...multiReqs.values]
        };
        const data = [...multiStatements.values];
        const module = new Evaluator(agent, preReqs, false, data);
        const test = await module.eval();
        chai.expect(test, "expected response to be true").to.be.true;
    });

    it('returns false with multiple PreReqs and 1 failed GTE comparison', async () => {
        const preReqs = {
            name: "testAction",
            reqs: [...multiReqs.values]
        };
        const data = [...multiStatements.values];
        data[1].result.score = {
            scaled: 30,
            raw: 3,
            max: 100
        }
        const module = new Evaluator(agent, preReqs, false, data);
        const test = await module.eval();
        chai.expect(test, "expected response to be false").to.be.false;

    })

    it('returns false with multiple PreReqs and 1 failed RANGE comparison', async () => {
        const preReqs = {
            name: "testAction",
            reqs: [...multiReqs.values]
        };
        const data = [...multiStatements.values];
        data[2].result.score = {
            scaled: 30,
            raw: 3,
            max: 100
        }
        const module = new Evaluator(agent, preReqs, false, data);
        const test = await module.eval();
        chai.expect(test, "expected response to be false").to.be.false;

    })

    it('returns false with multiple PreReqs and a failed GT comparison', async () => {
         const preReqs = {
            name: "testAction",
            reqs: [...multiReqs.values]
        };
        const data = [...multiStatements.values];
        preReqs.reqs[0].result.score = {
            scaled: {
                value: 80,
                operator: "GT"
            }
        };
        const module = new Evaluator(agent, preReqs, false, data);
        const test = await module.eval();
        chai.expect(test, "expected response to be true").to.be.false;
       
    })

    it('returns false with multiple PreReqs and a failed LT comparison', async () => {
         const preReqs = {
            name: "testAction",
            reqs: multiReqs.values
        };
        const data = multiStatements.values;
        preReqs.reqs[0].result.score = {
            scaled: {
                value: 30,
                operator: "LT"
            }
        };
        const module = new Evaluator(agent, preReqs, false, data);
        const test = await module.eval();
        chai.expect(test, "expected response to be false").to.be.false;
       
    })

    it('returns false with multiple PreReqs and a failed LTE comparison', async () => {
         const preReqs = {
            name: "testAction",
            reqs: multiReqs.values
        };
        const data = multiStatements.values;
        preReqs.reqs[0].result.score = {
            scaled: {
                value: 20,
                operator: "LTE"
            }
        };
        const module = new Evaluator(agent, preReqs, false, data);
        const test = await module.eval();
        chai.expect(test, "expected response to be false").to.be.false;
       
    })

    it('returns false with multiple PreReqs and a failed NOT comparison', async () => {
         const preReqs = {
            name: "testAction",
            reqs: multiReqs.values
        };
        const data = multiStatements.values;
        preReqs.reqs[1].result.score = {
            completion: {
                value: true,
                operator: "NOT"
            }
        };
        const module = new Evaluator(agent, preReqs, false, data);
        const test = await module.eval();
        chai.expect(test, "expected response to be false").to.be.false;
       
    })

    it('returns false with a missing value in a statement', async () => {
         const preReqs = {
            name: "testAction",
            reqs: reqs.values
        };
        const data = [apiResponse.statements[0]];
        delete data[0].result.completion;
        const module = new Evaluator(agent, preReqs, false, data);
        const test = await module.eval();
        chai.expect(test, "expected response to be false").to.be.false;

    });
    it('returns false with a missing value in a statement', async () => {
        const preReqs = {
            name: "testAction",
            reqs: multiReqs.values
        };
        const data = multiStatements.values;
        delete data[1].result.completion;
        const module = new Evaluator(agent, preReqs, false, data);
        const test = await module.eval();
        chai.expect(test, "expected response to be false").to.be.false;

    });


});