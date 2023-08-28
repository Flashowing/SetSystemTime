// main.js
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = require('electron');
const path = require('path');
const {
    exec
} = require('child_process');
const sudo = require('sudo-prompt');

const NODE_ENV = process.env.NODE_ENV

function createWindow() {
    const win = new BrowserWindow({
        width: 300,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
    // 关闭菜单
    Menu.setApplicationMenu(null);
    // 打开开发工具
    if (NODE_ENV === "development") {
        win.webContents.openDevTools();
    }
}


function executeCommand(command) {
    return new Promise((resolve, reject) => {
        sudo.exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
            }
            resolve(stdout);
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    });
}

function startTimeService() {
    const command = 'net start w32time';
    return executeCommand(command);
}

app.whenReady().then(() => {
    ipcMain.handle('set-time', async (event, time) => {
        try {
            let command;
            if (time === 'now') {
                command = 'w32tm /resync';
            } else {
                command = `date ${time}`;
            }
            return await executeCommand(command);
        } catch (error) {
            if (time === 'now') {
                try {
                    await startTimeService();
                    return await executeCommand('w32tm /resync');
                } catch (e) {
                    throw e;
                }
            } else {
                throw error;
            }
        }
    });

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
