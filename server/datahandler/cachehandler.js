const chatRoomsCache = []
const usersCache = []
const messagesCache = []

const filterCache = (cacheName, filter) => {
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
            return null
    }

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

    let data = filterCache(cacheName, filter)
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

// TODO: add update logic
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

    let data = filterCache(cacheName, filter)
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
    update: () => {

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
    update: () => {

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
    update: () => {

    },
    remove: (multipleDocs, filter, callback) => {
        remove("chat_rooms", multipleDocs, filter, callback)
    }
}

module.exports = {
    chatRooms,
    users,
    messages
}