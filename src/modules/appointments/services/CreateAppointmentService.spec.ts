import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvier from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvier';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvier: FakeCacheProvier;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvier = new FakeCacheProvier();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvier
    );
  });

  it('should be able to create a new appointment',async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: '121212',
      provider_id: '123456',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date();

    await createAppointment.execute({
      date: appointmentDate,
      user_id: '121212',
      provider_id: '123456',
    });

    await expect(createAppointment.execute({
      date: appointmentDate,
      user_id: '123456',
      provider_id: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      user_id: '123456',
      provider_id: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 10).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      user_id: '123456',
      provider_id: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment outside a work schedule', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 6).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 7),
      user_id: 'user_id',
      provider_id: 'provider_id',
    })).rejects.toBeInstanceOf(AppError);

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 18),
      user_id: 'user_id',
      provider_id: 'provider_id',
    })).rejects.toBeInstanceOf(AppError);

  });


})
