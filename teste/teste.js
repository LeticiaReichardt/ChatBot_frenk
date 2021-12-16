// const vegetarianoScene = require('./vegetariano.mjs')
 //from './vegetariano'
// import vegetarianoScene from './vegetariano.mjs'

const env = require('../.env')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')
const Composer = require('telegraf/composer')
const Session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const { enter, leave} = Stage
const bot = new Telegraf(env.token)

bot.use(Session())

// Listas a serem usadas pelo bot
// '','','','','','','','','','','','','','','','',
let dados = {}
const frutas = ['maça','banana','','','','','','','','','','','','','','','','','','',]
const verduras = ['Acelga','Alface','Agrião','Brócolis','Couve','Couve-flor','Espinafre','Hortelã','Rúcula','Salsão','','','','','','',]
const indutrializados = ['queijo','presunto','iogurt','refrigerante','sorvete','salgadinhos','bolacha','biscoito','suco em pó','bala','chocolate','','','','','',]
const lanches = ['coxinha','pastel','empadão','cachorro quente','batata frita','x','burguer','x-salada','empadinha','sanduiche','churros','crepes','','','','',]
const comidas = ['carne','macarrão','feijão','sopa','arroz','batata','sushi','peixe','frango','porco','peru','boi','','','','',]
const comidaVegetariana = ['','','','','','','','','','','','','','','','',]
const comidaOnivoro = ['carne','peixe','frango','porco','boi','churrasco','','','','','','','','','','',]

// *************** CONSTRUÇÃO DE TECLADOS ******************** //
// VERIFICANDO SE É OU NÃO VEGETARIANO ** USUARIO **
const vegetariano = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Sim', 's'),
    Markup.callbackButton('Não', 'n'),
], { columns: 2 }))

// VERIFICANDO SE É OU NÃO VEGETARIANO ** GRUPO **
const vegetarianoGroup = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Sim', 'sg'),
    Markup.callbackButton('Não', 'ng'),
], { columns: 2 }))

const botoes = lista => Extra.markup(
    Markup.inlineKeyboard(
        lista.map(
            item => Markup.callbackButton(
                item, 
                `delete ${item}`
            )
        ), 
        { columns: 3 }
    )
)



// **********************************************************************************************************************
//  ------------------------- START ----------------------- //
// **********************************************************************************************************************

// Iniciando a conversa com o bot, trasendo descrições das funcionalidades e definindo com quem o bot irá conversar

bot.start(async ctx=> {
    console.log(ctx.chat.id)
    const gruporuser = ''+ctx.chat.id // eu sei essa gambiarra para forçar string é linda... sem tempo de pesquisar desculpe
    const from = ctx.update.message.from
    let mens = 'O BOT foi desenvolvido por Leticia Piaz Reichardt e o tema dele é comida, como sugere as primeiras mensagens kkk'
    mens += '\nEle é dividido em 4 partes sendo elas para:\n\n - Vegetarianos\n - Não vegetarianos\n - Grupos com menbro(s) vegetariano(s)\n - Grupo sem vegetarianos.'
    mens += '\n\nEspero que achem no minino criativo kkkk'

    if (gruporuser.charAt(0) == '-') {
        await ctx.reply(`Olá galera!`)
        await ctx.replyWithHTML(`<b>SÓ PENSO EM COMIDA!!!</b>\nVamos juntos passar vontadeee!!`)
        await ctx.replyWithMarkdown(`*Descrição do BOT*\n\n${mens}`)
        await ctx.replyWithMarkdown(`Primeiramente... Tem alguém *vegetariano* no grupo?`,vegetarianoGroup)
        ctx.session.listagosto = []
        ctx.session.listangosto = []

    } else if(from.id == env.userID){
        await ctx.reply(`Bem vinda, criadora!!\nMestra ${from.first_name} ${from.last_name}!`)
        await ctx.replyWithHTML(`<b>MEU BOT SÓ PENSA EM COMIDA!!!</b>\nVamos juntos passar vontadeee!!`)
        await ctx.replyWithMarkdown(`*Descrição do BOT*\n\n${mens}`)
        await ctx.replyWithMarkdown(`Primeiramente... Você é *vegetariana*?`,vegetariano)
        // ctx.session.listagosto = []
        // ctx.session.listangosto = []

    } else if(from.id == env.userIDProf){
        await ctx.reply(`Seja bem vindo, professor ${from.first_name} ${from.last_name}!`)
        await ctx.replyWithHTML(`<b>MEU BOT SÓ PENSA EM COMIDA!!!</b>\nVamos juntos passar vontadeee!!`)
        await ctx.replyWithMarkdown(`*Descrição do BOT*\n\n${mens}`)
        await ctx.replyWithMarkdown(`Primeiramente... Você é *vegetariano*?`,vegetariano)
        // ctx.session.listagosto = []
        // ctx.session.listangosto = []

    } else {
        await ctx.reply(`Desculpe, não estou preparado para falar com todos os usuarios do telegram.`)
        await ctx.reply(`Apenas alguns usuarios especificos para treinamento.`)
        await ctx.replyWithMarkdown(`*Tenha um bom dia!*`)
    }
})

bot.use((ctx,next) => {
    console.log(ctx.chat.id)
    const chatId = ctx.chat.id
    if(!dados.hasOwnProperty(chatId))
        dados[chatId] = []
    ctx.itens = dados[chatId]
    next()
})

// ----------------------------------------- CENAS ------------------------------------------------ //

const vegetarianoScene = new Scene('vegetarianoScene')
const nVegetarianoScene = new Scene('nVegetarianoScene')
const vegetarianoGrupoScene = new Scene('vegetarianoGrupoScene')
const nVegetarianoGrupoScene = new Scene('nVegetarianoGrupoScene')

//  ******************************************** USUÁRIO É VEGETARIAMO ************************************************

const helpV = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Não sou vegetariano', 'noVegam'),
    Markup.callbackButton('Não sei o que comer', 'fome'),
    Markup.callbackButton('Como tornar alguém vegano?', 'veganismo'),
    Markup.callbackButton('Eu sou vegano mesmo?', 'criseIdentidade'),
], { columns: 1 }))
// vegetarianoScene

vegetarianoScene.enter(async ctx =>{ 
    // await ctx.replyWithPhoto({source: `${__dirname}/images/frutasLegumesHortali.jpg`})
    // await ctx.replyWithPhoto({source: `${__dirname}/images/sementesFeijoes.jpg`},{ caption: 'Até que tem bastante coisa para você comer...'})
    // await ctx.replyWithPhoto({source: `${__dirname}/images/churrasco.jpg`},{ caption: 'Mas eu só penso nisso!! <3'})
    let mens = 'Eu respondo você'
    mens += '\n\n_Lista de comandos no grupo_\n/ajuda\n/ideiaJanta\n/ideiaAlmoco\n/pqVegetariano\n'
    
    await ctx.replyWithMarkdown(`*Descrição das possibilidades*\n\n${mens}`)
})

// COMANDOS
// vegetarianoScene.command('ajuda', helpV)
vegetarianoScene.command('ajuda',  ctx => {
    ctx.replyWithMarkdown('As opções para /ajuda são:'
    + '\n/noVegam: Eu não sou vegano!'
    + '\n/fome/: Não sei o que comer'
    + '\n/veganismo/: Como tornar alguém vegano?'
    + '\n/criseIdentidade/: Eu sou vegano mesmo?')
})

// vegetarianoScene.action('noVegam', leave())// eu ia fazer mais serio essa parte, mas precisaria de mais tempo
// vegetarianoScene.action('fome', ctx => {
//     ctx.reply('PASSOS PARA ACABAR COM A FOME:')
//     ctx.reply('1 - Abra a geladeira e verifique seus ingredientes\n2 - Verifique todo e qualquer mato que você possui nela\n3 - Misture tudo e coma')
//     ctx.reply('Fim.. passou a fome!')
// })
// vegetarianoScene.action('veganismo', ctx => {
//     ctx.reply('Não passais sua doença a diante jamais!!!')
// })
// vegetarianoScene.action('criseIdentidade', ctx => {
//     ctx.reply('Faça o quiz a seguir e descubra o quão vegano você é')
// })

vegetarianoScene.hears('noVegam', leave())// eu ia fazer mais serio essa parte, mas precisaria de mais tempo
vegetarianoScene.hears('fome', ctx => {
    ctx.reply('PASSOS PARA ACABAR COM A FOME:')
    ctx.reply('1 - Abra a geladeira e verifique seus ingredientes\n2 - Verifique todo e qualquer mato que você possui nela\n3 - Misture tudo e coma')
    ctx.reply('Fim.. passou a fome!')
})
vegetarianoScene.hears('veganismo', ctx => {
    ctx.reply('Não passais sua doença a diante jamais!!!')
})
vegetarianoScene.hears('criseIdentidade', ctx => {
    ctx.reply('Mande /quiz para descobrir o quão vegano você é!')
})
// QUIZ
// let pontos = 0
// const wisardVegano = new WizardScene('vegano',
//     ctx => {
//         ctx.reply('Porque você é vegano?')
//         ctx.wizard.next()
//     },
//     ctx => {
//         descricao = ctx.update.message.text
//         ctx.reply('Quanto custou?')
//         ctx.wizard.next()
//     },
//     carneHandler,
//     vontadeHandler,
//     pontuacaoHandler
// )
// const stageWisar = new Stage([wisardVegano], { default: 'vegano'})
// vegetarianoScene.hears('quiz',stageWisar.middleware())

// RESPOSTAS A ENVIOS DE MENSAGENS DIFERENTES E NÂO TRATADAS ANTERIORMENTE
vegetarianoScene.on('location', ctx => {
    ctx.reply(`Entendido! Sei onde você esta agora...`)
    ctx.reply(`Mas eu estou em um lugar melhor`)    
    ctx.replyWithLocation(-26.1193556,-49.8008302)
})

vegetarianoScene.on('contact', ctx => {
    const cont = ctx.update.message.contact
    ctx.reply(`Legal! O telefone do contato ${cont.first_name} é ${cont.phone_number}`)
    ctx.reply(`Mas é que tal esse? contato: \nRESTAURANTE WILLNER\n número: +55473642-6625`)
})

vegetarianoScene.on('voice', ctx => {
    ctx.reply('Hummm... desculpe ainda não consego entender o que me diz por audio, mas espero que seja algo sobre comida!')
})

vegetarianoScene.on('photo', ctx => {
    const foto = ctx.update.message.photo
    ctx.replyWithPhoto({source: `${__dirname}/images/frutasLegumesHortali.jpg`})
})

vegetarianoScene.on('sticker', ctx => {
    const stic = ctx.update.message.sticker
    console.log(stic)
    ctx.reply(`Você enviou o ${stic.emoji} do conjunto ${stic.set_name}`) 
})
vegetarianoScene.command('sair', leave())


//  ******************************************** USUÁRIO NÃO É VEGETARIAMO ************************************************
//nVegetarianoScene

nVegetarianoScene.enter( async ctx => {
    await ctx.replyWithPhoto({source: `${__dirname}/images/churrasco.jpg`},{ caption: 'Tu só pensa nisso, ne?!! <3'})
    let mens = 'Eu respondo você\n\n_Lista de comandos no grupo_\n/ajuda\n/ideiaJanta\n/ideiaAlmoco\/dicasChurrasco\n'
    await ctx.replyWithMarkdown(`*Descrição das possibilidades*\n\n${mens}`)
})
nVegetarianoScene.command('ajuda',  ctx => {
    ctx.replyWithMarkdown('As opções para /ajuda são:'
    + '\n/yesVegam: Eu sou vegano!:'
    + '\n/fome/: Não sei o que comer'
    + '\n/veganismo/: Como tornar alguém vegano?'
    + '\n/criseIdentidade/: Eu sou vegano mesmo?')
})

nVegetarianoScene.command('sair', leave())

//  ******************************************** GRUPO TEM MEBRO(S) VEGETARIAMO(S) ************************************************
// vegetarianoGrupoScene

vegetarianoGrupoScene.enter( async ctx => {
    let mensg = 'No momento eu só listo comidas que vocês do grupo gostam e comidas que vocês não gostam.'
    // mensg += 'Lista de comandos no grupo_\n/ajuda\n/ideiaJanta\n/ideiaAlmoco\/dicasChurrasco\n'
    await ctx.replyWithMarkdown(`*Descrição das possibilidades*\n\n${mensg}`)
})
// nVegetarianoScene.command('ajuda',  ctx => {
//     ctx.replyWithMarkdown('As opções para /ajuda são:'
//     + '\n/noVegam: vegano saiu do grupo!:')
// })
vegetarianoGrupoScene.command('sair', leave())


//  ******************************************** GRUPO NÃO TEM MEBRO(S) VEGETARIAMO(S) ********************************************
// nVegetarianoGrupoScene

nVegetarianoGrupoScene.enter(ctx => {
    let mensg = 'No momento eu só listo comidas que vocês do grupo gostam e comidas que vocês não gostam.'
    ctx.replyWithMarkdown(`*Descrição das possibilidades*\n\n${mensg}`)
})
nVegetarianoGrupoScene.on('text', ctx => {
    let msg = ctx.update.message.text
    ctx.session.lista.push(msg)
    ctx.reply(`${msg} adicionado!`, botoes(ctx.session.lista))
})

nVegetarianoGrupoScene.action(/delete (.+)/, ctx => {
    ctx.session.lista = ctx.session.lista.filter(
        item => item !== ctx.match[1])
    ctx.reply(`${ctx.match[1]} deletado!`, botoes(ctx.session.lista))
})
nVegetarianoGrupoScene.command('sair', leave())

// ---------------------------------- LOOP CENAS --------------------------- //
// ---------------------------------- LOOP CENAS --------------------------- //
// ---------------------------------- LOOP CENAS --------------------------- //

const stage = new Stage([nVegetarianoScene, vegetarianoScene, vegetarianoGrupoScene, nVegetarianoGrupoScene])
bot.use(stage.middleware())
bot.action('s', enter('vegetarianoScene'))
bot.action('n', enter('nVegetarianoScene'))
bot.action('sg', enter('vegetarianoGrupoScene'))
bot.action('ng', enter('nVegetarianoGrupoScene'))
// Situações não trabalhadas acima
bot.on('message', ctx => {
    ctx.reply('Desculpe eu não entendi!')  
})

// para testar pois minhas cenas estão quebrando ali em cima... pelo visto entendi errado o funcionamento das cenas
bot.on('location', ctx => {
    ctx.reply(`Entendido! Sei onde você esta agora...`)
    ctx.reply(`Mas eu estou em um lugar melhor`)    
    ctx.replyWithLocation(-26.1193556,-49.8008302)
})

bot.on('contact', ctx => {
    const cont = ctx.update.message.contact
    ctx.reply(`Legal! O telefone do contato ${cont.first_name} é ${cont.phone_number}`)
    ctx.reply(`Mas é que tal esse? contato: \nRESTAURANTE WILLNER\n número: +55473642-6625`)
})

bot.on('voice', ctx => {
    ctx.reply('Hummm... desculpe ainda não consego entender o que me diz por audio, mas espero que seja algo sobre comida!')
})

bot.on('photo', ctx => {
    const foto = ctx.update.message.photo
    ctx.replyWithPhoto({source: `${__dirname}/images/frutasLegumesHortali.jpg`})
})

bot.on('sticker', ctx => {
    const stic = ctx.update.message.sticker
    console.log(stic)
    ctx.reply(`Você enviou o ${stic.emoji} do conjunto ${stic.set_name}`) 
})
bot.startPolling()