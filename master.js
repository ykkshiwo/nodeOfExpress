var cluster = require('cluster');

cluster.setupMaster({
    exec: "session_mongodb.js"
});

var cpus = require('os').cpus();
for (var i=0; i<cpus.length; i++){
    cluster.fork();
}