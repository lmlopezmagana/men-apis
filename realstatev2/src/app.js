import http from 'http'
import { env, mongo, port, ip, apiRoot, initDatabase } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'

const initdb = require('./initdb');

const app = express(apiRoot, api)
const server = http.createServer(app)

mongoose.Promise = Promise
mongoose.connect(mongo.uri, {useNewUrlParser: true}, (err, db) => {
  if (initDatabase) {
    db.db.collections((err, collections) => {
      if (collections.length > 0) {
        if (collections.some(collection => collection.collectionName === 'properties')) {          
          db.collection('properties').count()
          .then((count) => {
            if (count > 0)
              console.log("La base de datos ya tiene datos")
            else
              initdb.initdb();
          })
        } else
            initdb.initdb();
      } else
        initdb.initdb();
    })
  } else {
    console.log("No está activa la inicialización de la base de datos")
  }
  
})



setImmediate(() => {
  server.listen(port, ip, () => {
    console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
  })
})


export default app
