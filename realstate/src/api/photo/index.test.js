import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Photo } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, photo

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  photo = await Photo.create({})
})

test('POST /photos 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, propertyId: 'test', imgurLink: 'test', deletehash: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.propertyId).toEqual('test')
  expect(body.imgurLink).toEqual('test')
  expect(body.deletehash).toEqual('test')
})

test('POST /photos 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /photos 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /photos 401 (admin)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('GET /photos 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /photos 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /photos/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${photo.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(photo.id)
})

test('GET /photos/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${photo.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('GET /photos/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${photo.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /photos/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${photo.id}`)
  expect(status).toBe(401)
})

test('GET /photos/:id 404 (master)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})

test('PUT /photos/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${photo.id}`)
    .send({ access_token: userSession, propertyId: 'test', imgurLink: 'test', deletehash: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(photo.id)
  expect(body.propertyId).toEqual('test')
  expect(body.imgurLink).toEqual('test')
  expect(body.deletehash).toEqual('test')
})

test('PUT /photos/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${photo.id}`)
  expect(status).toBe(401)
})

test('PUT /photos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: userSession, propertyId: 'test', imgurLink: 'test', deletehash: 'test' })
  expect(status).toBe(404)
})

test('DELETE /photos/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${photo.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /photos/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${photo.id}`)
  expect(status).toBe(401)
})

test('DELETE /photos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})
