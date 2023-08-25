const chatRoomsCache = []
const usersCache = []
const messagesCache = []

const filterCache = (cache, filter) => {
    let result = []
    for (let i = 0; i < cache.length; i++) {
        let item = cache[i]

        let valid = true
        for (let property in filter) {
            if (!item.hasOwnProperty(property) || item[property] !== filter[property]) {
                valid = false
                break
            }
        }

        if (valid) {
            result.push(item)
        }
    }

    return result
}

const updateItem = (cacheData, updateData) => {
    let result = 0
    for (let aggregate in updateData) {
        let aggregateData = updateData[aggregate]

        if (aggregate == "$set") {
            for (let updateProp in aggregateData) {
                cacheData[updateProp] = aggregateData[updateProp]
                result = 1
            }
        } else if (aggregate == "$push") {
            for (let updateProp in aggregateData) {
                if (Array.isArray(cacheData[updateProp])) {
                    cacheData[updateProp].push(aggregateData[updateProp])
                    result = 1
                }
            }
        }
    }
    return result
}

const put = (cacheName, multipleDocs, data, callback) => {
    if (typeof cacheName !== 'string') {
        callback(new Error("Parameter: 'cacheName' must be of type: 'string'"), null)
        return
    }
    if (typeof multipleDocs !== 'boolean') {
        callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
        return
    }

    let cache
    switch (cacheName) {
        case "chat_rooms":
            cache = chatRoomsCache
            break;
        case "users":
            cache = usersCache
            break;
        case "messages":
            cache = messagesCache
            break;
        default:
            callback(new Error("Invalid cache name"), null)
            return
    }

    let initState = cache.length
    if (!multipleDocs) {
        let state = cache.push(data)
        callback(null, {
            objects_affected: state-initState
        })
        return
    }

    for (let i = 0; i < data.length; i++) {
        cache.push(data[i])
    }
    let state = cache.length
    callback(null, {
        objects_affected: state-initState
    })
}

const get = (cacheName, multipleDocs, filter, callback) => {
    if (typeof cacheName !== 'string') {
        callback(new Error("Parameter: 'cacheName' must be of type: 'string'"), null)
        return
    }
    if (typeof multipleDocs !== 'boolean') {
        callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
        return
    }

    let cache
    switch (cacheName) {
        case "chat_rooms":
            cache = chatRoomsCache
            break;
        case "users":
            cache = usersCache
            break;
        case "messages":
            cache = messagesCache
            break;
        default:
            callback(new Error("Invalid cache name"), null)
            return
    }

    let data = filterCache(cache, filter)
    if (multipleDocs) {
        callback(null, data)
        return
    }

    if (data.length > 0) {
        callback(null, data[0])
    } else {
        callback(null, [])
    }
}

const update = (cacheName, multipleDocs, filter, data, callback) => {
    if (typeof cacheName !== 'string') {
        callback(new Error("Parameter: 'cacheName' must be of type: 'string'"), null)
        return
    }
    if (typeof multipleDocs !== 'boolean') {
        callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
        return
    }

    let cache
    switch (cacheName) {
        case "chat_rooms":
            cache = chatRoomsCache
            break;
        case "users":
            cache = usersCache
            break;
        case "messages":
            cache = messagesCache
            break;
        default:
            callback(new Error("Invalid cache name"), null)
            return
    }

    let filteredData = filterCache(cache, filter)
    let result = 0
    if (filteredData.length == 0) {
        callback(null, {
            objects_affected: result
        })
        return
    }

    if (!multipleDocs) {
        result = updateItem(filteredData[0], data)
        callback(null, {
            objects_affected: result
        })
        return
    }

    for (let i = 0; i < filteredData.length-1; i++) {   // JS is modifying every object on the first iteration
        result += updateItem(filteredData[i], data)     // even though the objects were created separately
    }                                                   // using object literal (they shouldn't use the same reference)
    
    callback(null, {
        objects_affected: result
    })
}

const remove = (cacheName, multipleDocs, filter, callback) => {
    if (typeof cacheName !== 'string') {
        callback(new Error("Parameter: 'cacheName' must be of type: 'string'"), null)
        return
    }
    if (typeof multipleDocs !== 'boolean') {
        callback(new Error("Parameter: 'multipleDocs' must be of type: 'boolean'"), null)
        return
    }

    let cache
    switch (cacheName) {
        case "chat_rooms":
            cache = chatRoomsCache
            break;
        case "users":
            cache = usersCache
            break;
        case "messages":
            cache = messagesCache
            break;
        default:
            callback(new Error("Invalid cache name"), null)
            return
    }

    let data = filterCache(cache, filter)
    if (!multipleDocs) {
        let index = cache.indexOf(data[0])

        let result = []
        if (index > -1) {
            result = cache.splice(index, 1)
        }
        callback(null, {
            objects_affected: result.length
        })
        return
    }

    let resultCount = 0
    for (let i = 0; i < data.length; i++) {
        let index = cache.indexOf(data[i])

        let result = []
        if (index > -1) {
            result = cache.splice(index, 1)
        }
        resultCount += result.length
    }
    callback(null, {
        objects_affected: resultCount
    })
}

const chatRooms = {
    getSize: () => {
        return chatRoomsCache.size
    },
    put: (multipleDocs, data, callback) => {
        put("chat_rooms", multipleDocs, data, callback)
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
    getSize: () => {
        return usersCache.size
    },
    put: (multipleDocs, data, callback) => {
        put("chat_rooms", multipleDocs, data, callback)
    },
    get: (multipleDocs, filter, callback) => {
        get("chat_rooms", multipleDocs, filter, callback)
    },
    update: (multipleDocs, filter, data, callback) => {
        update("users", multipleDocs, filter, data, callback)
    },
    remove: (multipleDocs, filter, callback) => {
        remove("chat_rooms", multipleDocs, filter, callback)
    }
}

const messages = {
    getSize: () => {
        return messagesCache.size
    },
    put: (multipleDocs, data, callback) => {
        put("chat_rooms", multipleDocs, data, callback)
    },
    get: (multipleDocs, filter, callback) => {
        get("chat_rooms", multipleDocs, filter, callback)
    },
    update: (multipleDocs, filter, data, callback) => {
        update("messages", multipleDocs, filter, data, callback)
    },
    remove: (multipleDocs, filter, callback) => {
        remove("chat_rooms", multipleDocs, filter, callback)
    }
}

module.exports = {
    chatRooms,
    users,
    messages,
    chatRoomsCache,
    usersCache,
    messagesCache
}