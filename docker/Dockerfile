#docker run -d -v "<path>/bitcoinbot/db":/bitcoinbot/db bitcoinbot-slim
FROM node:14-alpine
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh && \
    cd / && \
    git clone --branch dev  https://github.com/letonai/bitcoinbot && \
    cd bitcoinbot && git checkout dev && npm install 

#Telegram API key file (json)
ADD ./apikey.secret /bitcoinbot
ADD ./menu.conf /bitcoinbot

#FROM node:14-alpine

#COPY --from=0 /bitcoinbot /bitcoinbot

ADD ./entrypoint.sh /entrypoint.sh
RUN ["chmod","+x","/entrypoint.sh"]
ENTRYPOINT ["/entrypoint.sh" ]