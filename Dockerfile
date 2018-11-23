FROM node:latest
RUN npm install -g sails
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
ENTRYPOINT ["sails"]

# Expose API port to the outside
EXPOSE 1337

# Launch application
CMD ["lift", "--prod"]