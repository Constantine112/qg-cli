var co = require('co');
var prompt = require('co-prompt');
var chalk = require('chalk');
const exec = require('child_process').exec;
var fs = require('fs');
var jsonfile = require('jsonfile');
var path = require('path');
var stat = fs.statSync;

