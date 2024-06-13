## Documentación del Bot de WhatsApp

### Introducción

Este bot de WhatsApp está diseñado para asistir a los usuarios con diferentes tipos de consultas y problemas relacionados con IT. Utiliza el módulo `@bot-whatsapp/bot` y el proveedor `BaileysProvider` para conectarse a WhatsApp.

### Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
/project-root
├── mensajes/          # Carpeta que contiene los archivos de texto con respuestas predefinidas
├── chatGPT.js         # Archivo que maneja la integración con ChatGPT
├── index.js           # Archivo principal del bot
├── .env               # Archivo de variables de entorno
└── README.md          # Documentación del proyecto
```

### Archivos de Mensajes

En la carpeta `mensajes/` se almacenan los archivos de texto que contienen las respuestas predefinidas para diferentes categorías de consultas. Estos archivos se leen al inicio del script y sus contenidos se utilizan en los flujos de conversación.

#### Ejemplo de Archivos:

- `menu.txt`
- `problemasFrecuentes.txt`
- `serverAdmin/serverAdmin.txt`
- `networking/networking.txt`
- ... y otros archivos correspondientes a diferentes respuestas.

### Archivo Principal (index.js)

#### Importación de Módulos

```javascript
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
require('dotenv').config();
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const path = require('path');
const fs = require('fs');
const chat = require('./chatGPT');
```

Se importan los módulos necesarios para la creación y funcionamiento del bot.

#### Definición de Rutas de Archivos

Se definen las rutas de los archivos de texto que contienen las respuestas predefinidas.

```javascript
const menuPath = path.join(__dirname, 'mensajes', 'menu.txt');
const menu = fs.readFileSync(menuPath, 'utf-8');
// Se definen rutas similares para otros archivos de mensajes
```

#### Definición de Flows

Los `flows` representan las diferentes conversaciones posibles que el bot puede manejar.

##### Flujo de Bienvenida

```javascript
const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer('🙋‍♀️Hola! Soy Emmy y estoy encantada que estes acá. ¿En que puedo ayudarte?\nPara empezar escribi *Menu*');
```

##### Flujo de Menu

```javascript
const flowMenu = addKeyword(['menu', 'Menu', 'MENU'])
    .addAnswer(menu, { capture: true }, async (ctx, { fallBack }) => {
        const responseMap = {
            1: problemasFrecuentes,
            2: promptConsultas,
        };

        const userInput = ctx.body.trim();
        const responseText = responseMap[userInput];

        if (responseText) {
            return responseText;
        } else {
            fallBack();
        }
    });
```

##### Flujo de Consultas GPT

```javascript
const flowGPT = addKeyword(['Consulta GPT', 'gpt', 'GPT', 'consultagpt', 'Consulta GPT', 'Consultagpt'])
    .addAnswer(promptConsultas,{ capture:true }, async (ctx) =>{
        const userInput = ctx.body.trim();
        const gptResponse = await chat(userInput);
        return gptResponse;
    });
```

#### Inicialización del Bot

```javascript
const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([
        flowWelcome, 
        flowMenu,
        flowProblemasFrecuentes,
        flowServerAdmin,
        flowNetworking,
        flowCore,
        flowTelefonia,
        flowServiceDesk,
        flowGPT,
        // ... otros flows
    ]);
    
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
```

Se configuran los adaptadores de flujo y proveedor, y se inicializa el bot. Además, se incluye un portal QR para la conexión con WhatsApp.

### Conclusión

Este bot está diseñado para manejar diversas consultas relacionadas con IT mediante flujos de conversación predefinidos y respuestas almacenadas en archivos de texto. La integración con ChatGPT permite respuestas más dinámicas y detalladas.

---

Guarda este contenido en un archivo llamado `README.md` o similar en el directorio raíz de tu proyecto. De esta manera, cualquier persona que necesite entender o trabajar en el código podrá seguir esta documentación para comprender la estructura y el funcionamiento del bot.