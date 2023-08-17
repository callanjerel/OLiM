const files = require('./files')

const config = {
    id_tracking: {
        chat_rooms: 1,
        users: 1,
        messages: 1
    },
    caching: {
        chat_rooms: {
            source_update_type: "instant"
        },
        users: {
            source_update_type: "instant",
        },
        messages: {
            source_update_type: "cycle",
            source_update_interval: 5000
        }
    }
}

const loadConfig = () => {
    let configFile = files.readJSON("./datahandler/config.json")

    if (configFile.error) {
        if (configFile.error.message != "File does not exist") {
            console.log(configFile.error)
        }

        saveConfig()
    } else {
        config = configFile.data
    }
}

const saveConfig = () => {
    let writeError = files.writeJSON("./datahandler/config.json", config)
    if (writeError) {
        console.log(writeError)
    }
}

module.exports = {
    config,
    loadConfig
}