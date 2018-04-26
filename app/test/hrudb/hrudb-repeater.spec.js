import { expect, proxyquire, sandbox } from '../helpers';
import * as hrudb from '../../db/hrudb/hrudb-client';
import { REPEATER_TIMES } from '../../utils/constants';

let sut;

suite('Hrudb.Repeater');

beforeEach(async () => {
    sandbox.stub(hrudb);
    sut = proxyquire('../db/hrudb/hrudb-repeater', {
        './hrudb-client': hrudb
    });
});

afterEach(async () => {
    sandbox.restore();
});

test('returns 404 http code immediately', async () => {
    hrudb.get.withArgs('key').onFirstCall().returnsAsync({ statusCode: 404 });
    const { statusCode } = await sut.get('key').catch(x => x);

    expect(hrudb.get).to.have.been.calledWith('key');
    expect(hrudb.get).to.have.been.calledOnce;
    expect(statusCode).to.be.equal(404);
});

test(`will have ${REPEATER_TIMES} attempts before fail`, async () => {
    hrudb.get.withArgs('key').returnsAsync({ statusCode: 418 });
    const { gotError } = await sut.get('key').catch(() => ({ gotError: true }));

    expect(hrudb.get).to.have.been.calledWith('key');
    expect(hrudb.get).to.have.callCount(REPEATER_TIMES);
    expect(gotError).to.be.true;
});

