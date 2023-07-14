#!/bi/bash

#Run docker-compose up -d 
docker-compose up -d

#get the container ID of the app container
container_id=$(docker ps --filter "name=app" --format "{{.ID}}")

# Display the container ID
echo "Container ID: $container_id"
# clear screen
clear
#Display message
echo ""
echo "Connecting to the APP Container"
echo ""
# Run docker exec command to start an interactive shell inside the container
docker exec -it "$container_id" bash
