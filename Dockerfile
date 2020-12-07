
FROM node:alpine
COPY . .
RUN npm install
RUN npm install -g typescript

CMD npm run dev
EXPOSE 3000