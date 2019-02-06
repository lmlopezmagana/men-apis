import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Appointment, { schema } from './model'

const router = new Router()
const { title, description, date } = schema.tree

/**
 * @api {post} /appointments Create appointment
 * @apiName CreateAppointment
 * @apiGroup Appointment
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Appointment's title.
 * @apiParam description Appointment's description.
 * @apiParam date Appointment's date.
 * @apiSuccess {Object} appointment Appointment's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Appointment not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ title, description, date }),
  create)

/**
 * @api {get} /appointments Retrieve appointments
 * @apiName RetrieveAppointments
 * @apiGroup Appointment
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of appointments.
 * @apiSuccess {Object[]} rows List of appointments.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /appointments/:id Retrieve appointment
 * @apiName RetrieveAppointment
 * @apiGroup Appointment
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} appointment Appointment's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Appointment not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /appointments/:id Update appointment
 * @apiName UpdateAppointment
 * @apiGroup Appointment
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Appointment's title.
 * @apiParam description Appointment's description.
 * @apiParam date Appointment's date.
 * @apiSuccess {Object} appointment Appointment's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Appointment not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ title, description, date }),
  update)

/**
 * @api {delete} /appointments/:id Delete appointment
 * @apiName DeleteAppointment
 * @apiGroup Appointment
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Appointment not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
