// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562
import express from 'express'
import compression from 'compression'
import { renderPage } from 'vite-plugin-ssr/server'
import { rootPath } from './root.js'
import { ChatCompletionRequestMessage, OpenAIApi } from 'openai';
import { COMPLETION_SETTINGS, CHATMODEL, PORT, MODEL, ISPRODUCTION, CONFIGURATION, completionModel} from './utils.js';

startServer()

async function startServer() {
  const openai = new OpenAIApi(CONFIGURATION);

  const app = express();
  app.use(compression());

  if (ISPRODUCTION) {
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

  app.post('/completion', async(req, res, next) => {
    const text = req.query.text;
    const isUserAuthorized = req.query.isUserAuthorized;
    const prompt = `${ text }`;

    try {
      if (isUserAuthorized && COMPLETION_SETTINGS) {
        if (prompt === null) {
          console.log('no prompt provided');
          return;
        }
        const response = await openai.createCompletion({
          model: MODEL!,
          prompt: prompt,
          ...COMPLETION_SETTINGS
        });
        const completion = response.data.choices[0].text;
        //console.log('completion: ', completion);
        return res.status(200).json({
          message: completion
        });
      }
    } catch (err: any) {
      console.log(err);
    }
  });

  app.post('/chat-completion', async(req, res, next) => {
    const text = req.query.text;
    const isUserAuthorized = req.query.isUserAuthorized;
    const chatContext = req.query.chatContext;
    console.log('chatContext: ', chatContext);
    const prompt = `${ text }`;

    try {
      if (isUserAuthorized && COMPLETION_SETTINGS) {
        if (prompt === null) {
          console.log('no prompt provided');
          return;
        }
        const response = await openai.createChatCompletion({
          model: CHATMODEL!,
          ...COMPLETION_SETTINGS,
          messages: chatContext as []
        });

        const completion = completionModel(response);
        //console.log('chat message: ', completion.message?.content);
        return res.status(200).json({
          completion: completion,
        });
      }
    } catch (err: any) {
        console.log(err);
    }
  })

  app.get('/chat/sessionStatus', async(req, res, next) => {
    const sessionStatus =  req.query.sessionStatus;
    return res.status(200).json({
      isSessionOpen: sessionStatus
    });
  });

  app.get('*', async (req, res, next) => {
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

  app.listen(PORT);
  console.log(`SERVER STARTED: http://localhost:${ PORT }`);
};
