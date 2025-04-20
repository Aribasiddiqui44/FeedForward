// configuring the server with third party middlewares
// const express = require('express');
// const cors = require('cors'); //CORS: Cross-origin Resource Sharing
// const cookieParser = require('cookie-parser'); /// middleware for parsing cookies.

// ES6 exports
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

//Cogifuring
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})); // configuring cors middleware
app.use(express.json({limit: "16kb"})) // for working with request body.
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser()) // for working with cookies.

export {app}