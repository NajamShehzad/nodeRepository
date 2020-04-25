var path = require('path');
var copydir = require('copy-dir');
const { existsSync, mkdirSync } = require("fs");
var express = require('express');
var app = express();
const filesToIgnore = ['client.js', 'package.json', 'package-lock.json', 'secretKey.txt'];
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
existsSync(path.join(__dirname, "./backupFolder")) || mkdirSync(path.join(__dirname, "./backupFolder"));
const targetPath = path.join(__dirname, `./backupFolder`)
console.log({ targetPath });

app.post('/push', async (req, res) => {
    const { resourcePath, key } = req.body;
    console.log(req.body);
    const { success, message } = await saveData(resourcePath, targetPath + "/" + key)
    return res.send({ success, message })

});

app.post('/pull', async (req, res) => {
    const { resourcePath, key } = req.body;
    console.log(req.body);
    const { success, message } = await returnData(targetPath + "/" + key, resourcePath)
    return res.send({ success, message })
})



app.listen(5000, (data) => {
    console.log("Server Listening on port 5000");
})
async function saveData(resource, target) {
    try {
        copydir.sync(resource, target, {
            utimes: true,
            mode: true,
            cover: true,
            filter: (stat, filepath, filename) => {
                if (filepath.includes("node_modules")) {
                    return false
                }
                const fileName = filepath.slice(filepath.lastIndexOf('\\') + 1, filepath.length);
                console.log({ check: filesToIgnore.includes(fileName) });

                if (filesToIgnore.includes(fileName)) {
                    return false
                }
                return true
            }
        }, (err) => {
            console.log("Some Error", err);
            return { success: true, message: "Operation completed" }
        });
        return { success: true, message: "Operation completed" }
    } catch (err) {
        console.log("Check error saveData", err.message, "\n");
        return { success: false, message: err.message }
    }
}
async function returnData(resource, targetPath) {
    try {
        copydir.sync(resource, targetPath, {
            utimes: true,
            mode: true,
            cover: true,
        }, (err) => {
            console.log("Some Error", err);
        });
        return { success: true, message: "Operation completed" }
    } catch (err) {
        console.log("Check error saveData", err.message);
        if (err.message.includes("no such file or directory")) {
            return { success: false, message: "No backup found please check your provided key"}
        }
        return { success: false, message: err.message }
    }
}