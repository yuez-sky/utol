// const request = require('request')
const rp = require('request-promise')
const cheerio = require('cheerio') 
const colors = require('colors/safe')

const loadHtml = cheerio.load

async function get(str) {
    const baseUrl = 'https://dict.youdao.com/w'
    const options = {
        uri: `${baseUrl}/${encodeURI(str)}`,
        transform: function (body) {
            return loadHtml(body);
        }
    };
    const data = await rp(options)
    return data
}

function parse($) {
    const variable = $('.keyword').text()
    if (!variable) {
        console.log(colors.gray('没找到相应的释意'))
        return {}
    }
    const isEn = encodeURI(variable) === variable
    if (isEn) {
        // phonetic
        const pronounce = $('.pronounce').toArray().map(e => {
            const html = loadHtml(e)
            const country = html.text().split(/\s/g).filter(e => e)
            return country 
        })

        // trans-container
        const trans = $('#phrsListTab .trans-container ul li').toArray().map(e => loadHtml(e).text())
        return {
            variable,
            pronounce,
            trans,
        }
    }

    const trans = $('#phrsListTab .trans-container .wordGroup').toArray().map(e => loadHtml(e).text().replace(/\s/g, ''))
    return {
        variable,
        trans,
    }
}

async function translate(options) {
    const { translate } = options
    if (!translate) {
        console.log(colors.gray('提供一下要翻译的词啊'))
        return
    }
    const response = await get(translate)
    const { variable, pronounce, trans } = parse(response)
    if (!variable) {
        return
    }
    if (pronounce) {
        console.log(colors.gray('发音'))
        console.log(colors.green(pronounce.map(e => e.join(': ')).join('\n')))
        console.log('\n')
    }
    console.log(colors.gray('译词'))
    console.log(colors.green(trans.map(e => e.replace('.', '. ')).join('\n')))
}

module.exports = translate