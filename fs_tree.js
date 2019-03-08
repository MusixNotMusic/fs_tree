const fs = require('fs');
const process = require('process');
const path = require('path');
const chalk = require('chalk');
const argv0 = process.argv[0];
const argv1 = process.argv[1];
const argv2 = process.argv[2];
let excludeDir = ['node_modules', 'build', 'fonts'];
let lastList = [];

function exclude(dir) {
    return !excludeDir.some((word) => { return word == dir })
}

function getPath(myPath) {
    if (path.isAbsolute(myPath)) {
        return myPath;
    } else {
        return path.resolve(__dirname, myPath);
    }
}

// function formatTreeSymbol(deep, last, plast) {
//     // console.log('deep --->', deep, lastList.length);
//     let sign = last ? "`--" : "|--";
//     if (deep == 0) {
//         return sign;
//     }
//     let prefix = (plast && deep > 2) ? `${new Array(deep - 2).fill('|\t').join('')}\t` : `${new Array(deep - 1).fill('|\t').join('')}`;
//     return prefix + sign;
// }

function formatTreeSymbol(deep, last, plast) {
    // let sign = last ? "`--" : "|--";
    // console.log('deep --->', deep, lastList.length);
    let formatStr = '';
    let _lastList = lastList.concat(last)
    for (let i = 1; i < _lastList.length; i++) {
        let isLast = _lastList[i];
        if (i < _lastList.length - 1) {
            formatStr += isLast ? "\t" : "|\t";
        } else {
            formatStr += isLast ? "`--" : "|--";
        }
    }
    // console.log('lastList ==>', lastList);
    return formatStr;
}


function syncFile(absolutePath, fileName, deep, last, plast) {
    let filePath = absolutePath + '/' + fileName;
    filePath = filePath.replace(/\/\//g, '\/').replace(/\s+/g, '\\ ');
    let _stateObj = syncFileType(fileName, filePath);
    let stat = _stateObj.stat;
    console.log(formatTreeSymbol(deep, last, plast), _stateObj.sign);
    if (stat && stat.isDirectory() && exclude(fileName)) {
        deep++;
        lastList.push(last);
        let _files = fs.readdirSync(filePath, 'utf8');
        _files.forEach((fd_name, index, arr) => {
            // console.log('index, arr', index, arr.length, index == (arr.length - 1));
            let _last = index == (arr.length - 1);
            return syncFile(filePath, fd_name, deep, _last, last);
        })
        lastList.pop(last);
        return deep--;
    }
}


// function syncFile(absolutePath, fileName, deep, last, plast) {
//     let filePath = absolutePath + '/' + fileName;
//     filePath = filePath.replace(/\/\//g, '\/').replace(/\s+/g, '\\ ');
//     let _stateObj = syncFileType(fileName, filePath);
//     let stat = _stateObj.stat;
//     console.log(formatTreeSymbol(deep, last, plast), _stateObj.sign);
//     if (stat && stat.isDirectory() && exclude(fileName)) {
//         deep++;
//         let _files = fs.readdirSync(filePath, 'utf8');
//         _files.forEach((fd_name, index, arr) => {
//             // console.log('index, arr', index, arr.length, index == (arr.length - 1));
//             let _last = index == (arr.length - 1);
//             return syncFile(filePath, fd_name, deep, _last, last);
//         })
//         return deep--;
//     }
// }


function syncFileType(fileName, filePath) {
    let stat, sign;
    try {
        stat = fs.statSync(filePath);
    } catch (e) {
        try {
            stat = fs.lstatSync(filePath);
        } catch (e) {
            try {
                let fd = fs.openSync(filePath, 'rs+');
                stat = fs.fstatSync(fd);
            } catch (e) {
                return { sign: chalk.hex('#900')(fileName + '  #bad file descriptor'), stat };
            }
        }
    }

    if (stat.isFIFO()) {
        sign = chalk.keyword('pink')(fileName + ' [FIFO]');
    } else if (stat.isBlockDevice()) {
        sign = chalk.keyword('orange')(fileName + ' [BD]');
    } else if (stat.isFile()) {
        sign = chalk.hex('#008080')(fileName + ' [F]');
    } else if (stat.isDirectory()) {
        sign = chalk.hex('#606aa1')(fileName + '/');
    } else if (stat.isSymbolicLink()) {
        sign = chalk.yellow(fileName + ' [S]');
    } else if (stat.isSocket()) {
        sign = chalk.keyword('purple')(fileName + ' [Socket]');
    } else if (stat.isCharacterDevice()) {
        sign = chalk.keyword('steelblue')(fileName + ' [C]');
    }
    return { stat: stat, sign: sign }

}
let _path = getPath(argv2);
syncFile(_path, '', 0, false);
