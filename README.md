# GCcollab-API-demo

## Querying

### Examples

#### Get users and the groups they belong to

```

query GetUserGroups {
  users {
    id
    groupsJoined {
      name
    }
  }
}

```

### From python

See `python_query.py` in the examples folder.

## Local instalation/deployment

```
npm install -g prisma@1.31.2
docker-compose up # sudo if running on linux
cd prisma
prisma deploy
```

## Kubernetes deployment

Deployment in kubernetes is done in 3 main chunks:
- A Postgres deployment which in our case is using a persistent volume
- A Prisma pod which containing the management api + rest of prisma (this is using 1.31.x)
- A graphql server (graphql yoga)

Each of these has their own service for communication within the cluster with only the graphql server being exposed to the outside via an `ingress.yaml` file which uses our nginx configuration.

Once all of these are deployment and some form of config file is specifying the individual endpoints, you can go ahead and deploy your datamodel using kubernetes jobs.

### Building the containers

The prisma-helper:

```
docker build -t addyvan/prisma-helper:latest . -f Dockerfile_jobs
```

The graphql server:

```
docker build -t addyvan/collab-api-demo:latest .
```

#### Note: Prisma operations extra requirements

In order to perfrom prisma cli operations the active pod requires the `PRISMA_MANAGEMENT_API_SECRET` environment variable.

