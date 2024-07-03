import {app, BrowserWindow} from "electron";

app.on("ready", () => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadURL("http://localhost:5173");
})
