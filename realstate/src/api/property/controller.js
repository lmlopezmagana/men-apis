import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Property } from '.'
import { Photo } from '../photo'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Property.create({ ...body, ownerId: user })
    .then((property) => property.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Property.count(query)
    .then(count => Property.find(query, select, cursor)
      .populate('ownerId')
      .then((properties) => ({
        count,
        // rows: properties.map((property) => property.view())
        rows: properties.map((property) => {
          property.photo = 'https://static10.habimg.com/imgh/3856-1171394/obra-nueva-alquiler-santa_coloma_de_gramenet_3856-img1171394-5678175.jpg' 
          Photo.find({propertyId: property.id})
            .then((photos) => {
              
            })
          return property
        })
      }))
    )
    .then(success(res))
    .catch(next)

export const userProperties = (req, res, next) =>  
  Property.find({ ownerId: req.user.id })
    .then((properties) => ({
      count: properties.count,
      rows: properties.map(property => property.view(true))
    }))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Property.findById(params.id)
    .populate('ownerId')
    .then(notFound(res))
    .then((property) => property ? property.view() : null)
    .then(success(res))
    .catch(next)

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
