const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
require('dotenv').config; // Asegúrate de invocar config() aquí

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const path = require('path');
const fs = require('fs');
const chat = require('./chatGPT');



const menuPath = path.join(__dirname, 'mensajes', 'menu.txt');
const menu = fs.readFileSync(menuPath, 'utf-8');

const problemasFrecuentesPath = path.join(__dirname, 'mensajes','problemasFrecuentes.txt')
problemasFrecuentes = fs.readFileSync(problemasFrecuentesPath, 'utf-8');

const serverAdminPath = path.join(__dirname, 'mensajes','serverAdmin.txt')
serverAdmin = fs.readFileSync(serverAdminPath, 'utf-8');

const networkingPath = path.join(__dirname, 'mensajes','networking.txt')
networking = fs.readFileSync(networkingPath, 'utf-8');

const gptPath = path.join(__dirname, 'mensajes','promptgpt.txt')
promptConsultas = fs.readFileSync(gptPath, 'utf-8');


const flowPrincipal = addKeyword (['Hola','hola'])
    .addAnswer('Hola! Soy Sophie y estoy para ayudarte. Para ver las opciones escribi *Menu*')

// Definir el submenú para la opción 1
const flowSubMenu1 = addKeyword(['1', '2', '3'])
    .addAnswer('Has seleccionado una opción del submenú.');

// Modificar el flujo de teléfonos para incluir un submenú
const flowProblemasFrecuentes = addKeyword(EVENTS.ACTION)
    .addAnswer(problemasFrecuentes,
     { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            switch (ctx.body) {
                case '1':
                    return gotoFlow(flowServerAdmin)
                case '2':
                    return gotoFlow(flowNetworking)
                case '3':
                    return gotoFlow(flowTelefonia)
                case '4':
                    return gotoFlow(flowCore)
                case '5':
                    return gotoFlow(flowService)

                default:
                    return fallBack('Respuesta no válida, por favor selecciona una opción del submenú.');
            }
        })
    

const flowTicket = addKeyword(EVENTS.ACTION)
    .addAnswer('Para hacer un ticker por favor ingresar a https://emergencias.sd.cloud.invgate.net/')
    .addAnswer('h', {
        media: 'https://emergencias.invgateusercontent.net/emergencias/uploads/attached_files/knowledge/4702/3f6cc75e84afb1416d4934b00269d4c3/Troubleshooting%20forti.pdf'
    })
    .addAnswer('Para volver a ver las opciones escribi *Menu*')

const flowDesbloqueo = addKeyword(EVENTS.ACTION)
    .addAnswer('Para desbloquear el usuario debes hacerlo desde AdSerfService: https://desbloqueo.emergencias.com.ar/authorization.do\nAca te paso el link con el instructivo: https://emergencias.sd.cloud.invgate.net/knowledgebase_articles/show/index/article_id/30')
    
    .addAnswer('Para volver a ver las opciones escribi *Menu*')

const flowServerAdmin = addKeyword(EVENTS.ACTION)
.addAnswer(
    serverAdmin, {capture: true} , async (ctx, { gotoFlow, fallBack }) => {
        if (ctx.body === '0') {
            return gotoFlow(flowProblemasFrecuentes);
        }
        // Aquí puedes agregar más lógica si necesitas manejar otras opciones dentro de flowNetworking
        return fallBack('Respuesta no válida, por favor selecciona una opción válida o escribe 0 para volver al menú anterior.');
    });



const flowNetworking = addKeyword(EVENTS.ACTION)
    .addAnswer(networking, { capture: true }, async (ctx, { gotoFlow, fallBack }) => {
        if (ctx.body === '0') {
            return gotoFlow(flowProblemasFrecuentes);
        }
        // Aquí puedes agregar más lógica si necesitas manejar otras opciones dentro de flowNetworking
        return fallBack('Respuesta no válida, por favor selecciona una opción válida o escribe 0 para volver al menú anterior.');
    });

const flowTelefonia = addKeyword(EVENTS.ACTION)
.addAnswer('Te la debo');


const flowCore = addKeyword(EVENTS.ACTION)
.addAnswer('Te la debo');

const flowService = addKeyword(EVENTS.ACTION)
.addAnswer('Te la debo');

const flowConsultas = addKeyword(EVENTS.ACTION)
    .addAnswer('Esta es la seccion de consultas.')
    .addAnswer('Haz una consulta', { capture: true }, async (ctx, ctxFn) => {
        const prompt = promptConsultas;
        const consulta = ctx.body;
        const answer = await chat(prompt, consulta);
        await ctxFn.flowDynamic(answer.content);
    });

const menuFlow = addKeyword(['Menu','menu','Menú','menú']).addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!['1', '2', '3', '4', '0'].includes(ctx.body)) {
            return fallBack('Respuesta no valida, por favor seleccionar otras opciones');
        }
        switch (ctx.body) {
            case '1':
                return gotoFlow(flowProblemasFrecuentes);
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
    .addAnswer('Esta no es una palabra valida')/*, {
        delay: 100
    }, async (ctx, ctxFn) => {
        if (ctx.body.includes('casas')) {
            await ctxFn.flowDynamic('Escribiste casas');
        } else {
            await ctxFn.flowDynamic('Escribiste otra cosa');
        }
    };*/

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal,flowWelcome, menuFlow, flowProblemasFrecuentes, flowTicket, flowDesbloqueo, flowConsultas, flowSubMenu1, flowServerAdmin, flowNetworking, flowTelefonia, flowCore, flowService]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
