import {app, BrowserWindow} from "electron";

app.on("ready", () => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadURL("http://localhost:5173");
})
