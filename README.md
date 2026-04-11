# node-backend

## Getting Started

### 1. Prerequisites
Ensure you have **Docker** and **Docker Compose** installed. You will also need `openssl` to generate the database security key.

### 2. Environment Setup
Create a `.env` file in the root directory:

```bash
APP_PORT=3800
MONGO_CONNECT="mongodb://root:secret@mongodb:27017/mydb?authSource=admin&replicaSet=rs0&directConnection=true"
```
### 3. Generate the key
```
sudo openssl rand -base64 756 > mongodb.key
```

### 3.1 CRITICAL: Set strict permissions (Linux/Mac only)
```
sudo chmod 400 mongodb.key
```
### 4. Launch the Application
```
docker-compose up -d --build
```

### Access MongoDB via CLI (mongosh)

**Inside the MongoDB container:**

```bash
sudo docker-compose exec mongodb mongosh -u root -p secret 
```

### Access MongoDB via Browser (Mongo Express)

Mongo Express provides a web-based interface to view and manage your MongoDB data.

- **Open in browser:** [http://localhost:8082](http://localhost:8082)  
- **Login credentials (Mongo Express UI):**

