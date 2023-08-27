const db = require('./databasehandler')
const cache = require('./cachehandler')

const create = (collectionName, multipleDocs, data, callback) => {
    let dbCollection
    let cacheCollection
    switch (collectionName) {
        case "chat_rooms":
            dbCollection = db.chatRooms
            cacheCollection = cache.chatRooms
            break;
        case "users":
            dbCollection = db.users
            cacheCollection = cache.users
            break;
        case "messages":
            dbCollection = db.messages
            cacheCollection = cache.messages
            break;
        default:
            callback(new Error("Invalid collection name"), null)
            return
    }

    dbCollection.create(multipleDocs, data, (dbErr, dbRes) => {
        if (dbErr) {
            callback(dbErr, dbRes)
            return
        }

        cacheCollection.put(multipleDocs, data, (cacheErr, cacheRes) => {
            if (cacheErr) {
                callback(cacheErr, cacheRes)
                return
            }

            callback(dbErr, dbRes)
        })
    })
}

const get = (collectionName, multipleDocs, filter, callback) => {
    let dbCollection
    let cacheCollection
    switch (collectionName) {
        case "chat_rooms":
            dbCollection = db.chatRooms
            cacheCollection = cache.chatRooms
            break;
        case "users":
            dbCollection = db.users
            cacheCollection = cache.users
            break;
        case "messages":
            dbCollection = db.messages
            cacheCollection = cache.messages
            break;
        default:
            callback(new Error("Invalid collection name"), null)
            return
    }

    cacheCollection.get(multipleDocs, filter, (cacheErr, cacheRes) => {
        if (cacheErr) {
            callback(cacheErr, cacheRes)
            return
        }

        if (typeof cacheRes === "undefined" || cacheRes.length === 0) {
            dbCollection.get(multipleDocs, filter, (dbErr, dbRes) => {
                if (dbErr) {
                    callback(dbErr, dbRes)
                    return
                }

                if (typeof dbRes !== "undefined" || dbRes.length > 0) {
                    cacheCollection.put(multipleDocs, dbRes, (err, res) => {
                        console.log("An error occurred while caching a document:\n", dbRes)
                        console.log(err)
                    })
                }
                callback(dbErr, dbRes)
            })
        }

        callback(cacheErr, cacheRes)
    })
}

const update = (collectionName, multipleDocs, filter, data, callback) => {
    let dbCollection
    let cacheCollection
    switch (collectionName) {
        case "chat_rooms":
            dbCollection = db.chatRooms
            cacheCollection = cache.chatRooms
            break;
        case "users":
            dbCollection = db.users
            cacheCollection = cache.users
            break;
        case "messages":
            dbCollection = db.messages
            cacheCollection = cache.messages
            break;
        default:
            callback(new Error("Invalid collection name"), null)
            return
    }

    dbCollection.get(multipleDocs, filter, (checkErr, checkRes) => {
        if (checkErr) {
            callback(checkErr, null)
            return
        }

        if (typeof checkRes === "undefined" || checkRes.length === 0) {
            cacheCollection.update(multipleDocs, filter, data, callback)
            return
        }

        dbCollection.update(multipleDocs, filter, data, (dbErr, dbRes) => {
            if (dbErr) {
                callback(dbErr, dbRes)
                return
            }

            cacheCollection.update(multipleDocs, filter, data, callback)
        })
    })
}

const remove = (collectionName, multipleDocs, filter, callback) => {
    let dbCollection
    let cacheCollection
    switch (collectionName) {
        case "chat_rooms":
            dbCollection = db.chatRooms
            cacheCollection = cache.chatRooms
            break;
        case "users":
            dbCollection = db.users
            cacheCollection = cache.users
            break;
        case "messages":
            dbCollection = db.messages
            cacheCollection = cache.messages
            break;
        default:
            callback(new Error("Invalid collection name"), null)
            return
    }

    dbCollection.remove(multipleDocs, filter, (dbErr, dbRes) => {
        if (dbErr) {
            callback(dbErr, dbRes)
            return
        }

        cacheCollection.remove(multipleDocs, filter, (cacheErr, cacheRes) => {
            if (cacheErr) {
                callback(cacheErr, cacheRes)
                return
            }

            callback(dbErr, dbRes)
        })
    })
}

const chatRooms = {
    nextId: db.chatRooms.nextId,
    create: (multipleDocs, data, callback) => {
        create("chat_rooms", multipleDocs, data, callback)
    },
    get: (multipleDocs, filter, callback) => {
        get("chat_rooms", multipleDocs, filter, callback)
    },
    update: (multipleDocs, filter, data, callback) => {
        update("chat_rooms", multipleDocs, filter, data, callback)
    },
    remove: (multipleDocs, filter, callback) => {
        remove("chat_rooms", multipleDocs, filter, callback)
    }
}

const users = {
    nextId: db.users.nextId,
    create: (multipleDocs, data, callback) => {
        create("users", multipleDocs, data, callback)
    },
    get: (multipleDocs, filter, callback) => {
        get("users", multipleDocs, filter, callback)
    },
    update: (multipleDocs, filter, data, callback) => {
        update("users", multipleDocs, filter, data, callback)
    },
    remove: (multipleDocs, filter, callback) => {
        remove("users", multipleDocs, filter, callback)
    }
}

const messages = {
    nextId: db.messages.nextId,
    create: (multipleDocs, data, callback) => {
        create("messages", multipleDocs, data, callback)
    },
    get: (multipleDocs, filter, callback) => {
        get("messages", multipleDocs, filter, callback)
    },
    update: (multipleDocs, filter, data, callback) => {
        update("messages", multipleDocs, filter, data, callback)
    },
    remove: (multipleDocs, filter, callback) => {
        remove("messages", multipleDocs, filter, callback)
    }
}

module.exports = {
    chatRooms,
    users,
    messages,
    lastId: db.lastId,
    init: db.init,
    sortByField: db.sortByField
}