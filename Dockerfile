FROM node:18-alpine as ts-build
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json /app
COPY --from=ts-build /app/dist /app/dist
RUN npm install --omit=dev 
CMD npm start