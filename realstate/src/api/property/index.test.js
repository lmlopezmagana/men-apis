import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Property } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, adminSession, property

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  adminSession = signSync(admin.id)
  property = await Property.create({ ownerId: user })
})

test('POST /properties 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, title: 'test', description: 'test', price: 'test', rooms: 'test', categoryId: 'test', address: 'test', zipcode: 'test', city: 'test', province: 'test', loc: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.price).toEqual('test')
  expect(body.rooms).toEqual('test')
  expect(body.categoryId).toEqual('test')
  expect(body.address).toEqual('test')
  expect(body.zipcode).toEqual('test')
  expect(body.city).toEqual('test')
  expect(body.province).toEqual('test')
  expect(body.loc).toEqual('test')
  expect(typeof body.ownerId).toEqual('object')
})

test('POST /properties 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /properties 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /properties 401 (admin)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('GET /properties 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /properties 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /properties/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${property.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(property.id)
})

test('GET /properties/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${property.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('GET /properties/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${property.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /properties/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${property.id}`)
  expect(status).toBe(401)
})

test('GET /properties/:id 404 (master)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})

test('PUT /properties/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${property.id}`)
    .send({ access_token: userSession, title: 'test', description: 'test', price: 'test', rooms: 'test', categoryId: 'test', address: 'test', zipcode: 'test', city: 'test', province: 'test', loc: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(property.id)
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.price).toEqual('test')
  expect(body.rooms).toEqual('test')
  expect(body.categoryId).toEqual('test')
  expect(body.address).toEqual('test')
  expect(body.zipcode).toEqual('test')
  expect(body.city).toEqual('test')
  expect(body.province).toEqual('test')
  expect(body.loc).toEqual('test')
  expect(typeof body.ownerId).toEqual('object')
})

test('PUT /properties/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${property.id}`)
    .send({ access_token: anotherSession, title: 'test', description: 'test', price: 'test', rooms: 'test', categoryId: 'test', address: 'test', zipcode: 'test', city: 'test', province: 'test', loc: 'test' })
  expect(status).toBe(401)
})

test('PUT /properties/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${property.id}`)
  expect(status).toBe(401)
})

test('PUT /properties/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, title: 'test', description: 'test', price: 'test', rooms: 'test', categoryId: 'test', address: 'test', zipcode: 'test', city: 'test', province: 'test', loc: 'test' })
  expect(status).toBe(404)
})

test('DELETE /properties/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${property.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /properties/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${property.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /properties/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${property.id}`)
  expect(status).toBe(401)
})

test('DELETE /properties/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
