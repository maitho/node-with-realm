/**
 * @author David Maitho
 * @email thigedavidmaitho@gmail.com
 * @create date 2020-08-11 19:47:40
 * @modify date 2020-08-11 19:59:43
 * @desc [description]
 */

 const Realm = require('realm')
 const USER_SCHEMA = "User"
 const Promise = require('promise')

 const UserSchema = {
     name: USER_SCHEMA,
     primaryKey: 'id',
     properties: {
         id: 'int',
         name: { type: 'string', indexed: true },
         email: 'string',
     }
 }

 const databaseOptions = {
     patth: 'RealmInNodeJS.realm',
     scheme: [UserSchema],
     schemaVersion: 0, //optional
 }

 //functions for userSchema
 const insertNewUser = newUser => Promise((resolve, reject) => {

 })

 module.exports = {
     insertNewUser,
 }