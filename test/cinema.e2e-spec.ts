import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';

describe('Cinema (e2e)', () => {
  let app: INestApplication;
  let http: ReturnType<INestApplication['getHttpServer']>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    http = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('runs the whole booking flow', async () => {
    const film = (
      await request(http)
        .post('/films')
        .send({ title: 'Dune', durationMinutes: 155, releaseYear: 2021 })
        .expect(201)
    ).body;
    const hall = (
      await request(http)
        .post('/halls')
        .send({ name: 'Hall 1', rows: 3, seatsPerRow: 5 })
        .expect(201)
    ).body;
    await request(http)
      .post('/halls')
      .send({ name: 'Hall 1', rows: 1, seatsPerRow: 1 })
      .expect(409);

    const halls = await request(http).get(`/halls/${hall.id}`).expect(200);
    expect(halls.body.seats).toHaveLength(15);

    const showing = (
      await request(http)
        .post('/showings')
        .send({
          filmId: film.id,
          hallId: hall.id,
          startsAt: '2030-06-15T18:00:00.000Z',
          price: 12500,
        })
        .expect(201)
    ).body;

    await request(http).delete(`/films/${film.id}`).expect(409);
    await request(http).delete(`/halls/${hall.id}`).expect(409);

    const list = await request(http)
      .get('/showings?date=2030-06-15')
      .expect(200);
    expect(list.body[0]).toMatchObject({
      filmTitle: 'Dune',
      hallName: 'Hall 1',
    });
    await request(http).get('/showings?date=15-06-2030').expect(400);

    const url = `/showings/${showing.id}/bookings`;
    const booking = (
      await request(http)
        .post(url)
        .send({
          seats: [
            { row: 1, seat: 1 },
            { row: 1, seat: 2 },
          ],
        })
        .expect(201)
    ).body;
    expect(booking.totalPrice).toBe(25000);

    // atomic conflict: row 3/3 must not be booked
    await request(http)
      .post(url)
      .send({
        seats: [
          { row: 3, seat: 3 },
          { row: 1, seat: 2 },
        ],
      })
      .expect(409);
    await request(http)
      .post(url)
      .send({
        seats: [
          { row: 2, seat: 1 },
          { row: 2, seat: 1 },
        ],
      })
      .expect(400);
    await request(http)
      .post(url)
      .send({ seats: [{ row: 4, seat: 1 }] })
      .expect(400);
    await request(http).post(url).send({ seats: [] }).expect(400);

    let seats = (await request(http).get(`/showings/${showing.id}/seats`)).body;
    expect(seats).toHaveLength(15);
    expect(seats.filter((s: { isBooked: boolean }) => s.isBooked)).toHaveLength(
      2,
    );

    await request(http).delete(`/bookings/${booking.id}`).expect(204);
    seats = (await request(http).get(`/showings/${showing.id}/seats`)).body;
    expect(seats.some((s: { isBooked: boolean }) => s.isBooked)).toBe(false);
    await request(http).delete(`/bookings/${booking.id}`).expect(404);
  });
});
