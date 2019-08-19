FROM node:8

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update && apt-get -y upgrade

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY package*.json ./

RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install

COPY . .

# Bundle app source
RUN cd prisma

RUN cd ..

EXPOSE 4000

CMD ["ts-node", "./src/index"]