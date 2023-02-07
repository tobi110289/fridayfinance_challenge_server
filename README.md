# Server Repository

## Requirements
- Node.js
- Docker (running)

## Setup
1. Create a `.env` file in the root of the repository with the following entries: 

DATABASE_URL="postgres://<user>:<password>@database:5432/ff?schema=public"
PORT=3007

2. If the connection to the database fails, exchange `database` for the IP address of the Docker Postgres instance (i.e. `172.1.0.2`).
3. In the root of the repository, run `yarn install`
4. Start the server with the following command: `yarn start`
5. From the Docker terminal of the server, run `yarn initdb` to initialize the database and seed it with the data.


Troubleshooting
If you encounter any issues while setting up the environment or running the server, please feel free to reach out.
