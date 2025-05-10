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

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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
