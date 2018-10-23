#!/usr/bin/env node --harmony

var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var chalk = require('chalk');
const exec = require('child_process').exec;
var fs = require('fs');
var jsonfile = require('jsonfile');
var path = require('path');
var stat = fs.statSync;

/*
生成文件夹函数
 */

program
    .command('initvue')
    .description('run the given remote command')
    .action(function () {
        require('./command/initvue')()
    });
program.parse(process.argv);

