// baixando as bibliotecas, use "npm i" para começar a baixar todas as bibliotecas
const venom = require('venom-bot');
const mercadopago = require('mercadopago')
const puppeteer = require('puppeteer');
const axios = require('axios');
mercadopago.configure({ access_token: 'mercadopago_acess-token' })
const fs = require('fs');
const gtts = require('node-gtts');
// bloqueia o app de parar se ouver erro no console 'catch'.
process.on('uncaughtException', (err, origin) => { console.log(err, origin) })
// criando o ChatBOT para WhatsApp
venom.create({session: 'session-name', puppeteerOptions: {args: ['--no-sandbox']}}).then((client) => start(client)).catch((erro) => {console.log(erro);});
function start(client) {
  puppeteer.launch({args: ['--no-sandbox']});
  client.onMessage(async (message) => {
    // verifica se foi removido um cliente do grupo é quem removeu ele(a)
    if (message.subtype === 'remove' && message.groupInfo.id === '120363160916868044@g.us') {
    // se foi removido um cliente do grupo manda uma mensagem informando que removeu o cliente do grupo
    await client.startTyping(message.from)
    await client.sendImage(message.from,'./assets/gif/banido.gif','banido.gif',`*${message.sender.pushname}* removeu +${message.recipients[0].split('@')[0]} do grupo!`);
    await client.sendVoice(message.from, `./assets/mp3/banido.mp3`);
    } else
    // verifica se foi adicionado alguém ao grupo de cliente
    if (message.subtype === 'add' && message.groupInfo.id === '120363160916868044@g.us') {
    // se foi adicionado alguém novo(a) no grupo de cliente envia uma mensagem de boas-vindas
    await client.startTyping(message.from)
    await client.sendText(message.from, `Olá +${message.recipients[0].split('@')[0]} seja bem-vindo(a) ao grupo, fico feliz em saber que você comprou nosso Hacker :D`)
    await client.sendVoice(message.from, `./assets/mp3/boas-vindas.mp3`);
    } else 
    // se não foi adicionado ninguém novo ao grupo pula para um nova verificação, se a pessoa mandou alguma mensagem no grupo de clientes é se contem a palavra ajuda
    if (message.isGroupMsg === true && message.body.includes('ajuda') && message.groupInfo.id === '120363160916868044@g.us') {
    // se a pessoa mandou mensagem no grupo de clientes é pediu ajuda enviamos o contato do nosso ChatBOT é uma mensagem
    await client.startTyping(message.from)
    await client.sendText(message.from, `Olá *${message.sender.pushname}*, precisa de ajuda ai, contate-me.`)
    await client.sendContactVcard(message.from, message.to, 'J Cheats - ChatBOT')
    } else
    // se a pessoa digitou 1 é para comprar
    if (message.body === '1' || message.body === '🛒 COMPRAR J CHEATS :D') {
    await client.sendImage(message.from,'./assets/img/tabela.png','tabela.png',`Essa é a tabela de preços do nosso Hacker J Cheats, por acaso queira comprar, aqui estam os planos:\n*1 DIA* DE ACESSO: R$ 10,00 📱 1 CELULAR, para comprar digite: *comprar 1 dia*.\n*30 DIAS* DE ACESSO: R$ 60,00 📱 1 CELULAR, para comprar digite: *comprar 30 dias*.\n*PERMANENTE*, DIREITO A ATUALIZAÇÕES: R$ 100,00 📱 1 CELULAR, para comprar digite: *comprar permanente*.\n`);
    await client.sendButtons(message.from, 'J Cheats - ChatBOT', [
        {
          "buttonText": {
            "displayText": "🥉 1 DIA = R$ 10,00"
            }
          },
        {
          "buttonText": {
            "displayText": "🥈 30 DIAS = R$ 60,00"
            }
          },
          {
            "buttonText": {
              "displayText": "🥇 LOGIN PERMANENTE"
              }
            }
        ], `Olá ${message.sender.pushname}, clique no botão abaixo de acordo com o plano de Hacker que você deseja comprar, lembrando damos suporte a qualquer plano!`)
    } else
    // se a pessoa digitou 2 é para falar com suporte
    if (message.body === '2' || message.body === '📞 FALAR COM ATENDENTE') {
    client.sendText(message.from, `Olá *${message.sender.pushname}*, aguarde um de nossos suportes te atender, isso pode demorar um pouco, enquanto esperamos compartilhe seu problema com nós para que um atendente saiba resolver.`)
    } else
    // verifica se a pessoa clicou ou digitou uma keyword para comprar algo
    if (message.body === '🥉 1 DIA = R$ 10,00' || message.body.includes('comprar 1 dia')) {
    const payment_data = {
       transaction_amount: 10,
       description: 'Hacker J Cheats | 1 DIA',
       payment_method_id: 'pix',
        payer: {
        email: `kidbgalla@gmail.com`,
        first_name: `${message.sender.pushname}`,
    }}

    const data = await mercadopago.payment.create(payment_data)
    // definindo data é hora obtido pela API :D
    let response_api = await axios.get('http://worldtimeapi.org/api/ip') 
    const datetime = new Date(response_api.data.datetime);
    const day = datetime.getDate();
    const month = datetime.toLocaleString("default", { month: "long" });
    const year = datetime.getFullYear();
    const hour = datetime.getHours();
    const minutes = datetime.getMinutes();
    const dayOfWeek = datetime.getDay();
    const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    await client.sendText(message.from, `Olá *${message.sender.pushname}* seu ticket de pagamento foi gerado clique no LINK para ir até ele é pagar,  quando o pagamento for aprovado vamos enviar todos os dados aqui até mesmo seu Login!\n--------------->\n*Informações de pagamento:*\n*Nome:* ${message.sender.pushname}\n*Id da venda:* ${data.body.id}\n*Nome do produto:* J Cheats - 1 DIA DE LOGIN\n*Vendedor:* Bruno_modzs\n*Data:* ${daysOfWeek[dayOfWeek]}, ${day} de ${month} de ${year}, hora ${hour}:${minutes}!`)
    await client.sendLinkPreview(message.from,`${data.body.point_of_interaction.transaction_data.ticket_url}`,`Ticket de pagamento ${message.sender.pushname}, ${data.body.id}.`)
    // tempo de espera por pagamento, 10 verificações cada 1 de 1 minuto 60000ms
    let expira = 0;
    const interval = setInterval(async () => {
    console.log(expira)
    const res = await mercadopago.payment.get(data.body.id)
    const pagamentoStatus = res.body.status
    if (pagamentoStatus === 'approved') {
    await clearInterval(interval)
    await client.sendLinkPreview(message.from, 'https://www.mediafire.com/file/chj1gturhu8evjc/FF+GLOBAL+BYPASS+TG+TEAM+1.0.apk/file?dkey=23f8cj1colp&r=159', `✅ ${data.body.id}, ${message.sender.pushname}, pagamento aprovado.`)
    await client.sendFile(message.from,'./aprovado/BYPASS & APK ༒「 CLAYTON MODDER ⓥ 」༒ VPN 1.0.2.zip',`${data.body.id}, SUA VPN ${message.sender.pushname}`,'Instale sua VPN, ela serve de bypass, ela te protege de banimentos é BlackList!')
    await client.sendFile(message.from,'./aprovado/J CHEATS_1.4.apk',`${data.body.id}, SEU APK ${message.sender.pushname}`,'Instale seu J Cheats APK, ele é oque tem as opções como: HS, ANTENA, entre outras funções do nosso Hacker :D')
    await client.sendLinkPreview(message.from, 'https://youtu.be/QEoslnPZgS0', `🔓 Tutorial de como usar nosso Hacker!`)
    // limite para a esperar do pagamento, como hospedagem tem RAM se a verificação fica infinita seu App fica fora do ar por falta de RAM!
    // poriso tem que por limite é se ele expirar você limpar o interval :D
    } else if (expira > 10) {
    await clearInterval(interval)
    // avisa ao possivel cliente sobre a expiração do seu pagamento
    await client.sendText(message.from, `❌ Olá *${message.sender.pushname}* seu pagamento expirou porque você demorou demais para pagar, se ainda tiver interesse gere outro é pague antes do 30 minutos!`)
    } else {
    // informa ao possivel cliente as tentativas de aprovação
    await client.sendText(message.from, `⏱ Olá *${message.sender.pushname}* essa é a *${expira}* verificação, fazemos 10 verificações cada uma de 1 minuto oque significa que você tem 10 minutos para finalizar o pagamento é nós aprovar!`)
    // se não expirou apenas continua verificando a cada 1 minuto se foi pago ou não
    expira++;
    }
    }, 60000)
    } else
    // verifica se a pessoa clicou ou digitou uma keyword para comprar algo
    if (message.body === '🥈 30 DIAS = R$ 60,00' || message.body.includes('comprar 30 dias')) {
        const payment_data = {
           transaction_amount: 30,
           description: 'Hacker J Cheats | 30 DIAS',
           payment_method_id: 'pix',
            payer: {
            email: `kidbgalla@gmail.com`,
            first_name: `${message.sender.pushname}`,
        }}
    
        const data = await mercadopago.payment.create(payment_data)
        // definindo data é hora obtido pela API :D
        let response_api = await axios.get('http://worldtimeapi.org/api/ip') 
        const datetime = new Date(response_api.data.datetime);
        const day = datetime.getDate();
        const month = datetime.toLocaleString("default", { month: "long" });
        const year = datetime.getFullYear();
        const hour = datetime.getHours();
        const minutes = datetime.getMinutes();
        const dayOfWeek = datetime.getDay();
        const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        await client.sendText(message.from, `Olá *${message.sender.pushname}* seu ticket de pagamento foi gerado clique no LINK para ir até ele é pagar,  quando o pagamento for aprovado vamos enviar todos os dados aqui até mesmo seu Login!\n--------------->\n*Informações de pagamento:*\n*Nome:* ${message.sender.pushname}\n*Id da venda:* ${data.body.id}\n*Nome do produto:* J Cheats - 1 DIA DE LOGIN\n*Vendedor:* Bruno_modzs\n*Data:* ${daysOfWeek[dayOfWeek]}, ${day} de ${month} de ${year}, hora ${hour}:${minutes}!`)
        await client.sendLinkPreview(message.from,`${data.body.point_of_interaction.transaction_data.ticket_url}`,`Ticket de pagamento ${message.sender.pushname}, ${data.body.id}.`)
        // tempo de espera por pagamento, 10 verificações cada 1 de 1 minuto 60000ms
        let expira = 0;
        const interval = setInterval(async () => {
        const res = await mercadopago.payment.get(data.body.id)
        const pagamentoStatus = res.body.status
        if (pagamentoStatus === 'approved') {
        await clearInterval(interval)
        await client.sendLinkPreview(message.from, 'https://www.mediafire.com/file/chj1gturhu8evjc/FF+GLOBAL+BYPASS+TG+TEAM+1.0.apk/file?dkey=23f8cj1colp&r=159', `✅ ${data.body.id}, ${message.sender.pushname}, pagamento aprovado.`)
        await client.sendFile(message.from,'./aprovado/BYPASS & APK ༒「 CLAYTON MODDER ⓥ 」༒ VPN 1.0.2.zip',`${data.body.id}, SUA VPN ${message.sender.pushname}`,'Instale sua VPN, ela serve de bypass, ela te protege de banimentos é BlackList!')
        await client.sendFile(message.from,'./aprovado/J CHEATS_1.4.apk',`${data.body.id}, SEU APK ${message.sender.pushname}`,'Instale seu J Cheats APK, ele é oque tem as opções como: HS, ANTENA, entre outras funções do nosso Hacker :D')
        await client.sendLinkPreview(message.from, 'https://youtu.be/QEoslnPZgS0', `🔓 Tutorial de como usar nosso Hacker!`)
        // limite para a esperar do pagamento, como hospedagem tem RAM se a verificação fica infinita seu App fica fora do ar por falta de RAM!
        // poriso tem que por limite é se ele expirar você limpar o interval :D
        } else if (expira > 10) {
        await clearInterval(interval)
        // avisa ao possivel cliente sobre a expiração do seu pagamento
        await client.sendText(message.from, `❌ Olá *${message.sender.pushname}* seu pagamento expirou porque você demorou demais para pagar, se ainda tiver interesse gere outro é pague antes do 30 minutos!`)
        } else {
        // informa ao possivel cliente as tentativas de aprovação
        await client.sendText(message.from, `⏱ Olá *${message.sender.pushname}* essa é a *${expira}* verificação, fazemos 10 verificações cada uma de 1 minuto oque significa que você tem 10 minutos para finalizar o pagamento é nós aprovar!`)
        // se não expirou apenas continua verificando a cada 1 minuto se foi pago ou não
        expira++;
        }
        }, 60000)
        } else
        // verifica se a pessoa clicou ou digitou uma keyword para comprar algo
    if (message.body === '🥇 LOGIN PERMANENTE' || message.body.includes('comprar permanente')) {
        const payment_data = {
           transaction_amount: 100,
           description: 'Hacker J Cheats | PERMANENTE',
           payment_method_id: 'pix',
            payer: {
            email: `kidbgalla@gmail.com`,
            first_name: `${message.sender.pushname}`,
        }}
    
        const data = await mercadopago.payment.create(payment_data)
        // definindo data é hora obtido pela API :D
        let response_api = await axios.get('http://worldtimeapi.org/api/ip') 
        const datetime = new Date(response_api.data.datetime);
        const day = datetime.getDate();
        const month = datetime.toLocaleString("default", { month: "long" });
        const year = datetime.getFullYear();
        const hour = datetime.getHours();
        const minutes = datetime.getMinutes();
        const dayOfWeek = datetime.getDay();
        const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        await client.sendText(message.from, `Olá *${message.sender.pushname}* seu ticket de pagamento foi gerado clique no LINK para ir até ele é pagar,  quando o pagamento for aprovado vamos enviar todos os dados aqui até mesmo seu Login!\n--------------->\n*Informações de pagamento:*\n*Nome:* ${message.sender.pushname}\n*Id da venda:* ${data.body.id}\n*Nome do produto:* J Cheats - 1 DIA DE LOGIN\n*Vendedor:* Bruno_modzs\n*Data:* ${daysOfWeek[dayOfWeek]}, ${day} de ${month} de ${year}, hora ${hour}:${minutes}!`)
        await client.sendLinkPreview(message.from,`${data.body.point_of_interaction.transaction_data.ticket_url}`,`Ticket de pagamento ${message.sender.pushname}, ${data.body.id}.`)
        // tempo de espera por pagamento, 10 verificações cada 1 de 1 minuto 60000ms
        let expira = 0;
        const interval = setInterval(async () => {
        const res = await mercadopago.payment.get(data.body.id)
        const pagamentoStatus = res.body.status
        if (pagamentoStatus === 'approved') {
        await clearInterval(interval)
        await client.sendLinkPreview(message.from, 'https://www.mediafire.com/file/chj1gturhu8evjc/FF+GLOBAL+BYPASS+TG+TEAM+1.0.apk/file?dkey=23f8cj1colp&r=159', `✅ ${data.body.id}, ${message.sender.pushname}, pagamento aprovado.`)
        await client.sendFile(message.from,'./aprovado/BYPASS & APK ༒「 CLAYTON MODDER ⓥ 」༒ VPN 1.0.2.zip',`${data.body.id}, SUA VPN ${message.sender.pushname}`,'Instale sua VPN, ela serve de bypass, ela te protege de banimentos é BlackList!')
        await client.sendFile(message.from,'./aprovado/J CHEATS_1.4.apk',`${data.body.id}, SEU APK ${message.sender.pushname}`,'Instale seu J Cheats APK, ele é oque tem as opções como: HS, ANTENA, entre outras funções do nosso Hacker :D')
        await client.sendLinkPreview(message.from, 'https://youtu.be/QEoslnPZgS0', `🔓 Tutorial de como usar nosso Hacker!`)
        // limite para a esperar do pagamento, como hospedagem tem RAM se a verificação fica infinita seu App fica fora do ar por falta de RAM!
        // poriso tem que por limite é se ele expirar você limpar o interval :D
        } else if (expira > 10) {
        await clearInterval(interval)
        // avisa ao possivel cliente sobre a expiração do seu pagamento
        await client.sendText(message.from, `❌ Olá *${message.sender.pushname}* seu pagamento expirou porque você demorou demais para pagar, se ainda tiver interesse gere outro é pague antes do 30 minutos!`)
        } else {
        // informa ao possivel cliente as tentativas de aprovação
        await client.sendText(message.from, `⏱ Olá *${message.sender.pushname}* essa é a *${expira}* verificação, fazemos 10 verificações cada uma de 1 minuto oque significa que você tem 10 minutos para finalizar o pagamento é nós aprovar!`)
        // se não expirou apenas continua verificando a cada 1 minuto se foi pago ou não
        expira++;
        }
        }, 60000)
        } else
    // fazemos outra verificação se não foi nenhuma dessas de cima que o usuário executou, verificamos se enviou mensagem no nosso privado
    if (message.body && message.isGroupMsg === false) {
    // se sim fazemos uma serie de ações como responder ao cliente
    await client.startTyping(message.from)
    await client.sendImage(message.from,'./assets/img/tabela.png','tabela.png',`Essa é a tabela de preços do nosso Hacker J Cheats, por acaso queira comprar, aqui estam os planos:\n*1 DIA* DE ACESSO: R$ 10,00 📱 1 CELULAR, para comprar digite: *comprar 1 dia*.\n*30 DIAS* DE ACESSO: R$ 60,00 📱 1 CELULAR, para comprar digite: *comprar 30 dias*.\n*PERMANENTE*, DIREITO A ATUALIZAÇÕES: R$ 100,00 📱 1 CELULAR, para comprar digite: *comprar permanente*.\n`);
    await client.sendButtons(message.from, 'J Cheats - ChatBOT', [
        {
          "buttonText": {
            "displayText": "🛒 COMPRAR J CHEATS :D"
            }
          },
        {
          "buttonText": {
            "displayText": "📞 FALAR COM ATENDENTE"
            }
          }
        ], `Olá *${message.sender.pushname}*, esse contato é apenas para vendas do JCheats.\n*1.* Para comprar o JCheats digite 1, para falar com um suporte real digite 2.`)
    const text = await `Olá ${message.sender.pushname}, para comprar o nosso Hacker digite #1, para falar com um suporte real digite #2.`;
    const language = 'pt';
    const gttsInstance = await gtts(language);
    await new Promise((resolve, reject) => {gttsInstance.save(`./assets/mp3/${message.sender.pushname}.mp3`, text, (error) => {if (error) {reject(error);} else {resolve();}});});
    await client.sendVoice(message.from, `./assets/mp3/${message.sender.pushname}.mp3`);
    await client.sendVoice(message.from, `./assets/mp3/boas-vindas2.mp3`);
    await client.sendVoice(message.from, `./assets/mp3/boas-vindas3.mp3`);
    await fs.unlink(`./assets/mp3/${message.sender.pushname}.mp3`);
    }
  });
}