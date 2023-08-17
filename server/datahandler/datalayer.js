const { MongoClient } = require('mongodb')
const uri = "mongodb://localhost:27017"

/**
 * Inserts a document(s) into the specified collection
 * @param {string} collectionName Collection to insert into
 * @param {boolean} multiple Specifies if multiple documents should be inserted
 * @param {object} data The document or array of documents to insert
 * @param {function(error, result)} callback The function to call after the operation is executed
 */
const create = async (collectionName, multiple, data, callback) => {
    const client = new MongoClient(uri)
    try {
        const database = client.db("PRO100_OLIM")
        const collection = database.collection(collectionName)

        let result
        if (multiple)
            result = await collection.insertMany(data)
        else
            result = await collection.insertOne(data)

        callback(null, result)
    } catch (err) {
        callback(err, null)
    } finally {
        await client.close()
    }
}

/**
 * Retrieves a document(s) from the specified collection
 * @param {string} collectionName Collection to retrieve from
 * @param {boolean} multiple Specifies if multiple documents should be retrieved
 * @param {object} filter The filter to compare documents against
 * @param {function(error, result)} callback The function to call after the operation is executed
 */
const get = async (collectionName, multiple, filter, callback) => {
    const client = new MongoClient(uri)
    try {
        const database = client.db("PRO100_OLIM")
        const collection = database.collection(collectionName)

        let result
        if (multiple)
            result = await collection.find(filter).toArray()
        else
            result = await collection.findOne(filter)

        callback(null, result)
    } catch (err) {
        callback(err, null)
    } finally {
        await client.close()
    }
}

/**
 * Updates a document(s) in the specified collection
 * @param {string} collectionName Collection to update in
 * @param {boolean} multiple Specifies if multiple documents should be updated
 * @param {object} filter The filter to compare documents against
 * @param {object} data The update query
 * @param {function(error, result)} callback The function to call after the operation is executed
 */
const update = async (collectionName, multiple, filter, data, callback) => {
    const client = new MongoClient(uri)
    try {
        const database = client.db("PRO100_OLIM")
        const collection = database.collection(collectionName)

        let result
        if (multiple)
            result = await collection.updateMany(filter, data)
        else
            result = await collection.updateOne(filter, data)

        callback(null, result)
    } catch (err) {
        callback(err, null)
    } finally {
        await client.close()
    }
}

/**
 * Removes a document(s) from the specified collection
 * @param {string} collectionName Collection to remove from
 * @param {boolean} multiple Specifies if multiple documents should be removed
 * @param {object} filter The filter to compare documents against
 * @param {function(error, result)} callback The function to call after the operation is executed
 */
const remove = async (collectionName, multiple, filter, callback) => {
    const client = new MongoClient(uri)
    try {
        const database = client.db("PRO100_OLIM")
        const collection = database.collection(collectionName)

        let result
        if (multiple)
            result = await collection.deleteMany(filter)
        else
            result = await collection.deleteOne(filter)

        callback(null, result)
    } catch (err) {
        callback(err, null)
    } finally {
        await client.close()
    }
}

const chatRooms = {
    /**
     * Inserts a chat room document(s) into the database
     * 
     * Required fields: "admin_user_id"
     * 
     * Available fields: "admin_user_id", "invite_code", "password_hash", "users", "messages"
     * 
     * @param {boolean} multipleDocs Specifies if multiple documents should be inserted
     * @param {object} data The document or array of documents to insert
     * @param {function(error, result)} callback The function to call after the operation is executed
     */
    create: (multipleDocs, data, callback) => {
        if (typeof multipleDocs !== "boolean") {
            callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
            return
        }

        // enforcing a data structure
        const requiredKeys = [{name: "admin_user_id", dataType: "string"}]
        for (let i = 0; i < requiredKeys.length; i++) {
            let key = requiredKeys[i]
            if (!data.hasOwnProperty(key.name) || typeof data[key.name] !== key.dataType) {
                callback(new Error(`Cannot create Chat Room without key: '${key.name}' of type: '${key.dataType}'`), null)
                return
            }
        }

        const dataFormat = {
            id: "",  // TODO: generate unique id
            admin_user_id: data.admin_user_id,
            invite_code: data.invite_code,
            password_hash: data.password_hash,
            users: data.users,
            messages: data.messages
        }

        create("chat_rooms", multipleDocs, dataFormat, callback)
    },
    /**
     * Retrieves a chat room document(s) from the database
     * 
     * Available fields: "id", "admin_user_id", "invite_code", "password_hash", "users", "messages"
     * 
     * @param {boolean} multipleDocs Specifies if multiple documents should be retrieved
     * @param {object} filter The filter to compare documents against
     * @param {function(error, result)} callback The function to after once the operation is executed
     */
    get: (multipleDocs, filter, callback) => {
        if (typeof multipleDocs !== "boolean") {
            callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
            return
        }

        get("chat_rooms", multipleDocs, filter, callback)
    },
    /**
     * Updates a chat room document(s) in the database
     * 
     * Valid update fields: "admin_user_id", "invite_code", "password_hash", "users", "messages"
     * 
     * @param {boolean} multipleDocs Specifies if multiple documents should be updated
     * @param {object} filter The filter to compare documents against
     * @param {object} data The updated fields
     * @param {function(error, result)} callback The function to call after the operation is executed
     */
    update: (multipleDocs, filter, data, callback) => {
        if (typeof multipleDocs !== "boolean") {
            callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
            return
        }

        // enforcing a data structure
        const validKeys = [
            {name: "admin_user_id", dataType: "string"},
            {name: "invite_code", dataType: "string"},
            {name: "password_hash", dataType: "string"},
            {name: "users", dataType: "object"},
            {name: "messages", dataType: "object"}
        ]
        const dataFormat = {}

        for (let i = 0; i < validKeys.length; i++) {
            let key = validKeys[i]
            if (data.hasOwnProperty(key.name)) {
                if (typeof data[key.name] !== key.dataType) {
                    callback(new Error(`Value of key: 'chat_room.${key.name}' must be of type: '${key.dataType}'`), null)
                    return
                }

                dataFormat[key.name] = data[key.name]
            }
        }

        update("chat_rooms", multipleDocs, filter, dataFormat, callback)
    },
    /**
     * Removes a chat room document(s) from the database
     * 
     * Available fields: "id", "admin_user_id", "invite_code", "password_hash", "users", "messages"
     * 
     * @param {boolean} multipleDocs Specifies if multiple documents should be removed
     * @param {object} filter The filter to compare documents against
     * @param {function(error, result)} callback The function to call after the operation is executed
     */
    remove: (multipleDocs, filter, callback) => {
        if (typeof multipleDocs !== "boolean") {
            callback(new Error("Parameter 'multipleDocs' must be of type: 'boolean'"), null)
            return
        }

        remove("chat_rooms", multipleDocs, filter, callback)
    }
}

const users = {
    /**
     * Inserts a user document(s) into the database
     * 
     * Required fields: "username"
     * 
     * Available fields: "username"
     * 
     * @param {boolean} multipleDocs Specifies if multiple documents should be inserted
     * @param {object} data The document or array of documents to insert
     * @param {function(error, result)} callback The function to call after the operation is executed
     */
    create: (multipleDocs, data, callback) => {
        if (typeof multipleDocs !== "boolean") {
            callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
            return
        }

        // enforcing a data structure
        const requiredKeys = [{name: "username", dataType: "string"}]
        for (let i = 0; i < requiredKeys.length; i++) {
            let key = requiredKeys[i]
            if (!data.hasOwnProperty(key.name) || typeof data[key.name] !== key.dataType) {
                callback(new Error(`Cannot create User without key: '${key.name}' of type: '${key.dataType}'`), null)
                return
            }
        }

        const dataFormat = {
            id: "",     // TODO generate unique id
            username: data.username
        }

        create("users", multipleDocs, dataFormat, callback)
    },
    /**
     * Retrieves a user document(s) from the database
     * 
     * Available fields: "id", "username"
     * 
     * @param {boolean} multipleDocs Specifies if multiple documents should be retrieved
     * @param {object} filter The filter to compare documents against
     * @param {function(error, result)} callback The function to after once the operation is executed
     */
    get: (multipleDocs, filter, callback) => {
        if (typeof multipleDocs !== "boolean") {
            callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
            return
        }

        get("users", multipleDocs, filter, callback)
    },
    /**
     * Updates a user document(s) in the database
     * 
     * Valid update fields: "username"
     * 
     * @param {boolean} multipleDocs Specifies if multiple documents should be updated
     * @param {object} filter The filter to compare documents against
     * @param {object} data The updated fields
     * @param {function(error, result)} callback The function to call after the operation is executed
     */
    update: (multipleDocs, filter, data, callback) => {
        if (typeof multipleDocs !== "boolean") {
            callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
            return
        }

        // enforcing a data structure
        const validKeys = [{name: "username", dataType: "string"}]
        const dataFormat = {}

        for (let i = 0; i < validKeys.length; i++) {
            let key = validKeys[i]
            if (data.hasOwnProperty(key.name)) {
                if (typeof data[key.name] !== key.dataType) {
                    callback(new Error(`Value of key: 'user.${key.name}' must be of type: '${key.dataType}'`), null)
                    return
                }

                dataFormat[key.name] = data[key.name]
            }
        }

        update("users", multipleDocs, filter, dataFormat, callback)
    },
    /**
     * Removes a user document(s) from the database
     * 
     * Available fields: "id", "username"
     * 
     * @param {boolean} multipleDocs Specifies if multiple documents should be removed
     * @param {object} filter The filter to compare documents against
     * @param {function(error, result)} callback The function to call after the operation is executed
     */
    remove: (multipleDocs, filter, callback) => {
        if (typeof multipleDocs !== "boolean") {
            callback(new Error("Parameter 'multipleDocs' must be of type: 'boolean'"), null)
            return
        }

        remove("users", multipleDocs, filter, callback)
    }
}

const messages = {
    /**
     * Inserts a message document(s) into the database
     * 
     * Required fields: "user_id", "timestamp", "content"
     * 
     * Availabe fields: "user_id", "timestamp", "content"
     * 
     * @param {boolean} multipleDocs Specifies if multiple documents should be inserted
     * @param {object} data The document or array of documents to insert
     * @param {function(error, result)} callback The function to call after the operation is executed
     */
    create: (multipleDocs, data, callback) => {
        if (typeof multipleDocs !== "boolean") {
            callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
            return
        }

        // enforcing a data structure
        const requiredKeys = [
            {name: "user_id", dataType: "string"},
            {name: "timestamp", dataType: "string"},
            {name: "content", dataType: "string"}
        ]
        for (let i = 0; i < requiredKeys.length; i++) {
            let key = requiredKeys[i]
            if (!data.hasOwnProperty(key.name) || typeof data[key.name] !== key.dataType) {
                callback(new Error(`Cannot create Message without key: '${key.name}' of type: '${key.dataType}'`), null)
                return
            }
        }

        const dataFormat = {
            id: "",     // TODO generate unique id
            user_id: data.user_id,
            timestamp: data.timestamp,
            content: data.content
        }

        create("messages", multipleDocs, dataFormat, callback)
    },
    /**
     * Retrieves a message document(s) from the database
     * 
     * Availabe fields: "id", "user_id", "timestamp", "content"
     * 
     * @param {boolean} multipleDocs Specifies if multiple documents should be retrieved
     * @param {object} filter The filter to compare documents against
     * @param {function(error, result)} callback The function to after once the operation is executed
     */
    get: (multipleDocs, filter, callback) => {
        if (typeof multipleDocs !== "boolean") {
            callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
            return
        }

        get("messages", multipleDocs, filter, callback)
    },
    /**
     * Updates a message document(s) in the database
     * 
     * Valid update fields: "content"
     * 
     * @param {boolean} multipleDocs Specifies if multiple documents should be updated
     * @param {object} filter The filter to compare documents against
     * @param {object} data The updated fields
     * @param {function(error, result)} callback The function to call after the operation is executed
     */
    update: (multipleDocs, filter, data, callback) => {
        if (typeof multipleDocs !== "boolean") {
            callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
            return
        }

        // enforcing a data structure
        const validKeys = [{name: "content", dataType: "string"}]
        const dataFormat = {}

        for (let i = 0; i < validKeys.length; i++) {
            let key = validKeys[i]
            if (data.hasOwnProperty(key.name)) {
                if (typeof data[key.name] !== key.dataType) {
                    callback(new Error(`Value of key: 'message.${key.name}' must be of type: '${key.dataType}'`), null)
                    return
                }

                dataFormat[key.name] = data[key.name]
            }
        }

        update("messages", multipleDocs, filter, dataFormat, callback)
    },
    /**
     * Removes a user document(s) from the database
     * 
     * Availabe fields: "id", "user_id", "timestamp", "content"
     * 
     * @param {boolean} multipleDocs Specifies if multiple documents should be removed
     * @param {object} filter The filter to compare documents against
     * @param {function(error, result)} callback The function to call after the operation is executed
     */
    remove: (multipleDocs, filter, callback) => {
        if (typeof multipleDocs !== "boolean") {
            callback(new Error("Parameter 'multipleDocs' must be of type: 'boolean'"), null)
            return
        }

        remove("messages", multipleDocs, filter, callback)
    }
}

module.exports = {
    chatRooms,
    users,
    messages
}