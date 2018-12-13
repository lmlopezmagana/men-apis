import { success, notFound } from '../../services/response/'
import { Publicacion } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Publicacion.create(body)
    .then((publicacion) => publicacion.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Publicacion.count(query)
    .then(count => Publicacion.find(query, select, cursor)
      .then((publicacions) => ({
        count,
        rows: publicacions.map((publicacion) => publicacion.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Publicacion.findById(params.id)
    .then(notFound(res))
    .then((publicacion) => publicacion ? publicacion.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Publicacion.findById(params.id)
    .then(notFound(res))
    .then((publicacion) => publicacion ? Object.assign(publicacion, body).save() : null)
    .then((publicacion) => publicacion ? publicacion.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Publicacion.findById(params.id)
    .then(notFound(res))
    .then((publicacion) => publicacion ? publicacion.remove() : null)
    .then(success(res, 204))
    .catch(next)
