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

 // 定义当前版本
 program
 .version(require('../package').version )

// 定义使用方法
program
    .usage('<command>')

program
    .command('initvue')
    .description('Generate multi page development about vue-cli')
    .alias('iv')
    .action(function () {
        require('./command/initvue')()
    });
program.parse(process.argv);

