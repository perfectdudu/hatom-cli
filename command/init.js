'use strict'

const { exec } = require('child_process')
require('shelljs/global')
const co = require('co')
const config = require('../template')
const chalk = require('chalk')
const fs = require('fs')
const inquirer = require('inquirer')
const download = require('download-git-repo')

module.exports = () => {
    
        const tplObj = require('../template').tpl
        const tplChoices = Object.keys(tplObj).map((value, index) => {
            return {
                name: `${value} (${chalk.green(tplObj[value].description)})`,
                value: tplObj[value].url
            }
        })
        const step = [
            {
                type: 'input',
                name: 'name',
                message: '项目名称',
                default: 'test-hatom-demo'
            },
            {
                type: 'input',
                name: 'version',
                message: '版本号',
                default: '1.0.0'
            },
            {
                type: 'input',
                name: 'description',
                message: '项目描述',
                default: 'a hatom project'
            },
            {
                type: 'input',
                name: 'keyword',
                message: '关键词',
                default: 'hatom-project,hatom-cli,hatom',
            },
            {
                type: 'input',
                name: 'author',
                message: '作者',
                default: 'xxxxx',
            },
            {
                type: 'list',
                name: 'model',
                message: '请选择模板文件',
                choices: tplChoices
            }
        ];
        inquirer.prompt(step).then(answer => {

            new Promise((resolve, reject) => {
                console.log('🗃 模板正在下载中...');
                exec(`git clone ${answer.model} ${answer.name}`, (error, stdout, stderr) => {
                    if (error) {
                        reject(new Error(error));
                    }
                    resolve();
                })
            }).then(res => {
                console.log(`${chalk.green('🎉  模板初始化成功')}`)
                cd(answer.name)
                fs.readFile('./package.json', 'utf-8', (err, data) => {
                    if (err) {
                        console.log(`${chalk.red(err)}`)
                    } else {
                        var data = JSON.parse(data)
                        data = Object.assign(data, answer)
                        var t = JSON.stringify(data, null, 4);
                        fs.writeFileSync('./package.json', t)
                        console.log(chalk.green(`
─────────────────────────────────────────────────────────────────────────
########################################################################

🎉    🎉    🎉     ${answer.name} 构建成功 Enjoy it           🎉    🎉    🎉                     
                         
########################################################################
─────────────────────────────────────────────────────────────────────────`))
                        console.log(`\r\n\r\n\r\n\r\n${chalk.green(`cd ${data.name}`)}`)
                        console.log(`$ ${chalk.green('npm install')}`)
                        console.log(`$ ${chalk.green('npm run dev')}`)
                        process.exit()
                    }
                }, err => {
                    console.log(`${chalk.red(err)}`);
                    process.exit(-1)
                })
            }).catch(err => {
                console.log(`${chalk.red(err)}`)
                process.exit(-1);
            })
        })
        
}
