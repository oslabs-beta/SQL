Made a db file. If you want to use pool make sure to import properly.

Ideally you should import this into the models file as the logic is managed there. While the controller manages the handling of requests.

import { pool } from '../db/db.ts';

Models Folder (Database Interaction)
Controller Folder (Request Handling)
Routes Folder (Mapping Endpoints to controllers)

To get access to our types folder from controller, or models we need to import it properly:
import { (name of type or interface you are trying to import) } from '../../types/types.ts';

Docker

Steps to create container:

1. Build the Docker Image:
   docker build -t <image_name>:<tag> .
   Example:
   docker build -t my-server -f server/Dockerfile .

2. Verify the Image was build:
   docker images

3. Create and Start a New Container
   docker run -p <host_port>:<container_port> --name <container_name>
   Example:
   docker run -p 4002:4001 my-server

To find containe ID or name:
docker ps

To stop container:
docker stop <container_name> or docker stop <container_id>
To find out name of container user docker ps.

Optional remove container after stopping it:
docker rm <container_name> or docker rm <container_id>
To find out name of container user docker ps.
