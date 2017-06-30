FROM node
MAINTAINER Dario Diaz <darioo.diaz1@gmail.com>
EXPOSE 3000
WORKDIR /backend
CMD ["node", "./server.js"]