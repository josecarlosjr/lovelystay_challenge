#use the official node.js image as the base image
FROM node:14
#copy package.json and package-lock.json to the container
COPY node/package*.json node/app.js /app/
#copy the wait-for-it script to the container
COPY wait-for-it.sh /usr/local/bin/
#set working directory in the container
WORKDIR /app
#install the dependencies
RUN npm install
#RUN apt update
#RUN apt install postgresql-client -y
#copy the rest of the application files
COPY . /app
#expose the port 300 for the node.js app
EXPOSE 3000
#execution permission fo wait-for-it script
CMD ["chmod", "+x", "/usr/local/bin/wait-for-it.sh"]
#make sure the postgree database is up and running
CMD ["/usr/local/bin/wait-for-it.sh", "-t", "30", "192.168.254.10:5432"]
#Loop for the container not go to Exited state
CMD ["tail", "-f", "/dev/null"]
