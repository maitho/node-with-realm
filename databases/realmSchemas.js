/**
 * @author David Maitho
 * @email thigedavidmaitho@gmail.com
 * @create date 2020-08-11 19:47:40
 * @modify date 2020-08-14 09:51:00
 * @desc [description]
 */

 const Realm = require('realm')
 const USER_SCHEMA = "User"
 const ADDRESS_SCHEMA = "Address"
 const Promise = require('promise')

 const AddressSchema = {
     name: ADDRESS_SCHEMA,
     primaryKey: 'id',
     properties: {
         id: 'int', //primary key
         street: 'string',
         city: 'string',
         state: 'string?' //optional property - can be null
     }
 }

 const UserSchema = {
     name: USER_SCHEMA,
     primaryKey: 'id',
     properties: {
         id: 'int',
         name: { type: 'string', indexed: true },
         email: 'string',
         addresses: { type: 'list', objectType: ADDRESS_SCHEMA},
     }
 }

 const databaseOptions = {
     path: 'RealmInNodeJS.realm',
     schema: [UserSchema, AddressSchema],
     schemaVersion: 1, //optional
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

 const findAllUsers = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allUsers = realm.objects(USER_SCHEMA)         
        resolve(allUsers)
     }).catch((error) => {
         reject(error)
     })
 })

 const filterUserByName = (searchName) => new Promise((resolve, reject) => {
     Realm.open(databaseOptions).then(realm => {
         let filteredUsers = realm.objects(USER_SCHEMA).filtered(`name CONTAINS[c] '${searchName}'`)
         resolve(filteredUsers)
     }).catch((error) => {
         reject(error)
     })
 })

 //update existing user
 const updateUser = (userId, updatingUser) => new Promise((resolve, reject) => {
     Realm.open(databaseOptions).then(realm => {
         realm.write(() => {
             let user = realm.objectForPrimaryKey(USER_SCHEMA, userId)
             if(!user){
                 reject(`Cannot find user with ID=${userId} to update`)
                 return
             }
             user.name = updatingUser.name
             user.email = updatingUser.email
             resolve(user)
         })
     }).catch((error) => reject(error))
 })

 //function for AddressSchema
 const insertAddressToUser = (userId, addressObject) => new Promise((resolve, reject) => {
     Realm.open(databaseOptions).then(realm => {
         const { street, city, state } = addressObject
         let userObject = realm.objectForPrimaryKey(USER_SCHEMA, userId);
         if(!userObject){
            reject(`Cannot find user with ID=${userId} to update/insert address`)
            return
         }
         let filteredAddress = userObject.addresses.filtered(`street='${street.trim()}' AND city='${city.trim()}'`)
         if(filteredAddress.length > 0) {
             reject("Address with the street and city exists!")
             return
         }
         realm.write(() => {
             let newAddress = {
                 id: Math.floor(Date.now()),
                 street, city, state
             }
             userObject.addresses.push(newAddress)
             resolve()
         })
     }).catch((error) => reject(error))
 })

 const deleteUser = (userId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let userObject = realm.objectForPrimaryKey(USER_SCHEMA, userId)
        if(!userObject){
            reject(`Cannot find user with ID=${userId} to delete`)
        }
        realm.write(() => {
            realm.delete(userObject.addresses)
            realm.delete(userObject)
            resolve()
        })
    }).catch((error) => reject(error))
})

const deleAllUsers = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let allUsers = realm.objects(USER_SCHEMA)
            for(var index in  allUsers){
                realm.delete(allUsers[index].addresses)
            }
            realm.delete(allUsers)
            resolve()
        })
    }).catch((error) => reject(error))
})

 //for testing purpose Not good for API, will just log available users in real
//  deleAllUsers().then(() => {
//     console.log(`allUsers has been deleted`)
//  }).catch((error) => {
//     console.log(`cannot  delete all users. Error: ${error}`)
//  })

 findAllUsers().then((allUsers) => {
     console.log(`allUsers = ${JSON.stringify(allUsers)}`)
 }).catch((error) => {
     console.log(`cannot  get all users. Error: ${error}`)
 })

 module.exports = {
    insertNewUser,
    filterUserByName,
    updateUser,
    insertAddressToUser,
    deleteUser
}