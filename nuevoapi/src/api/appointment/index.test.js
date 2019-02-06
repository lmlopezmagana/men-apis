import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Appointment } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, appointment

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  appointment = await Appointment.create({ user_id: user })
})

test('POST /appointments 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, title: 'test', description: 'test', date: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.date).toEqual('test')
  expect(typeof body.user_id).toEqual('object')
})

test('POST /appointments 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /appointments 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(typeof body.rows[0].user_id).toEqual('object')
})

test('GET /appointments 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /appointments/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${appointment.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(appointment.id)
  expect(typeof body.user_id).toEqual('object')
})

test('GET /appointments/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${appointment.id}`)
  expect(status).toBe(401)
})

test('GET /appointments/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /appointments/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${appointment.id}`)
    .send({ access_token: userSession, title: 'test', description: 'test', date: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(appointment.id)
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.date).toEqual('test')
  expect(typeof body.user_id).toEqual('object')
})

test('PUT /appointments/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${appointment.id}`)
    .send({ access_token: anotherSession, title: 'test', description: 'test', date: 'test' })
  expect(status).toBe(401)
})

test('PUT /appointments/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${appointment.id}`)
  expect(status).toBe(401)
})

test('PUT /appointments/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, title: 'test', description: 'test', date: 'test' })
  expect(status).toBe(404)
})

test('DELETE /appointments/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${appointment.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /appointments/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${appointment.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /appointments/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${appointment.id}`)
  expect(status).toBe(401)
})

test('DELETE /appointments/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
