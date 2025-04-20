#!/bin/bash
# This script builds the frontend and backend of the PeopleMap application.
# First it builds the Java backend with Maven, then makes a creates a docker image for that file then builds the backend using Maven.  
echo "Building JAR for backend..."

cd backend
./mvnw package && java -jar target/peoplemap-0.1.0.jar