FROM node:18.11.0-alpine3.16

RUN apk --update add tini curl

USER node

WORKDIR /home/node

COPY --chown=node:node ./back/dist/            /home/node
COPY --chown=node:node ./back/node_modules     /home/node/node_modules
COPY --chown=node:node ./front/build/          /home/node/public

EXPOSE 8080

ENTRYPOINT ["tini", "--"]

CMD [ "node", "main.js" ]