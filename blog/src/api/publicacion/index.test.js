import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Publicacion } from '.'

const app = () => express(apiRoot, routes)

let publicacion

beforeEach(async () => {
  publicacion = await Publicacion.create({})
})

test('POST /publicaciones 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ titulo: 'test', autor: 'test', opiniones: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.titulo).toEqual('test')
  expect(body.autor).toEqual('test')
  expect(body.opiniones).toEqual('test')
})

test('GET /publicaciones 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /publicaciones/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${publicacion.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(publicacion.id)
})

test('GET /publicaciones/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /publicaciones/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${publicacion.id}`)
    .send({ titulo: 'test', autor: 'test', opiniones: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(publicacion.id)
  expect(body.titulo).toEqual('test')
  expect(body.autor).toEqual('test')
  expect(body.opiniones).toEqual('test')
})

test('PUT /publicaciones/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ titulo: 'test', autor: 'test', opiniones: 'test' })
  expect(status).toBe(404)
})

test('DELETE /publicaciones/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${publicacion.id}`)
  expect(status).toBe(204)
})

test('DELETE /publicaciones/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
