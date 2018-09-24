var path = require('path'), 
    fs   = require('fs'),
    _ = require('lodash');


function arrangePathIntoTree(tree, path) {
    const pathParts = path.split('/');
    //pathParts.shift(); // Remove first blank element from the parts array.

    let currentLevel = tree; // initialize currentLevel to root
    let currentPath = ''
    pathParts.forEach(part => {

        currentPath = (currentPath) ? `${currentPath}/${part}` : part

        // check to see if the path already exists.
        var existingPath = _.find(currentLevel, {
            name: part,
        });

        if (existingPath) {
            // The path to this item was already in the tree, so don't add it again.
            // Set the current level to this path's children
            currentLevel = existingPath.children;
        } else {
            var newPart = {
                name: part.replace('.md', ''),
                path: currentPath,
                children: [],
            }

            currentLevel.push(newPart);
            currentLevel = newPart.children;
        }
    });
}


function arrangeIntoTree(paths, cb) {
    var tree = [];

    // This example uses the underscore.js library.
    paths.forEach(path => {
        arrangePathIntoTree(tree, path)
        
    });

    return tree
}

/**
 * Find all files recursively in specific folder with specific extension, e.g:
 * findFilesInDir('./project/src', '.html') ==> ['./project/src/a.html','./project/src/build/index.html']
 * @param  {String} startPath    Path relative to this file or other file which requires this files
 * @param  {String} filter       Extension name, e.g: '.html'
 * @return {Array}               Result files with path string in an array
 */
function findFilesInDir(startPath,filter, rootPath, output){
    output = output || []
    var results = [];

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        const file = files[i]
       // console.log(file)
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            results = results.concat(findFilesInDir(filename,filter, rootPath)); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            //console.log('-- found: ',filename, startPath, '----', filename.replace(rootPath, ''));
            filename = filename.replace(rootPath, '')
           
            let tree = []

            results.push(filename.replace(/\\/g, '/'));
        }
    }
    return results;
}
module.exports.findFilesInDir = findFilesInDir;

module.exports.arrangeIntoTree = arrangeIntoTree