const electron = require("electron");
var ipcMain = electron.ipcMain;

//  Events consumed
var WAITING_VIEWER = 'waiting_viewer';
var PROJECT_OPENED = 'project_opened';
var PROJECT_CLOSED = 'project_closed';
var INTERACTIONS_APPROVED = 'interactions_approved';
var INTERACTIONS_REJECTED = 'interactions_rejected';
var RESOURCE_CREATED = 'resource_created';
var RESOURCE_DELETED = 'resource_deleted';
var RESOURCE_RENAMED = 'resource_renamed';

// Events emitted
var VIEWER_READY = 'viewer_ready';
var FRAMEWORK_READY = 'framework_ready';

function consumeEvents(){
    ipcMain.on(WAITING_VIEWER, (event, arg) => {  
        console.log(`>> ${WAITING_VIEWER}\n${arg}`);
        event.sender.send(VIEWER_READY, {});
    });

    ipcMain.on(PROJECT_OPENED, (event, arg) => {  
        console.log(`>> ${PROJECT_OPENED}\n${arg}`);
        event.sender.send(FRAMEWORK_READY, {});
    });

    ipcMain.on(PROJECT_CLOSED, (event, arg) => {  
        console.log(`>> ${PROJECT_CLOSED}\n${arg}`);
    });

    ipcMain.on(INTERACTIONS_APPROVED, (event, arg) => {  
        console.log(`>> ${INTERACTIONS_APPROVED}\n${arg}`);
    });
    
    ipcMain.on(INTERACTIONS_REJECTED, (event, arg) => {  
        console.log(`>> ${INTERACTIONS_REJECTED}\n${arg}`);
    });
    
    ipcMain.on(RESOURCE_CREATED, (event, arg) => {  
        console.log(`>> ${RESOURCE_CREATED}\n${arg}`);
    });
}

module.exports = consumeEvents;