import { success, notFound } from '../../services/response/'
import { User } from '.'
import { sign } from '../../services/jwt'

const uploadService = require('../../services/upload/')


export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.count(query)
    .then(count => User.find(query, select, cursor)
      .then(users => ({
        rows: users.map((user) => user.view()),
        count
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.view() : null)
    .then(success(res))
    .catch(next)

export const showMe = ({ user }, res) =>
  res.json(user.view(true))

export const create = (req, res, next) => {  
  uploadService.uploadFromBinary(req.file.buffer)
  .then(json => 
    User.create({
       email: req.body.email,
       password: req.body.password,
       name: req.body.name,
       role: req.body.role,
       picture: json.data.link,
       deletehash: json.data.deletehash
    }))
    .then(user => {
      sign(user.id)
        .then((token) => ({ token, user: user.view(true) }))
        .then(success(res, 201))
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'email',
          message: 'email already registered'
        })
      } else {
        next(err)
      }
    })  
}


// export const update = ({ bodymen: { body }, params, user }, res, next) =>
export const update = (req, res, next) =>
  User.findById(req.params.id === 'me' ? req.user.id : req.params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isAdmin = req.user.role === 'admin'
      const isSelfUpdate = req.user.id === result.id
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other user\'s data'
        })
        return null
      }
      return result
    })
    .then((user) => { 
      if (user == null)
      { return null }
      else {
        uploadService.uploadFromBinary(req.file.buffer)
          .then(json => {
            Object.assign(user, req.body)
            user.picture = json.data.link
            user.deletehash = json.data.deletehash
            return user.save()
          })
      }
    })
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

export const updatePassword = ({ bodymen: { body }, params, user }, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: 'password',
          message: 'You can\'t change other user\'s password'
        })
        return null
      }
      return result
    })
    .then((user) => user ? user.set({ password: body.password }).save() : null)
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => {
      uploadService.deleteImage(user.deletehash)
      return user
    })
    .then((user) => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(next)
