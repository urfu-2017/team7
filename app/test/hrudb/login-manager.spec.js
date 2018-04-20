import { expect, proxyquire, sandbox } from '../helpers';
import * as repeater from '../../db/hrudb/hrudb-repeater';


let sut;

suite('Hrudb.LoginManager.loginUser');

beforeEach(async () => {
    sandbox.stub(repeater);
    sut = proxyquire('../db/hrudb/login-manager', {
        './hrudb-repeater': repeater
    }).default;
});

afterEach(async () => {
    sandbox.restore();
});

test('will do single request to hrudb', async () => {
    repeater.getAll.returnsAsync([{ kekId: ['name1', 0] }]);
    await sut(0, 'name1');

    expect(repeater.getAll).to.have.been.calledOnce;
    expect(repeater.put).to.have.not.been.called;
});
