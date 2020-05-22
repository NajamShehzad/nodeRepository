const axios = require('axios');
const path = require('path');
const sha = require('sha-256');
const shortId = require('shortid')
const argv = require('yargs').argv;
console.log(argv);

const keyFileName = "./secretKey.txt";
const { existsSync, readFileSync, writeFileSync } = require("fs");
existsSync(path.join(__dirname, keyFileName)) || writeFileSync(keyFileName, "");
let data = readFileSync(keyFileName, "utf8");

if (!data) {
    const hashKey = sha.hash(shortId.generate())
    writeFileSync(keyFileName, hashKey);
    data = hashKey
}
if (argv._.length > 1) {
    console.log("Please provide one argument only");
    return false
}
else if (argv._.includes('push')) {
    pushData();
}
else if (argv._.includes('pull')) {
    pullData();
} 
else if (argv._.includes('delete')) {
    deleteData();
}
else {
    console.error("Please provide atleast one argument");
    return false
}


function pushData() {
    const resourcePath = path.join(__dirname, `./`)
    axios.post("http://localhost:5000/push", { resourcePath, key: data }).then(data => {
        console.log(data.data);
    }).catch(err => {
        console.log(err);
    });
}
function pullData() {
    const resourcePath = path.join(__dirname, `./`)
    axios.post("http://localhost:5000/pull", { resourcePath, key: data }).then(data => {
        console.log(data.data);
    }).catch(err => {
        console.log(err);
    });
}

function deleteData() {
    const resourcePath = path.join(__dirname, `./`)
    axios.post("http://localhost:5000/delete", { resourcePath, key: data }).then(data => {
        console.log(data.data);
    }).catch(err => {
        console.log(err);
    });
}
