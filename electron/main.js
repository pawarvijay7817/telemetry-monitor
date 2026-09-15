const { app, BrowserWindow } = require("electron");

const path = require("path");

const isDev = !app.isPackaged;

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,

    minWidth: 1100,
    minHeight: 700,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),

      contextIsolation: true,

      nodeIntegration: false,
    },
  });

  if (isDev) {
    window.loadURL("http://localhost:4200");

    window.webContents.openDevTools();
  } else {
    window.loadFile(
      path.join(__dirname, "../frontend/dist/frontend/browser/index.html"),
    );
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
