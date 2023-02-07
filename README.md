# Server Repository

## Requirements
- Node.js
- Docker (running)

## Setup
1. Create a `.env` file in the root of the repository with the following entries: 

`DATABASE_URL="postgres://user:password@database:5432/ff?schema=public"
PORT=3007`

2. If the connection to the database fails, exchange `database` for the IP address of the Docker Postgres instance (i.e. `172.1.0.2`, run 
`docker ps -q | xargs -n 1 docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}} {{ .Name }}' | sed 's/ \// /'`
to find out what IP the instance is running on).
3. In the root of the repository, run `yarn install`
4. Start the server with the following command: `yarn start`
5. From the Docker terminal of the server, run `yarn initdb` to initialize the database and seed it with the data. (Access the docker terminal from Docker Desktop or your terminal -> run `docker exec -it "hash of the docker instance" sh`)


## Troubleshooting
If you encounter any issues while setting up the environment or running the server, please feel free to reach out.

## If I had more time I would..
1. Refactor the seed script for easier testing and readability
2. When seeding the database, put in the transactions sorted by date
3. Optimize the graphql query to improve pagination performance
4. Write tests for the resolvers
5. Optimize the Dockerfile to automate more of the setup