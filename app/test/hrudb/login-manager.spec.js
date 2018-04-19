import { expect, proxyquire, sandbox } from '../helpers';
import * as userRepo from '../../db/hrudb/users-repository';


let sut;

suite('Hrudb.LoginManager.loginUser');

beforeEach(async () => {
    sandbox.stub(userRepo);
    sut = proxyquire('../db/hrudb/login-manager', {
        './users-repository': userRepo
    }).default;
});

afterEach(async () => {
    sandbox.restore();
});

test('will do single request to hrudb', async () => {
    userRepo.getAllUsers.returnsAsync({ 0: 'name1' });
    await sut(0, 'name1');

    expect(userRepo.getAllUsers).to.have.been.calledOnce;
    expect(userRepo.upsertUser).to.have.not.been.called;
    expect(userRepo.getUser).to.have.not.been.called;
    expect(userRepo.upsertAllUsers).to.have.not.been.called;
});
