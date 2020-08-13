/**
 * @author David Maitho
 * @email thigedavidmaitho@gmail.com
 * @create date 2020-08-11 19:47:40
 * @modify date 2020-08-12 00:47:29
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
         }else {
            realm.write(() => {
                newUser.id = Math.floor(Date.now()) //create primary key value from timestamp as realm does not have auto-increment keys
                realm.create(USER_SCHEMA, newUser)
                resolve(newUser)
            })
        }
     }).catch((error) => reject(error))
 })

 module.exports = {
     insertNewUser,
 }

 const findAllUsers = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allUsers = realm.objects(USER_SCHEMA)         
        resolve(allUsers)
     }).catch((error) => {
         reject(error)
     })
 })
 //for testing purpose Not good for API
 findAllUsers().then((allUsers) => {
     console.log(`allUsers = ${JSON.stringify(allUsers)}`)
 }).catch((error) => {
     console.log(`cannot  get all users. Error: ${error}`)
 })