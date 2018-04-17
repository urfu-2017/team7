import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon_ from 'sinon';
import proxyquire_ from 'proxyquire';

chai.use(sinonChai);
sinon_.addBehavior('returnsAsync', (fake, value) => fake.returns(Promise.resolve(value)));

export function skipSuite() {
    this.skip();
}
export const { expect } = chai;
export const sinon = sinon_;
export const proxyquire = proxyquire_;
export const sandbox = sinon.sandbox.create();
