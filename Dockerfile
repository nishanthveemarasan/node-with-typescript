# Dockerfile

# base image
FROM node:latest

WORKDIR /usr/src/app

# copy source files
COPY . /usr/src/app

#RUN groupadd -g 1001 www
#RUN useradd -u 1001 -ms /bin/bash -g www www

#COPY --chown=www:www . /usr/src/app

USER node

# install dependencies
#RUN npm install

# start app
# RUN npm run build
EXPOSE 3000


#CMD ["npm", "start"]