import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Opinion } from '.'

const app = () => express(apiRoot, routes)

let opinion

beforeEach(async () => {
  opinion = await Opinion.create({})
})

test('POST /opinions 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ fecha: 'test', texto: 'test', usuario_id: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.fecha).toEqual('test')
  expect(body.texto).toEqual('test')
  expect(body.usuario_id).toEqual('test')
})

test('GET /opinions 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /opinions/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${opinion.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(opinion.id)
})

test('GET /opinions/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /opinions/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${opinion.id}`)
    .send({ fecha: 'test', texto: 'test', usuario_id: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(opinion.id)
  expect(body.fecha).toEqual('test')
  expect(body.texto).toEqual('test')
  expect(body.usuario_id).toEqual('test')
})

test('PUT /opinions/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ fecha: 'test', texto: 'test', usuario_id: 'test' })
  expect(status).toBe(404)
})

test('DELETE /opinions/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${opinion.id}`)
  expect(status).toBe(204)
})

test('DELETE /opinions/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
