const fs = require('fs')

const readJSON = (path) => {
    try {
        if (!fs.existsSync(path)) {
            return {
                error: new Error("File does not exist"),
                data: null
            }
        }
        let data = fs.readFileSync(path)
        return {
            error: null,
            data: JSON.parse(data)
        }
    } catch (err) {
        return {
            error: err,
            data: null
        }
    }
}

const writeJSON = (path, content) => {
    try {
        let data = JSON.stringify(content);
        fs.writeFileSync(path, data);
        return null
    } catch (err) {
        return err
    }
}

const remove = (path) => {
    try {
        fs.unlinkSync(path);
        return null
    } catch (err) {
        return err
    }
}

module.exports = {
    readJSON,
    writeJSON,
    remove
}