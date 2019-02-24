import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Property } from '.'
import { Photo } from '../photo'
import { User } from '../user'
import { resolve } from 'url';

export const create = ({ user, bodymen: { body } }, res, next) =>
  Property.create({ ...body, ownerId: user })
    .then((property) => property.view(true))
    .then(success(res, 201))
    .catch(next)


/*
export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Property.count(query)
    .then(count => Property.find(query, select, cursor)
      .populate('ownerId', 'name picture')
      .then((properties) => ({
        count,
        rows: properties.map((property) => property.view())
      }))
    )
    .then(success(res))
    .catch(next)
*/


let queryFirstPhoto = (property) =>  {
  return new Promise((resolve, reject) => {
    Photo
      .find({propertyId: property.id})
      .sort({_id: -1})
      .limit(1)
      .exec(function (err, photos) {
        if (err) {
          reject(err)
        }
        else {
          let result = JSON.parse(JSON.stringify(property))
          if (photos.length > 0)
            result['photos'] = [photos[0].imgurLink]
          resolve(result)
        }
      })
  })  
}

let queryAllPhotos = (property) => {
  return new Promise((resolve, reject) => {
    Photo
      .find({propertyId: property.id})
      .exec(function (err, photos) {
        if (err) {
          reject(err)
        }
        else {
          let result = JSON.parse(JSON.stringify(property))          
          let images = photos.map((photo) => photo.imgurLink)
          result['photos'] = images
          resolve(result)
        }
      })
  })
}


export const index2 = ({ querymen: { query, select, cursor } }, res, next) => {
  Property
    .find(query, select, cursor)
    .populate('ownerId', 'name picture')
    .populate('categoryId', 'name')
    .exec(function (err, properties){
        Promise.all(properties.map(function(property){
          return queryFirstPhoto(property)
        }))
        .then((result) => ({
          count: result.length,
          rows: result
        }))
        .then(success(res))
        .catch(next)
    })
}

export const userProperties = ({user, querymen: { query, select, cursor } }, res, next) => {
  query['ownerId'] = user.id
  Property
  .find(query, select, cursor)
  .populate('categoryId', 'name')
  .exec(function (err, properties){
      Promise.all(properties.map(function(property){
        return queryFirstPhoto(property)
      }))
      .then((result) => ({
        count: result.length,
        rows: result
      }))
      .then(success(res))
      .catch(next)
  })

}


export const show = ({ params }, res, next) =>
  Property.findById(params.id)
    .populate('ownerId', 'name picture')
    .populate('categoryId', 'name')
    .exec(function(err, property){      
      if (err) next
      if (property === null) { 
        res.status(404).end()
      } else {
        queryAllPhotos(property)
        .then((result) => ({
          count: 1,
          rows: result
        }))
        .then(success(res))
        .catch(next)
      }
    })

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Property.findById(params.id)
    .populate('ownerId')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'ownerId'))
    .then((property) => property ? Object.assign(property, body).save() : null)
    .then((property) => property ? property.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Property.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'ownerId'))
    .then((property) => property ? property.remove() : null)
    .then(success(res, 204))
    .catch(next)

export const addFavorite = ({user, params}, res, next) =>
  User.findByIdAndUpdate(user.id, {$addToSet: {favs: params.id}}, {new : true})
    .then(success(res, 200))
    .catch(next)

export const delFavorite = ({user, params}, res, next) =>
  User.findByIdAndUpdate(user.id, {$pull: {favs: params.id}}, {new : true})
    .then(success(res, 200))
    .catch(next)


export const userFavorites = ({ user, querymen: { query, select, cursor } }, res, next) => {
  query['_id'] = { $in: user.favs }
  Property
    .find(query, select, cursor)
    .populate('categoryId', 'name')
    .exec(function (err, properties){
        Promise.all(properties.map(function(property){
          return queryFirstPhoto(property)
        }))
        .then((result) => ({
          count: result.length,
          rows: result
        }))
        .then(success(res))
        .catch(next)
    })
}