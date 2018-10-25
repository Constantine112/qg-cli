var co = require('co');
var prompt = require('co-prompt');
var chalk = require('chalk');
const exec = require('child_process').exec;
var fs = require('fs');
var jsonfile = require('jsonfile');
var path = require('path');
var stat = fs.statSync;

var defaultConf = {
    name: process.env.PWD.split("/").pop(),
    version: "1.0.0",
    description: "",
    author: "",
    private: true,
    main: "index.js",
    directories: {
        "test": "test"
    },
    dependencies: {
        "axios": "^0.18.0",
        "babel-polyfill": "^6.26.0",
        "iview": "^2.14.3",
        "vue": "^2.5.2",
        "vue-router": "^3.0.1",
        "vuex": "^3.0.1"
    },
    devDependencies: {
        "autoprefixer": "^7.1.2",
        "babel-core": "^6.22.1",
        "babel-eslint": "^8.2.1",
        "babel-helper-vue-jsx-merge-props": "^2.0.3",
        "babel-loader": "^7.1.1",
        "babel-plugin-istanbul": "^4.1.1",
        "babel-plugin-syntax-jsx": "^6.18.0",
        "babel-plugin-transform-runtime": "^6.22.0",
        "babel-plugin-transform-vue-jsx": "^3.5.0",
        "babel-preset-env": "^1.3.2",
        "babel-preset-stage-2": "^6.22.0",
        "babel-register": "^6.22.0",
        "chai": "^4.1.2",
        "chalk": "^2.0.1",
        "chromedriver": "^2.27.2",
        "copy-webpack-plugin": "^4.0.1",
        "cross-env": "^5.0.1",
        "cross-spawn": "^5.0.1",
        "css-loader": "^0.28.0",
        "eslint": "^4.15.0",
        "eslint-config-standard": "^10.2.1",
        "eslint-friendly-formatter": "^3.0.0",
        "eslint-loader": "^1.7.1",
        "eslint-plugin-import": "^2.7.0",
        "eslint-plugin-node": "^5.2.0",
        "eslint-plugin-promise": "^3.4.0",
        "eslint-plugin-standard": "^3.0.1",
        "eslint-plugin-vue": "^4.0.0",
        "extract-text-webpack-plugin": "^3.0.0",
        "file-loader": "^1.1.4",
        "friendly-errors-webpack-plugin": "^1.6.1",
        "html-webpack-plugin": "^2.30.1",
        "inject-loader": "^3.0.0",
        "karma": "^1.4.1",
        "karma-coverage": "^1.1.1",
        "karma-mocha": "^1.3.0",
        "karma-phantomjs-launcher": "^1.0.2",
        "karma-phantomjs-shim": "^1.4.0",
        "karma-sinon-chai": "^1.3.1",
        "karma-sourcemap-loader": "^0.3.7",
        "karma-spec-reporter": "0.0.31",
        "karma-webpack": "^2.0.2",
        "mocha": "^3.2.0",
        "nightwatch": "^0.9.12",
        "node-notifier": "^5.1.2",
        "optimize-css-assets-webpack-plugin": "^3.2.0",
        "ora": "^1.2.0",
        "phantomjs-prebuilt": "^2.1.14",
        "portfinder": "^1.0.13",
        "postcss-import": "^11.0.0",
        "postcss-loader": "^2.0.8",
        "postcss-url": "^7.2.1",
        "rimraf": "^2.6.0",
        "selenium-server": "^3.0.1",
        "semver": "^5.3.0",
        "shelljs": "^0.7.6",
        "sinon": "^4.0.0",
        "sinon-chai": "^2.8.0",
        "uglifyjs-webpack-plugin": "^1.1.1",
        "url-loader": "^0.5.8",
        "vue-loader": "^13.3.0",
        "vue-style-loader": "^3.0.1",
        "vue-template-compiler": "^2.5.2",
        "webpack": "^3.6.0",
        "webpack-bundle-analyzer": "^2.9.0",
        "webpack-dev-server": "^2.9.1",
        "webpack-merge": "^4.1.0"
    },
    scripts: {
        "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
        "start": "npm run dev",
        "unit": "cross-env BABEL_ENV=test karma start test/unit/karma.conf.js --single-run",
        "e2e": "node test/e2e/runner.js",
        "test": "echo \"Error: no test specified\" && exit 1",
        "lint": "eslint --ext .js,.vue src test/unit test/e2e/specs",
        "build": "node build/build.js"
    },
    license: "ISC",
    engines: {
        "node": ">= 6.0.0",
        "npm": ">= 3.0.0"
    },
    browserslist: [
        "> 1%",
        "last 2 versions",
        "not ie <= 8"
    ]
}

/**
 * 
 * @param {object} params {这个对象用于存放init的时候的用户输入的信息} 
 * 
 */
function createVue(params) {
    let cmdStr = 'git clone git@github.com:Constantine112/templates.git'
    // 生成模板
    var result = fileTemplate(params);
    console.log(chalk.white('\n Start generating...'))
 
    //执行克隆命令，从仓库拉一个vue-cli多页面开发的模板下来
    exec(cmdStr, (error, stdout, stderr) => {
        if (error) {
            console.log(error)
            process.exit(0)
        }
        //克隆成功
        console.log(chalk.green('\n √ Generation completed!'))
        // console.log(`\n cd ${projectName} && npm install \n`)

        //获取需要将模板复制进去的项目文件夹
        var copyName = params.name ? params.name : 'my-project'
        createFolder('./' + copyName)
        var files = [{
            position: './' + copyName + '/.gitignore',
            context: '.DS_Store\nnode_modules/\n/dist/\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n/test/unit/coverage/\n/test/e2e/reports/\nselenium-debug.log\n\n# Editor directories and files\n.idea\n.vscode\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n'
        }]
        // console.log(copyName)
        exists('./templates', ('./' + (params.name ? params.name : 'my-project')),  copy)

        //复制成功后
        console.log('复制完成')

        //创建json文件
        jsonfile.writeFileSync("./" + (params.name ? params.name : 'my-project') + "/package.json", result, {spaces: 2});

        let str = '# ' + (params.name ? params.name : 'my-project') + '\n> ' + params.description + '\n## Build Setup\n``` bash\n# install dependencies\nnpm install\n\n# serve with hot reload at localhost:8080\nnpm run dev\n\n# build for production with minification\nnpm run build\n\n# build for production and view the bundle analyzer report\nnpm run build --report\n\n# run unit tests\nnpm run unit\n\n# run e2e tests\nnpm run e2e\n\n# run all tests\nnpm test\n```\n\nFor a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).'

        //创建剩余的文件
        fs.writeFileSync('./' + copyName + '/README.md', str,  function(err) {
            if (err) {
                return console.error(err);
            }
        })

        for (let i = 0, len = files.length; i < len; i++) {
            fs.writeFileSync(files[i].position, files[i].context)
            console.log('创建 ' + files[i].position + ' 成功')
        }

        // 将多余的文件删除
        exec('rm -rf ' + (params.name ? params.name : 'my-project') + '/.git', (err) => {
            if (error) {
                console.log(error)
                process.exit(0)
            }
            exec('rm -rf templates', (err) => {
                if (error) {
                    console.log(error)
                    process.exit(0)
                }
                
                //删除成功后建立本地仓库并结束所有进程
                exec('cd ' + (params.name ? params.name : 'my-project') + ' && git init', (err) => {
                    if (error) {
                        console.log(error)
                        process.exit(0)
                    }

                     //退出程序
                    process.exit(0)
                })
            })
        })

       
        
    })
}

/**
 * fileTemplate 用于合并对象模板创建package.json
 * @param {object} params {这个对象用于存放init的时候的用户输入的信息} 
 * 
 */
function fileTemplate(params) {
    return Object.assign(defaultConf, params);
}

/**
 * 创建文件函数
 * @param {string} to {用于标注文件需要创建的位置} 
 */
function createFile (to) { //文件写入
    fs.readFileSync(to);
};

/**
 * @description 用于创建文件夹
 *  
 * @param {string} position {用于标注文件夹需要创建的位置}
 */
function createFolder (position)  {
    fs.mkdirSync(position);
};

/**
 * @description 删除文件夹和删除文件夹下的全部文件
 * 
 * @param {string} path {用于标注文件夹需要创建的位置}
 */
function deleteall(path) {
    var files = [];

    if (fs.existsSync(path)) {
        //该文件夹存在
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteall(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

/**
 * @description 用于复制文件夹
 * 
 * @param {string} src  用于复制的目标文件夹
 * @param {string} dst  用于写入的文件夹路径
 */
function copy (src, dst) {
    function copyF (err, paths) { 
        console.log('复制中')
        // console.log(paths)
        if(err){
            throw err;
        }
        
        //循环判断路径
        paths.forEach( function (path) {
            var _src = src+'/'+path;
            var _dst = dst+'/'+path;
            var readable;
            var writable;
            // stat(_src);
            function cpyF (err, st) {
                if (err) {
                    throw err;
                }
                
                if (st.isFile()) {

                    readable = fs.createReadStream(_src);//创建读取流
                    writable = fs.createWriteStream(_dst);//创建写入流
                    readable.pipe(writable);

                }else if (st.isDirectory()) {

                    exists(_src, _dst, copy);

                }
            }
            cpyF(null ,stat(_src))
        });
    }
    copyF(null ,fs.readdirSync(src))
}
/**
 * @description 用于判断两个文件夹是否存在
 * 
 * @param {*} src {用于复制的目标文件夹}
 * @param {*} dst {用于写入的文件夹路径}
 * @param {*} callback {回调函数}
 */
function exists (src, dst, callback) {
    //测试某个路径下文件是否存在
    console.log('复制中')
    function findFolder (exists) {
        if (exists) {//不存在
            callback(src, dst);
        } else {//存在
            fs.mkdirSync(dst)
            callback(src, dst)
        }
    }
    findFolder(fs.existsSync(dst))
}

module.exports = () => {
    co(function*() {
        var params = {};
        // params.name = yield prompt('name: (' +  process.env.PWD.split("/").pop() +')');
        params.name = yield prompt('name: (my-project)');
        params.version = yield prompt('version: (1.0.0)');
        params.description = yield prompt('description: ');
        params.repository = yield prompt('git repository: ');
        params.keywords = yield prompt('keywords: ');
        params.author = yield prompt('author: ');
        params.license = yield prompt('license: (ISC)');


        // 是否同意
        var agree = yield prompt('Is this ok? (yes)');
        if (agree != "no") {
            createVue(params)
        }

        // debagger();
        // process.exit(0);
    });
}