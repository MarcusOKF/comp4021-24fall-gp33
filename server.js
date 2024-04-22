const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

const { createServer } = require("http")
const { Server } = require("socket.io")

// Create the Express app
const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer)

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The chat server has started at port 8000...");
});