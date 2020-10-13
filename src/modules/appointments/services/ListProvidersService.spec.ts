import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';
import FakeCacheProvier from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvier';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvier: FakeCacheProvier;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvier = new FakeCacheProvier();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvier,
    );
  });

  it('should be able to list the providers',async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456'
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'john.tre@example.com',
      password: '123456'
    });

    const loggerUser = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'john.qua@example.com',
      password: '123456'
    });

    const providers = await listProviders.execute({
      user_id: loggerUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
})
