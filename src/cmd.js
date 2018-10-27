const commander = require('commander')

const translate = require('./lib/translate')

const pkg = require('../package.json')

commander.version(pkg.version)

commander
    .option('-t, --translate [string]', '查询的词')
    .action(translate)

module.exports = function() {
    commander.parse(process.argv)
}