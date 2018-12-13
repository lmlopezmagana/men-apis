import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Opinion, { schema } from './model'

const router = new Router()
const { fecha, texto, usuario_id, publicacion_id } = schema.tree

/**
 * @api {post} /opinions Create opinion
 * @apiName CreateOpinion
 * @apiGroup Opinion
 * @apiParam fecha Opinion's fecha.
 * @apiParam texto Opinion's texto.
 * @apiParam usuario_id Opinion's usuario_id.
 * @apiSuccess {Object} opinion Opinion's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Opinion not found.
 */
router.post('/',
  body({ fecha, texto, usuario_id, publicacion_id }),
  create)

/**
 * @api {get} /opinions Retrieve opinions
 * @apiName RetrieveOpinions
 * @apiGroup Opinion
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of opinions.
 * @apiSuccess {Object[]} rows List of opinions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /opinions/:id Retrieve opinion
 * @apiName RetrieveOpinion
 * @apiGroup Opinion
 * @apiSuccess {Object} opinion Opinion's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Opinion not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /opinions/:id Update opinion
 * @apiName UpdateOpinion
 * @apiGroup Opinion
 * @apiParam fecha Opinion's fecha.
 * @apiParam texto Opinion's texto.
 * @apiParam usuario_id Opinion's usuario_id.
 * @apiSuccess {Object} opinion Opinion's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Opinion not found.
 */
router.put('/:id',
  body({ fecha, texto, usuario_id }),
  update)

/**
 * @api {delete} /opinions/:id Delete opinion
 * @apiName DeleteOpinion
 * @apiGroup Opinion
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Opinion not found.
 */
router.delete('/:id',
  destroy)

export default router
