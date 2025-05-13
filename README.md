# People Map
This app represents a visualizer of all the people you are connected with. Social media represents this only through\
number; we wanted to remind people of what that looked like as this is easily forgettable.

## Team members
### Julian Soriano : Started with a figma design, and built the app around that. Implemented the backend with Java Springboot, frontend with React, database with PostgreSQL, and the logic of the app.
### Nathan Brown : Dockerized the app

## How to run
This app uses PostgreSQL, React, and Java Spring Boot, and was developed using VSCode.\
After installing the required, to run:\
cd into 'backend' and run './mvnw spring-boot:run' to start the backend\
cd into 'frontend' and run 'npm run dev' to start the frontend\
If any errors persist, it may be because you need to run 'npm install...' as our app mostly uses 'react force graph 2d'

## Features implemented
-Has a nice bootup for first time users that walks you through typical user flow.\
-Has a '+' button to add people you know and connect to their nodes.\
-Has a '-' button to remove people you are connected to.\
-Saves the current graph info (names, connections) in Postgres database

## Future work
-Add in a feature to save the data that a user enters after closing and opening the app.\
-Currently, doesn't have a userbase, or a login system.\
-Adding a person that is already in the database should show all the nodes they are associated, and\
the user can choose to add connections to those nodes, or ignore them.\
-Show the user the nodes that they are connected to (the names that they specifically add) and differentiate between\
the nodes that their added is associated with.\
-Hosting

## Known issues
-The app also does not have a login feature yet, so it does not save any\
of the names added which is not intended.
