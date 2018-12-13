import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Publicacion, { schema } from './model'

const router = new Router()
const { titulo, autor, opiniones } = schema.tree

/**
 * @api {post} /publicaciones Create publicacion
 * @apiName CreatePublicacion
 * @apiGroup Publicacion
 * @apiParam titulo Publicacion's titulo.
 * @apiParam autor Publicacion's autor.
 * @apiParam opiniones Publicacion's opiniones.
 * @apiSuccess {Object} publicacion Publicacion's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Publicacion not found.
 */
router.post('/',
  body({ titulo, autor, opiniones }),
  create)

/**
 * @api {get} /publicaciones Retrieve publicacions
 * @apiName RetrievePublicacions
 * @apiGroup Publicacion
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of publicacions.
 * @apiSuccess {Object[]} rows List of publicacions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /publicaciones/:id Retrieve publicacion
 * @apiName RetrievePublicacion
 * @apiGroup Publicacion
 * @apiSuccess {Object} publicacion Publicacion's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Publicacion not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /publicaciones/:id Update publicacion
 * @apiName UpdatePublicacion
 * @apiGroup Publicacion
 * @apiParam titulo Publicacion's titulo.
 * @apiParam autor Publicacion's autor.
 * @apiParam opiniones Publicacion's opiniones.
 * @apiSuccess {Object} publicacion Publicacion's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Publicacion not found.
 */
router.put('/:id',
  body({ titulo, autor, opiniones }),
  update)

/**
 * @api {delete} /publicaciones/:id Delete publicacion
 * @apiName DeletePublicacion
 * @apiGroup Publicacion
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Publicacion not found.
 */
router.delete('/:id',
  destroy)

export default router
