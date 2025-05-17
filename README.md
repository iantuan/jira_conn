# Jira Dashboard

A customizable Jira dashboard that allows you to create multiple pages with different JQL queries to visualize your Jira data.

## Features

- Configure Jira connection with your Atlassian account credentials
- Create multiple dashboard pages with custom JQL queries
- View Jira issues in a clean, responsive interface
- View detailed information about individual issues
- Pagination for large result sets

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Jira account with API access

### Installation

#### Method 1: Local Development

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. 創建.env文件在項目根目錄（或複製.env.example）:

```
# 數據庫連接
DATABASE_URL="file:./prisma/db/database.db"

# NextAuth配置
NEXTAUTH_SECRET="your-strong-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Start the development server:

```bash
npm run dev
```

初次運行時，系統會自動:
- 創建prisma/db目錄
- 初始化SQLite數據庫
- 創建管理員用戶 (用戶名: administrator, 密碼: administrator)

5. Open [http://localhost:3000](http://localhost:3000) in your browser

#### Method 2: Using Docker (Recommended for Production)

##### Prerequisites
- Docker and Docker Compose installed on your system

##### Using Docker Compose (recommended)

1. **重要**: 在 `docker-compose.yml` 中設置安全的 `NEXTAUTH_SECRET`
   ```yaml
   environment:
     - NEXTAUTH_SECRET=your-strong-secret-key-here  # 修改為安全的隨機字串
   ```

2. 使用提供的腳本构建並啟動容器:
   ```bash
   chmod +x run.sh
   ./run.sh
   ```
   
   此腳本將自動檢測您的服務器IP並設置環境變量，然後啟動容器。

3. 或者手動設置SERVER_IP並啟動:
   ```bash
   export SERVER_IP=$(hostname -I | awk '{print $1}')
   docker compose up -d
   ```

4. View logs:
   ```bash
   docker compose logs -f
   ```

5. Stop the container:
   ```bash
   docker compose down
   ```

##### Using Docker Commands

1. Build the Docker image:
   ```bash
   docker build -t jira_conn .
   ```

2. Run the container:
   ```bash
   # 設置服務器IP
   export SERVER_IP=$(hostname -I | awk '{print $1}')
   
   docker run -d -p 3000:3000 \
     -e NEXTAUTH_SECRET=your-strong-secret-key-here \
     -e NEXTAUTH_URL=http://${SERVER_IP}:3000 \
     -e SERVER_IP=${SERVER_IP} \
     -v jira_data:/app/data \
     --name jira_conn jira_conn
   ```

##### Default Admin User

The Docker container is initialized with a default administrator account:
- Username: `administrator`
- Password: `administrator`

**Important**: For production use, it's recommended to change the default administrator password after first login.

##### Database Persistence

The database is stored in a Docker volume called `jira_data` to ensure data persistence across container restarts.

## Configuration

1. Go to the Configuration page
2. Enter your Jira base URL (e.g., `https://your-domain.atlassian.net`)
3. Enter your email address associated with your Jira account
4. Create an API token from your Atlassian account settings
5. Click "Test Connection" to verify your credentials
6. Add dashboard pages with custom JQL queries

## JQL Examples

Here are some example JQL queries you can use:

- Tasks assigned to me: `assignee = currentUser() AND status != Done ORDER BY priority DESC`
- Recent issues: `created >= -7d ORDER BY created DESC`
- High priority bugs: `issuetype = Bug AND priority in (High, Highest) ORDER BY updated DESC`
- Upcoming tasks: `status = "To Do" AND sprint in openSprints() ORDER BY priority DESC`

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Jotai for state management
- SWR for data fetching
- Axios for API calls

## License

MIT
