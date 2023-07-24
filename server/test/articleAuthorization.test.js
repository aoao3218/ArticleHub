import { articleAuthorization } from '../dist/middleware/authorization.js';
import projects from '../dist/models/project.js';
import sinon from 'sinon';
import { expect } from 'chai';

const ownerId = '64ae1669c72249f4aac0bdf1';
const memberId = '64ae1669c72249f4aac0bdf1';
const projectId = '64b4e5678f2ad07adf4e573b';
const mockProject = {
  _id: projectId,
  createBy: ownerId,
  branch: [
    {
      createBy: memberId,
      name: 'branch1',
    },
  ],
};

describe('articleAuthorization', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('owner', async () => {
    const req = {
      params: { branch: 'main', projectId: projectId },
    };
    const res = {
      locals: { userId: ownerId },
    };
    const nextMock = sinon.spy();
    sinon.stub(projects, 'findById').resolves(mockProject);
    await articleAuthorization(req, res, nextMock);

    expect(res.locals.edit).to.be.true;
    expect(nextMock.called).to.be.true;
  });

  it('member', async () => {
    const req = {
      params: { branch: 'branch1', projectId: projectId },
    };
    const res = {
      locals: { userId: memberId },
    };
    const nextMock = sinon.spy();
    sinon.stub(projects, 'findById').resolves(mockProject);
    await articleAuthorization(req, res, nextMock);

    expect(res.locals.edit).to.be.true;
    expect(nextMock.called).to.be.true;
  });

  it('visitor', async () => {
    const req = {
      params: { branch: 'branch1', projectId: projectId },
    };
    const res = {
      locals: { userId: '64ae1669c72249f4sac0ddf1' },
    };
    const nextMock = sinon.spy();
    sinon.stub(projects, 'findById').resolves(mockProject);
    await articleAuthorization(req, res, nextMock);

    expect(res.locals.edit).to.be.false;
    expect(nextMock.called).to.be.true;
  });
});

// const req = {
//     params: { branch: 'main', projectId: 'project_id' },
//   };
//   const res = {
//     locals: { userId: 'user_id' },
//   };
//   const project = { _id: 'project_id', createBy: 'user_id' };
//   const findByIdMock = jest.spyOn(projects, 'findById').mockResolvedValue(project);
//   const nextMock = jest.fn();

//   await articleAuthorization(req, res, nextMock);

//   expect(res.locals.edit).toBe(true);
//   expect(findByIdMock).toHaveBeenCalledWith('project_id');
//   expect(nextMock).toHaveBeenCalled();

//   findByIdMock.mockRestore();
