FROM node:11.8

WORKDIR /usr/src/frontend

COPY package*.json ./

RUN npm ci

COPY . .

ARG PORT=3000
ENV PORT $PORT

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG API_URL=https://api-staging.opencollective.com
ENV API_URL $API_URL

ARG WEBSITE_URL=https://staging.opencollective.com
ENV WEBSITE_URL $WEBSITE_URL

ARG INVOICES_URL=https://invoices-staging.opencollective.com
ENV INVOICES_URL $INVOICES_URL

ARG API_KEY=09u624Pc9F47zoGLlkg1TBSbOl2ydSAq
ENV API_KEY $API_KEY

# Copy fonts and update fonts cache
RUN cp public/fonts/* /usr/share/fonts/
RUN fc-cache -f -v
RUN fc-list

# Show the phantom version, may be useful if we need to debug a production issue
RUN ./node_modules/phantomjs-prebuilt/bin/phantomjs --version

RUN npm run build

EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]
