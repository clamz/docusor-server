"use strict"

const config = require('../../config.user')
const { findFilesInDir, arrangeIntoTree } = require('../utils/filesUtils')

module.exports = class NavigationManager {
    getNavigationTree() {
        const files = findFilesInDir(config.path, '.md', config.path)
        return arrangeIntoTree(files)
    }
}
