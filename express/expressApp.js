/**
 * @author David Maitho
 * @email thigedavidmaitho@gmail.com
 * @create date 2020-08-11 00:25:07
 * @modify date 2020-08-11 19:40:53
 * @desc [description]
 */

 const express = require('express')
 const app = express()
 const bodyParser = require('body-parser')
 app.use(bodyParser.urlencoded({ extended: false}))
 //parse application/json
 app.use(bodyParser.json())
 app.get('/', (request, response) => {
     response.setHeader('Content-Type', 'application/json')
     response.send({
        status: "success",
        name: "David Maitho",
        message: "Root of nodeRealm"
     })
 })

 module.exports = {
     app
 }