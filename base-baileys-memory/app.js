const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
require('dotenv').config; // Asegúrate de invocar config() aquí

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const path = require('path');
const fs = require('fs');
const chat = require('./chatGPT');

//PROBANDO PULL GITT
//######################################################################
//################ SECCION PARA DECLARAR PATHS #########################
//######################################################################

const menuPath = path.join(__dirname, 'mensajes', 'menu.txt');
const menu = fs.readFileSync(menuPath, 'utf-8');

const problemasFrecuentesPath = path.join(__dirname, 'mensajes','problemasFrecuentes.txt')
problemasFrecuentes = fs.readFileSync(problemasFrecuentesPath, 'utf-8');

const serverAdminPath = path.join(__dirname, 'mensajes','serverAdmin','serverAdmin.txt')
serverAdmin = fs.readFileSync(serverAdminPath, 'utf-8');

const networkingPath = path.join(__dirname, 'mensajes', 'networking','networking.txt')
networking = fs.readFileSync(networkingPath, 'utf-8');

const gptPath = path.join(__dirname, 'mensajes','GPT','promptgpt.txt')
promptConsultas = fs.readFileSync(gptPath, 'utf-8');

const serviceDeskPath = path.join(__dirname, 'mensajes','serviceDesk','service.txt')
const service =  fs.readFileSync(serviceDeskPath, 'utf-8');

const rtaFortiPath = path.join(__dirname, 'mensajes', 'networking', 'rtaForti.txt')
const rtaForti =  fs.readFileSync(rtaFortiPath, 'utf-8');

const rtaBloqueadaPath = path.join(__dirname, 'mensajes', 'networking', 'rtaBloqueada.txt')
const rtaBloqueada =  fs.readFileSync(rtaBloqueadaPath, 'utf-8');

const rtaWifiPath = path.join(__dirname, 'mensajes', 'networking', 'rtaWifi.txt')
const rtaWifi =  fs.readFileSync(rtaWifiPath, 'utf-8');

const rtaOtrasPath = path.join(__dirname, 'mensajes', 'networking', 'rtaOtras.txt')
const rtaOtras =  fs.readFileSync(rtaOtrasPath, 'utf-8');

const rtaCompartidaPath = path.join(__dirname, 'mensajes', 'serverAdmin', 'rtaCompartida.txt')
const rtaCompartida =  fs.readFileSync(rtaCompartidaPath, 'utf-8');

const rtaDatosUsuarioPath = path.join(__dirname, 'mensajes', 'serverAdmin', 'rtaDatosUsuario.txt')
const rtaDatosUsuario =  fs.readFileSync(rtaDatosUsuarioPath, 'utf-8');

const rtaLicenciasPath = path.join(__dirname, 'mensajes', 'serverAdmin', 'rtaLicencias.txt')
const rtaLicencias =  fs.readFileSync(rtaLicenciasPath, 'utf-8');

const rtaFichasPath = path.join(__dirname,'mensajes','core','rtaFichas.txt')
const rtaFichas = fs.readFileSync(rtaFichasPath,'utf-8')

const rtaPermisosPath = path.join(__dirname,'mensajes','core','rtaPermisos.txt')
const rtaPermisos = fs.readFileSync(rtaPermisosPath,'utf-8')

const rtaRcdPath = path.join(__dirname,'mensajes','core','rtaRcd.txt')
const rtaRcd = fs.readFileSync(rtaRcdPath,'utf-8')

const rtaAgentePath = path.join(__dirname,'mensajes','telefonia','rtaAgente.txt')
const rtaAgente = fs.readFileSync(rtaAgentePath,'utf-8')

const rtaBarraPath = path.join(__dirname,'mensajes','telefonia','rtaBarra.txt')
const rtaBarra = fs.readFileSync(rtaBarraPath,'utf-8')

const rtaAvayaPath = path.join(__dirname,'mensajes','telefonia','rtaAvaya.txt')
const rtaAvaya = fs.readFileSync(rtaAvayaPath,'utf-8')

const telefoniaPath = path.join(__dirname,'mensajes','telefonia','telefonia.txt')
const telefonia = fs.readFileSync(telefoniaPath,'utf-8')

const corePath = path.join(__dirname,'mensajes','core','core.txt')
const core = fs.readFileSync(corePath,'utf-8')

const rtainconvenientesPath = path.join(__dirname,'mensajes','serviceDesk','rtainconvenientes.txt')
const rtaInconvenientes = fs.readFileSync(rtainconvenientesPath,'utf-8')

const rtainstalacionPath = path.join(__dirname,'mensajes','serviceDesk','rtainstalacion.txt')
const rtainstalacion = fs.readFileSync(rtainstalacionPath,'utf-8')

const rtaVinchaPath = path.join(__dirname,'mensajes','serviceDesk','rtaVincha.txt')
const rtaVincha = fs.readFileSync(rtaVinchaPath,'utf-8')



// Saludo Emmy

const flowPrincipal = addKeyword (['Hola','hola','Buenas','Holi','Holis'])
    .addAnswer('🙋‍♀️Hola! Soy Emmy y estoy encantada que estes acá.\nPara empezar escribi *Menu*'
    /*null,
    async (ctx,ctxFn) => {
        username = ctx.pushName;
        console.log(username);
        await ctxFn.flowDynamic('🙋‍♀️Hola '+username+'! Soy Emmy y estoy encantada que estes acá. ¿En que puedo ayudarte?\nPara empezar escribi *Menu*')

    }*/
)


const flowWelcome = addKeyword(EVENTS.WELCOME)
.addAnswer('🙋‍♀️Hola! Soy Emmy y estoy encantada que estes acá.\nPara empezar escribi *Menu*')/*, {
    delay: 100 
}, async (ctx, ctxFn) => {
    if (ctx.body.includes('casas')) {
        
    } else {
        await ctxFn.flowDynamic('Escribiste otra cosa');
    }
};*/


// Menu principal
const menuFlow = addKeyword(['Menu','menu','Menú','menú']).addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!['1', '2', '3', '4', '0'].includes(ctx.body)) {
            return fallBack('❌Esta opción no está en el menú. Escribí una de las opciones ');
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

// Flows Ticket y AdSelfService
const pathMedia = 'C:/Users/SSanchez/Documents/Workspace/Chatbot/base-baileys-memory/media/';

const flowTicket = addKeyword(EVENTS.ACTION)
    .addAnswer('Para hacer un ticket por favor ingresar a https://emergencias.sd.cloud.invgate.net/\n\nAca te paso el instructivo por si no sabes como hacerlo👇')
    .addAnswer('Instructivo Invgate',{
        media: pathMedia+'invgate.pdf'
  })
    .addAnswer('Para volver a ver las opciones escribi *Menu*')

const flowDesbloqueo = addKeyword(EVENTS.ACTION)
    .addAnswer('Para desbloquear el usuario debes hacerlo desde AdSerfService: https://desbloqueo.emergencias.com.ar/authorization.do\n\nAca te paso el instructivo por si no sabes como hacerlo👇:')
    .addAnswer('a',{
        media: pathMedia+'ADSELFSERVICE.pdf'
  })
    .addAnswer('Para volver a ver las opciones escribi *Menu*')

// Flow Problemas frecuentes
const flowProblemasFrecuentes = addKeyword(EVENTS.ACTION)
    .addAnswer(problemasFrecuentes,
     { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            const userInput = ctx.body.toLowerCase();

        if (userInput === 'menu') {
            return gotoFlow(menuFlow);
        }
            if (!['1', '2', '3', '4','5', '0'].includes(userInput)) {
                return fallBack('❌Esta opción no está en el menú. Escribí una de las opciones ');
            }
            switch (userInput) {
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
                case '0':
                    return gotoFlow(menuFlow)

            
            }
        })

//************************NETWORKING ************************

// Menu networking
const flowNetworking = addKeyword(EVENTS.ACTION)
    .addAnswer(networking, { capture: true }, async (ctx, { gotoFlow, fallBack }) => {

        const userInput = ctx.body.toLowerCase();

        if (userInput === 'menu') {
            return gotoFlow(menuFlow);
        }

        if (!['1', '2', '3', '4', '0'].includes(userInput)) {
            return fallBack('❌Esta opción no está en el menú. Escribí una de las opciones ');
        }
        switch (userInput) {
            case '1':
                return gotoFlow(flowRtaForti)
            case '2':
                return gotoFlow(flowRtaBloqueada)
            case '3':
                return gotoFlow(flowRtaWifi)
            case '4':
                return gotoFlow(flowRtaOtras)  
            case '0':
                return gotoFlow(flowProblemasFrecuentes);    
    
        }
        

    });

//Flows Respuestas networking

const flowRtaForti = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaForti)

const flowRtaBloqueada = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaBloqueada)

const flowRtaWifi = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaWifi)

const flowRtaOtras = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaOtras)

//************************SERVER ADMIN ************************

//Menu server admin
const flowServerAdmin = addKeyword(EVENTS.ACTION)
.addAnswer(
    serverAdmin, {capture: true} , async (ctx, { gotoFlow, fallBack }) => {
        const userInput = ctx.body.toLowerCase();

        if (userInput === 'menu') {
            return gotoFlow(menuFlow);
        }
        if (!['1', '2', '3', '4', '0'].includes(userInput)) {
            return fallBack('❌Esta opción no está en el menú. Escribí una de las opciones ');
        }
        switch (userInput) {
            case '1':
                return gotoFlow(flowRtaCompartida)
            case '2':
                return gotoFlow(flowRtaDatosUsuario)
            case '3':
                return gotoFlow(flowRtaLicencias)
            case '4':
                return gotoFlow(flowRtaOtras)
            case '0':
                return gotoFlow(flowProblemasFrecuentes)

        }
    
    });
//Flows Respuestas Server
const flowRtaCompartida = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaCompartida)

const flowRtaDatosUsuario = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaDatosUsuario)

const flowRtaLicencias = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaLicencias)

//************************ CORE ************************

//Menu Core
const flowCore = addKeyword(EVENTS.ACTION)
.addAnswer(
    core, {capture: true} , async (ctx, { gotoFlow, fallBack }) => {

        const userInput = ctx.body.toLowerCase();

        if (userInput === 'menu') {
            return gotoFlow(menuFlow);
        }
        if (!['1', '2', '3', '4', '0'].includes(userInput)) {
            return fallBack('❌Esta opción no está en el menú. Escribí una de las opciones ');
        }
        switch (userInput) {
            case '1':
                return gotoFlow(flowRtaFichas)
            case '2':
                return gotoFlow(flowRtaRcd)
            case '3':
                return gotoFlow(flowRtaPermisos)
            case '4':
                return gotoFlow(flowRtaOtras)
            case '0':
                return gotoFlow(flowProblemasFrecuentes)

            
        }
    
    });

//Flows respuestas core
const flowRtaFichas = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaFichas)

const flowRtaPermisos = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaPermisos)

const flowRtaRcd = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaRcd)

//************************ TELEFONIA ************************

//Menu telefonia
const flowTelefonia = addKeyword(EVENTS.ACTION)
.addAnswer(
    telefonia, {capture: true} , async (ctx, { gotoFlow, fallBack }) => {
        const userInput = ctx.body.toLowerCase();

        if (userInput === 'menu') {
            return gotoFlow(menuFlow);
        }

        if (!['1', '2', '3', '4', '0'].includes(userInput)) {
            return fallBack('❌Esta opción no está en el menú. Escribí una de las opciones ');
        }
        switch (userInput) {
            case '1':
                return gotoFlow(flowRtaAvaya)
            case '2':
                return gotoFlow(flowRtaBarra)
            case '3':
                return gotoFlow(flowRtaAgente)
            case '4':
                return gotoFlow(flowRtaOtras)
            case '0':
                return gotoFlow(flowProblemasFrecuentes)
            
        }
    
    });

//Flows respuestas telefonia
const flowRtaAvaya = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaAvaya)

const flowRtaBarra = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaAvaya)

const flowRtaAgente = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaAgente)

// ******************Seccion Service Desk*******************

//Menu Service
const flowService = addKeyword(EVENTS.ACTION)
.addAnswer(service,
    { capture: true },
       async (ctx, { gotoFlow, fallBack }) => {

        const userInput = ctx.body.toLowerCase();

        if (userInput === 'menu') {
            return gotoFlow(menuFlow);
        }

        if (!['1', '2', '3', '4', '0'].includes(userInput)) {
            return fallBack('❌Esta opción no está en el menú. Escribí una de las opciones ');
        }
           switch (userInput) {
               case '1':
                   return gotoFlow(flowRtaInstalacion)
               case '2':
                   return gotoFlow(flowRtainconvenientes)
               case '3':
                   return gotoFlow(flowRtaVincha)
               case '4':
                   return gotoFlow(flowRtaOtras)
               case '0':
                   return gotoFlow(flowProblemasFrecuentes)
           }
       })
//Flows respuestas service
const flowRtainconvenientes = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaInconvenientes)

const flowRtaInstalacion = addKeyword(EVENTS.ACTION)
    .addAnswer(rtainstalacion)

const flowRtaVincha = addKeyword(EVENTS.ACTION)
    .addAnswer(rtaVincha)


//****************** GPT ****************************

const flowConsultas = addKeyword(EVENTS.ACTION)
    .addAnswer('Haceme una breve descripcion de tu problema. Estoy segura que te voy a poder ayudar', { capture: true }, async (ctx, ctxFn) => {
        const prompt = promptConsultas;
        const consulta = ctx.body;
        const answer = await chat(prompt, consulta);
        await ctxFn.flowDynamic(answer.content);
    });


const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([
            flowRtaCompartida,
            flowRtaDatosUsuario, 
            flowRtaLicencias, 
            flowPrincipal,
            flowWelcome, 
            menuFlow, 
            flowProblemasFrecuentes, 
            flowTicket,
            flowDesbloqueo, 
            flowConsultas, 
            flowServerAdmin, 
            flowNetworking,
            flowTelefonia, 
            flowCore,
            flowService,
            flowRtaForti,
            flowConsultas,
            flowRtaOtras,
            flowRtaWifi,
            flowRtaFichas,
            flowRtaCompartida,
            flowRtaRcd,
            flowRtaAgente,
            flowRtaAvaya,
            flowRtaBarra,
            flowRtaVincha,
            flowRtainconvenientes,
            flowRtaInstalacion]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
