// const Telegraf = require('telegraf')
// const Stage = require('telegraf/stage')
// const Scene = require('telegraf/scenes/base')
// const { enter, leave} = Stage

const vegetarianoScene = new Scene('vegetarianoScene')

vegetarianoScene.enter( async ctx => {
    await ctx.reply(`/s`)
    await ctx.replyWithPhoto({source: `${__dirname}/images/frutasLegumesHortali.jpg`})
    await ctx.replyWithPhoto({source: `${__dirname}/images/sementesFeijoes.jpg`},{ caption: 'Até que tem bastante coisa para você comer...'})
    await ctx.replyWithPhoto({source: `${__dirname}/images/churrasco.jpg`},{ caption: 'Mas eu só penso nisso!! <3'})
    // next()
})
vegetarianoScene.command('sair', leave())

// export default vegetarianoScene
module.exports = { vegetarianoScene  }
