Docker quickstart for Placement Portal

Prerequisites
- Docker Desktop installed
- (Optional) Docker Compose v2

Build and run (development-friendly)

1. From the project root, build and start containers:

```powershell
docker-compose up --build
```

2. Or run detached:

```powershell
docker-compose up --build -d
```

3. Check logs for backend and mongo:

```powershell
docker-compose logs -f backend
docker-compose logs -f mongo
```

Notes and tips
- The backend service reads MONGO_URL from environment (set in compose to mongodb://mongo:27017/PlacementPortal).
- The compose file mounts the project into the container for easy development. A named volume `node_modules_backend` preserves the container's node_modules installed during image build.
- If you change dependencies, rebuild the image:

```powershell
docker-compose build --no-cache backend
```
