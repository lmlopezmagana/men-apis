import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token, master } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Photo, { schema } from './model'

const router = new Router()
const { propertyId, imgurLink, deletehash } = schema.tree

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

/**
 * @api {post} /photos Create photo
 * @apiName CreatePhoto
 * @apiGroup Photo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam propertyId Photo's propertyId.
 * @apiParam imgurLink Photo's imgurLink.
 * @apiParam deletehash Photo's deletehash.
 * @apiSuccess {Object} photo Photo's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Photo not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  // body({ propertyId, imgurLink, deletehash }),
  upload.single('photo'),
  create)

/**
 * @api {get} /photos Retrieve photos
 * @apiName RetrievePhotos
 * @apiGroup Photo
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of photos.
 * @apiSuccess {Object[]} rows List of photos.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 master access only.
 */
router.get('/',
  master(),
  query(),
  index)

/**
 * @api {get} /photos/:id Retrieve photo
 * @apiName RetrievePhoto
 * @apiGroup Photo
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess {Object} photo Photo's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Photo not found.
 * @apiError 401 master access only.
 */
router.get('/:id',
  master(),
  show)

/**
 * @api {put} /photos/:id Update photo
 * @apiName UpdatePhoto
 * @apiGroup Photo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam propertyId Photo's propertyId.
 * @apiParam imgurLink Photo's imgurLink.
 * @apiParam deletehash Photo's deletehash.
 * @apiSuccess {Object} photo Photo's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Photo not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ propertyId, imgurLink, deletehash }),
  update)

/**
 * @api {delete} /photos/:id Delete photo
 * @apiName DeletePhoto
 * @apiGroup Photo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Photo not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
