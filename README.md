# lovelystay_challenge
DevOps Challenge 
- Docker version 20.10.21
- PostgreSQL version psql 15.3
- Node.js version v14.21.3


## Information
This is a simple **JavaScript + Nodejs + PostgreeSQL** based app. **TypeScript was not used in this challenge due to the lack of knowledge on this technology**.
This repository contains:
- **Dockerfile**: File responsible to create the environment with node installed for the app.js;
- **docker-compose.yml**: Manage and create the 2 containers (APP, PostgreeSQL);
- **init.sql**: Create the database schema to store the informations retrieved by the app.js;
- **node**: Folder with the itens needed for the app to be built;
  - app
  - package-lock.json
  - package.json    
- **run.sh**: Simple script to spin-up the containers;
- **wait-for-it.sh**: Simple script used to check the PostgreSQL connectivity (https://github.com/vishnubob/wait-for-it).
  
The infrastructure is simply based in 2 containers, 1 with the app.js and 2 with the PostgreeSQL database.
The container network was created only with the purpose to make easy the communication between the app.js and the database. The network can be seen in the **docker-compose.yml** file.

### Instructions on how to run the app
The **run.sh** script was created to facilitate the environment creation. You just need to execute the **run.sh** script by typing `sh run.sh`, and the script will spin-up the containers and access the **APP** container automatically.
Once you have access the **APP** container, you just need to run `node app.js` with the following parameters:

- **--all**: Display all the users stored in the database (e.g. `node app.js --all`) (the app will show the 2 most used programming languages by the user);
- **-l**: Display the users based on their locations (e.g. `node app.js -l Portugal`);
- **-pl**: Display the users based on their programming languages stored in the databse (e.g. `node app.js -pl Python`).

Examples: `node app.js <username>` to add a user, `node app.js -l <location>` to display a user by location and `node app.js -pl` to display a user by the programming language.

  ### NOTE:
  The app is responsive to some situations:
  - It doesn't add a user that was already added;
  - It will ask to add a parameter if you only run `node app.js`;
  - It will display **no users** if the database is empty after running `node app.js --all`;
  - It will display **Please add a location** if the location is empty `node app.js -l`;
  - It will display **Please insert a programming language** if no programming language is passed e.g. `node app.js -pl`
  - It will not add a user that doesn't exists in Github. 


