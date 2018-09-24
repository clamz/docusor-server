"use strict"
const restify = require('restify');
const { navigationManager } = require('./di');
const config = require('./config.user');
const showdown  = require('showdown');
const htmlencode = require('htmlencode');

const fs = require('fs');

const express = require('express');
const converter = new showdown.Converter()

function respond(req, res, next) {
	res.send('hello ' + req.params.name);
	next();
}

function respond2(req, res, next) {
	res.send('home');
	next();
}

//var server = restify.createServer();
const server = express();
// server.pre(restify.plugins.pre.userAgentConnection());


server.get('/', respond2);

server.get('/navigation', function(req, res, next) {
	const tree = navigationManager.getNavigationTree()
	res.send(tree);
	next();
});

server.get('/doc/*', function(req, res, next) {
	const filePath = req.params[0]
	const rootPath = config.path
	var contents = fs.readFileSync(`${rootPath}/${filePath}`, 'utf8');
	res.set('Content-Type', 'text/html');
	const html      = converter.makeHtml(contents);
	res.send(html);
	next();
});

server.listen(3010, function () {
	console.log('%s listening at %s', server.name, server.url);
});