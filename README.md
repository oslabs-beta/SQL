Made a db file. If you want to use pool make sure to import properly.

Ideally you should import this into the models file as the logic is managed there. While the controller manages the handling of requests.

import { pool } from '../db/db.ts';

Models Folder (Database Interaction)
Controller Folder (Request Handling)
Routes Folder (Mapping Endpoints to controllers)
