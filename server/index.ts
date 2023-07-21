// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562

import express from 'express'
import compression from 'compression'
import { renderPage } from 'vite-plugin-ssr/server'
import { rootPath } from './root.js'
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const port = process.env.PORT!;
  const model = process.env.MODEL!;
  const chatModel = process.env.CHAT_MODEL!;
  const app = express();

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completionSettings = {
    temperature: 0.888,
    max_tokens: 2048,
    frequency_penalty: 0,
    presence_penalty: 0,
    top_p: 1
  }

  app.use(compression());

  if (isProduction) {
    const sirv = (await import('sirv')).default
    app.use(sirv(`${rootPath}/dist/client`))
  } else {
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root: rootPath,
        server: { middlewareMode: true }
      })
    ).middlewares
    app.use(viteDevMiddleware);
  }

  app.post('/component-factory/completion', async(req, res, next) => {
    const text = req.query.text;
    const isUserAuthorized = req.query.isUserAuthorized;
    const prompt = `${ text }`;

    try {
      if (isUserAuthorized && completionSettings) {
        if (prompt === null) {
          console.log('no prompt provided');
          return;
        }
        const response = await openai.createCompletion({
          model: model,
          prompt: prompt,
          ...completionSettings
        });
        const completion = response.data.choices[0].text;
        console.log('completion: ', completion);
        return res.status(200).json({
          message: completion
        });
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    };
  });

  app.post('/component-factory/chat-completion', async(req, res, next) => {
    const text = req.query.text;
    const isUserAuthorized = req.query.isUserAuthorized;
    const chatRole = req.query.chatRole;
    console.log('chatRole: ', (chatRole as string[]).join(', '));
    const prompt = `${ text }`;

    try {
      if (isUserAuthorized && completionSettings) {
        if (prompt === null) {
          console.log('no prompt provided');
          return;
        }
        const response = await openai.createChatCompletion({
          model: chatModel,
          ...completionSettings,
          messages: [
                {
                  "role": "system",
                  "content": `${(chatRole as string[]).join(', ')}`
                },
                {
                  role: "user",
                  content: prompt
              }]
        });
        //const completion = response.data.choices[0].message;
        const completion = {
          id: response.data.id,
          created: response.data.created,
          message: response.data.choices[0].message
        }
        console.log('completion: ', completion);
        console.log('response: ', response);
        //console.log('completion: ', completion?.role);
        return res.status(200).json({
          completion: completion,
        });
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    };
  });

  app.get('*', async (req, res, next) => {
    //console.log('req:',req)
    const pageContextInit = {
      urlOriginal: req.originalUrl
    };
    /*
    renderPage form vite-plugin-ssr/server
     */
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;

    if (!httpResponse) return next();

    const { body, statusCode, contentType, earlyHints } = httpResponse;
    if (res.writeEarlyHints) {
      res.writeEarlyHints({
        link: earlyHints.map((e) => e.earlyHintLink)
      });
    };
    res.status(statusCode).type(contentType).send(body);
  })

  app.listen(port);
  console.log(`SERVER STARTED: http://localhost:${ port }`);
};
