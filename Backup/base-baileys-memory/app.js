
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
require('dotenv').config(); // Asegúrate de invocar config() aquí

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const path = require('path');
const fs = require('fs');
const chat = require('./chatGPT');

const menuPath = path.join(__dirname, 'mensajes', 'menu.txt');
const menu = fs.readFileSync(menuPath, 'utf-8');

const flowTelefonos = addKeyword(EVENTS.ACTION)
    .addAnswer('Para comunicarte a sistemas tenes que llamar al 0810-333-2210 o al interno 3354');

const flowTicket = addKeyword(EVENTS.ACTION)
    .addAnswer('Para hacer un ticker por favor ingresar a https://emergencias.sd.cloud.invgate.net/')
    .addAnswer('hola', {
        media: 'https://emergencias.invgateusercontent.net/emergencias/uploads/attached_files/knowledge/4702/3f6cc75e84afb1416d4934b00269d4c3/Troubleshooting%20forti.pdf'
    });

const flowDesbloqueo = addKeyword(EVENTS.ACTION)
    .addAnswer('Para desbloquear el usuario debes hacerlo desde AdSerfService');

const flowConsultas = addKeyword(EVENTS.ACTION)
    .addAnswer('Esta es la seccion de consultas.')
    .addAnswer('Haz una consulta', { capture: true }, async (ctx, ctxFn) => {
        const prompt = 'Responde hola';
        const consulta = ctx.body;
        const answer = await chat(prompt, consulta);
        console.log(answer.content);
    });

const menuFlow = addKeyword('Menu').addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!['1', '2', '3', '4', '5', '0'].includes(ctx.body)) {
            return fallBack('Respuesta no valida, por favor seleccionar otras opciones');
        }
        switch (ctx.body) {
            case '1':
                return gotoFlow(flowTelefonos);
            case '2':
                return gotoFlow(flowTicket);
            case '3':
                return gotoFlow(flowDesbloqueo);
            case '4':
                return gotoFlow(flowConsultas);
            case '0':
                return await flowDynamic('Saliendo... Podes volver a acceder escribiendo "*Menu*"');
        }
    }
);

const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer('Esta no es una palabra valida', {
        delay: 100
    }, async (ctx, ctxFn) => {
        if (ctx.body.includes('casas')) {
            await ctxFn.flowDynamic('Escribiste casas');
        } else {
            await ctxFn.flowDynamic('Escribiste otra cosa');
        }
    });

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowWelcome, menuFlow, flowTelefonos, flowTicket, flowDesbloqueo, flowConsultas]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
