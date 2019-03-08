const fs = require('fs');
const process = require('process');
const path = require('path');
const chalk = require('chalk');
const argv0 = process.argv[0];
const argv1 = process.argv[1];
const argv2 = process.argv[2];
let excludeDir = ['node_modules', 'build', 'fonts'];

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

function formatTreeSymbol(deep) {
    return deep > 0 ? new Array(deep - 1).fill('\t').join('') + '|---' : '|---';
}


function syncFile(absolutePath, fileName, deep) {
    let filePath = absolutePath + '/' + fileName;
    filePath = filePath.replace(/\/\//g, '\/').replace(/\s+/g, '\\ ');
    let _stateObj = syncFileType(fileName, filePath)
    let stat = _stateObj.stat;
    console.log(formatTreeSymbol(deep), _stateObj.sign);
    if (stat && stat.isDirectory() && exclude(fileName)) {
        deep++;
        let _files = fs.readdirSync(filePath, 'utf8');
        _files.forEach((fd_name) => {
            return syncFile(filePath, fd_name, deep);
        })
        return deep--;
    }
}

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
syncFile(_path, '', 0);