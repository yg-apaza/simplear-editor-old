const electron = require("electron");
var ipcMain = electron.ipcMain;
var net = require('net');
var JsonSocket = require('json-socket');

//  Events consumed by IPC Main and emitted by local socket
var WAITING_VIEWER = 'waiting_viewer';
var PROJECT_OPENED = 'project_opened';
var PROJECT_CLOSED = 'project_closed';
var INTERACTIONS_APPROVED = 'interactions_approved';
var INTERACTIONS_REJECTED = 'interactions_rejected';
var RESOURCE_CREATED = 'resource_created';
var RESOURCE_DELETED = 'resource_deleted';
var RESOURCE_RENAMED = 'resource_renamed';

// Events emitted by IPC Main and consumed by local socket
var VIEWER_READY = 'viewer_ready';
var FRAMEWORK_READY = 'framework_ready';

function setupServerSocket(mainWindow) {
    if(mainWindow){
        var port = 9838;
        var server = net.createServer();
        server.listen(port);

        server.once('connection', function(socket) {
            socket = new JsonSocket(socket);
            ipcMain.on(WAITING_VIEWER, (event, arg) => {  
                console.log(`>> ${WAITING_VIEWER}`);
                console.log(JSON.stringify(arg));
                socket.sendMessage({ _type: WAITING_VIEWER, ...arg});
                //event.sender.send(VIEWER_READY, {});
            });

            ipcMain.on(PROJECT_OPENED, (event, arg) => {  
                console.log(`>> ${PROJECT_OPENED}`);
                console.log(JSON.stringify(arg));
                socket.sendMessage({ _type: PROJECT_OPENED, ...arg});
                //event.sender.send(FRAMEWORK_READY, {});
            });

            ipcMain.on(PROJECT_CLOSED, (event, arg) => {  
                console.log(`>> ${PROJECT_CLOSED}`);
                console.log(JSON.stringify(arg));
                socket.sendMessage({ _type: PROJECT_CLOSED, ...arg});
            });

            ipcMain.on(INTERACTIONS_APPROVED, (event, arg) => {  
                console.log(`>> ${INTERACTIONS_APPROVED}`);
                console.log(JSON.stringify(arg));
                socket.sendMessage({ _type: INTERACTIONS_APPROVED, ...arg});
            });
            
            ipcMain.on(INTERACTIONS_REJECTED, (event, arg) => {  
                console.log(`>> ${INTERACTIONS_REJECTED}`);
                console.log(JSON.stringify(arg));
                socket.sendMessage({ _type: INTERACTIONS_REJECTED, ...arg});
            });
            
            ipcMain.on(RESOURCE_CREATED, (event, arg) => {  
                console.log(`>> ${RESOURCE_CREATED}`);
                console.log(JSON.stringify(arg));
                socket.sendMessage({ _type: RESOURCE_CREATED, ...arg});
            });
            
            socket.on('message', function(message) {
                switch(message._type) {
                    case VIEWER_READY:
                        console.log(`>> ${VIEWER_READY}`);
                        mainWindow.webContents.send(VIEWER_READY, {});
                        break;
                    case FRAMEWORK_READY:
                        console.log(`>> ${FRAMEWORK_READY}`);
                        mainWindow.webContents.send(FRAMEWORK_READY, {});
                        break;
                    default:
                        console.log("Operation not supported");
                }
            });
        });
    }
    else
        console.log("Browser window not created");
}


module.exports = setupServerSocket;