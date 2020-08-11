/**
 * @author David Maitho
 * @email thigedavidmaitho@gmail.com
 * @create date 2020-08-11 00:25:07
 * @modify date 2020-08-11 23:33:03
 * @desc [description]
 */

 const express = require('express')
 const app = express()
 const bodyParser = require('body-parser')
 app.use(bodyParser.urlencoded({ extended: false}))
 //parse application/json
 app.use(bodyParser.json())
 //Databases
 const { insertNewUser } = require('../databases/realmSchemas')
 
 app.get('/', (request, response) => {
     response.setHeader('Content-Type', 'application/json')
     response.send({
        status: "success",
        name: "David Maitho",
        message: "Root of nodeRealm"
     })
 })

 //POST request to insert new user
 app.post('/insert-new-user', (request, response) => {
     const { tokenkey } = request.headers
     const { name, email } = request.body
     response.setHeader('Content-Type', 'appliication/json')
     if(tokenkey != 'sometokenkey'){
         response.send({
             status: "failed",
             message: "wrong token key!"
         })
         return
     }
     insertNewUser({ name, email }).then(insertedUser => {
         response.send({
             status: "success",
             message: "New user inserted successfully",
             data: insertedUser
         })
     }).catch((error) => {
         response.send({
             status: "failed",
             message: `Insert User error: ${error}`
         })
     })
 })

 module.exports = {
     app
 }