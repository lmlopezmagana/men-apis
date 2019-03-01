import { success, notFound } from '../../services/response/'
import { Photo } from '.'

const uploadService = require('../../services/upload/')
export const create = (req, res, next) => {
// export const create = ({ bodymen: { body } }, res, next) => {
  uploadService.uploadFromBinary(req.file.buffer)
    .then(json => Photo.create({
      propertyId: req.body.propertyId,
      imgurLink: json.data.link,
      deletehash: json.data.deletehash
    }))
    .then((photo) => photo.view(true))
    .then(success(res, 201))
    .catch(next)
}
export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Photo.count(query)
    .then(count => Photo.find(query, select, cursor)
      .then((photos) => ({
        count,
        rows: photos.map((photo) => photo.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Photo.findById(params.id)
    .then(notFound(res))
    .then((photo) => photo ? photo.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Photo.findById(params.id)
    .then(notFound(res))
    .then((photo) => photo ? Object.assign(photo, body).save() : null)
    .then((photo) => photo ? photo.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Photo.findById(params.id)
    .then(notFound(res))
    .then((photo) => photo ? photo.remove() : null)
    .then(success(res, 204))
    .catch(next)
