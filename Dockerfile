FROM redis
CMD ["redis-server"]


FROM node:18
WORKDIR /usr/app
COPY server server
RUN cd server && npm update && npm install && npm run build
COPY server/.env server/dist/.env
RUN echo "REDIS_HOST=172.17.0.2" >> .env
COPY client client
RUN cd client && npm update && npm install && npm run build
WORKDIR /usr/app/server/dist
CMD ["node", "index.js"]
