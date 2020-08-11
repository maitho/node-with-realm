/**
 * @author David Maitho
 * @email thigedavidmaitho@gmail.com
 * @create date 2020-08-11 19:47:40
 * @modify date 2020-08-11 23:50:13
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
     path: 'RealmInNodeJS.realm',
     schema: [UserSchema],
     schemaVersion: 0, //optional
 }

 //functions for userSchema
 const insertNewUser = newUser => new Promise((resolve, reject) => {
     Realm.open(databaseOptions).then(realm => {
         //check if user exists
         let filteredUsers =  realm.objects(USER_SCHEMA).filtered(`name='${newUser.name.trim()}' AND email='${newUser.email.trim()}'`)
         if(filteredUsers.length > 0) {
             reject("User with the same name and email exists!")
         }
         realm.write(() => {
             newUser.id = Math.floor(Date.now()) //create primary key value from timestamp as realm does not have auto-increment keys
             realm.create(USER_SCHEMA, newUser)
             resolve(newUser)
         })
     }).catch((error) => reject(error))
 })

 module.exports = {
     insertNewUser,
 }