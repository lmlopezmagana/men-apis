import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token, master } from '../../services/passport'
import { create, index, show, update, destroy, userProperties, addFavorite, delFavorite, userFavorites, authenticatedIndex } from './controller'
import { schema } from './model'
export Property, { schema } from './model'

const router = new Router()
const { title, description, price, rooms, size, categoryId, address, zipcode, city, province, loc } = schema.tree

/**
 * @api {post} /properties Create property
 * @apiName CreateProperty
 * @apiGroup Property
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Property's title.
 * @apiParam description Property's description.
 * @apiParam price Property's price.
 * @apiParam rooms Property's rooms.
 * @apiParam categoryId Property's categoryId.
 * @apiParam address Property's address.
 * @apiParam zipcode Property's zipcode.
 * @apiParam city Property's city.
 * @apiParam province Property's province.
 * @apiParam loc Property's loc.
 * @apiSuccess {Object} property Property's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Property not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ title, description, price, rooms, size, categoryId, address, zipcode, city, province, loc }),
  create)

/**
 * @api {get} /properties Retrieve properties
 * @apiName RetrieveProperties
 * @apiGroup Property
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of properties.
 * @apiSuccess {Object[]} rows List of properties.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 master access only.
 */
router.get('/',
  master(),
  query(),
  index)


/**
 * @api {get} /properties/auth/ Retrieve properties when user is authenticated
 * @apiName RetrievePropertiesAuthenticated
 * @apiGroup Property
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of properties.
 * @apiSuccess {Object[]} rows List of properties.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 master access only.
 */
router.get('/auth',
  token({ required: true }),
  query(),
  authenticatedIndex)


/**
 * @api {get} /properties/mine Retrieve properties of a user
 * @apiName RetrieveProperties of a user
 * @apiGroup Property
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of properties.
 * @apiSuccess {Object[]} rows List of properties.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 master access only.
 */
router.get('/mine',
  token({ required: true }),
  query(),
  userProperties)


/**
 * @api {get} /properties/favs Retrieve the favorite properties of a user
 * @apiName RetrieveFavsProperties of a user
 * @apiGroup Property
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of properties.
 * @apiSuccess {Object[]} rows List of properties.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 master access only.
 */
router.get('/fav',
  token({ required: true }),
  query(),
  userFavorites)


/**
 * @api {get} /properties/:id Retrieve property
 * @apiName RetrieveProperty
 * @apiGroup Property
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess {Object} property Property's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Property not found.
 * @apiError 401 master access only.
 */
router.get('/:id',
  master(),
  show)

/**
 * @api {put} /properties/:id Update property
 * @apiName UpdateProperty
 * @apiGroup Property
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Property's title.
 * @apiParam description Property's description.
 * @apiParam price Property's price.
 * @apiParam rooms Property's rooms.
 * @apiParam categoryId Property's categoryId.
 * @apiParam address Property's address.
 * @apiParam zipcode Property's zipcode.
 * @apiParam city Property's city.
 * @apiParam province Property's province.
 * @apiParam loc Property's loc.
 * @apiSuccess {Object} property Property's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Property not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ title, description, price, rooms, categoryId, address, zipcode, city, province, loc }),
  update)

/**
 * @api {delete} /properties/:id Delete property
 * @apiName DeleteProperty
 * @apiGroup Property
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Property not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)





/**
 * @api {post} /properties/fav/:id Add a property as favorite
 * @apiName AddFavProperty
 * @apiGroup Property
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} user Users's data.
 * @apiError 401 user access only.
 */
router.post('/fav/:id',
  token({required: true}),
  addFavorite)

/**
 * @api {delete} /properties/fav/:id Delete a property as a favorite
 * @apiName DeleteFavProperty
 * @apiGroup Property
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 user access only.
 */
router.delete('/fav/:id',
  token({required: true}),
  delFavorite)

export default router
