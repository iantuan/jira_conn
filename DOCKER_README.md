# Docker Setup for Jira Connection App

## Prerequisites
- Docker and Docker Compose installed on your system

## Building and Running the Docker Container

### Using Docker Compose (recommended)

1. **重要**: 在 `docker-compose.yml` 中設置安全的 `NEXTAUTH_SECRET`
   ```yaml
   environment:
     - NEXTAUTH_SECRET=your-strong-secret-key-here  # 修改為安全的隨機字串
   ```

2. Build and start the container:
   ```bash
   docker-compose up -d
   ```

3. View logs:
   ```bash
   docker-compose logs -f
   ```

4. Stop the container:
   ```bash
   docker-compose down
   ```

### Using Docker Commands

1. Build the Docker image:
   ```bash
   docker build -t jira_conn .
   ```

2. Run the container:
   ```bash
   docker run -d -p 3000:3000 \
     -e NEXTAUTH_SECRET=your-strong-secret-key-here \
     -e NEXTAUTH_URL=http://localhost:3000 \
     -v jira_data:/app/data \
     --name jira_conn jira_conn
   ```

3. Stop the container:
   ```bash
   docker stop jira_conn
   ```

## 環境變數說明

| 變數名稱 | 描述 | 必要性 |
|---------|------|-------|
| `DATABASE_URL` | 資料庫連線字串 | 必要 |
| `NEXTAUTH_SECRET` | 用於加密 JWT 的密鑰 | 必要 |
| `NEXTAUTH_URL` | 應用的完整 URL | 必要 |

## 問題排解指南

如果遇到建置失敗，請嘗試以下步驟：

1. 清除 Docker 快取：
   ```bash
   docker system prune -a
   ```

2. 重建映像：
   ```bash
   docker-compose build --no-cache
   ```

3. 若出現 `authOptions` 相關錯誤，檢查是否所有 API 路由都已更新為從 `@/lib/auth` 導入。

## Default Admin User

The application is initialized with a default administrator account:
- Username: `administrator`
- Password: `administrator`

**Important**: For production use, it's recommended to change the default administrator password after first login.

## Database Persistence

The database is stored in a Docker volume called `jira_data` to ensure data persistence across container restarts.

## Accessing the Application

Once the container is running, you can access the application at:
```
http://localhost:3000
``` 