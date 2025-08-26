FROM ubuntu

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs

COPY dbConfig dbConfig
COPY helpers helpers
COPY meet meet
COPY meetings meetings
COPY models models
COPY users users
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY server.js server.js

RUN npm install

ENTRYPOINT [ "node", "server.js" ]