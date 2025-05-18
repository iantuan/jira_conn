export interface JiraPage {
  id: string;
  title: string;
  description: string | null;
  jql: string;
  type: 'issue' | 'epic' | 'gantt';
  columns: string | null;
  sortBy: string | null;
  sortOrder: string | null;
  ownerId: string | null;
  groupId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JiraPageGroup {
  id: string;
  name: string;
  description: string | null;
  order: number;
  pages?: JiraPage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  pages: JiraPage[];
  groups?: JiraPageGroup[];
}

interface JiraPriority {
  self?: string;
  iconUrl?: string;
  name: string;
  id: string;
}

export interface JiraFields {
  summary: string;
  status: {
    name: string;
    iconUrl?: string;
    statusCategory?: {
      key: string;
      name: string;
    }
  };
  assignee?: {
    displayName: string;
    emailAddress: string;
    avatarUrls?: {
      [key: string]: string;
    };
  };
  reporter?: {
    displayName: string;
    emailAddress?: string;
    avatarUrls?: {
      [key: string]: string;
    };
  };
  priority?: JiraPriority | string;
  issuetype: {
    name: string;
    iconUrl: string;
    description?: string;
  };
  created: string;
  updated: string;
  description?: string;
  project?: {
    key: string;
    name: string;
  };
  labels?: string[];
  components?: Array<{
    id: string;
    name: string;
  }>;
  comment?: {
    comments: Array<{
      id: string;
      author: {
        displayName: string;
        avatarUrls?: {
          [key: string]: string;
        };
      };
      body: string;
      created: string;
      updated: string;
    }>;
    total: number;
  };
  [key: string]: any;
}

export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: JiraFields;
  renderedFields?: {
    description?: string;
    comment?: {
      comments: Array<{
        body: string;
      }>;
    };
  };
}

export interface JiraSearchResult {
  issues: JiraIssue[];
  total: number;
  maxResults: number;
  startAt: number;
  names?: {
    [key: string]: string;
  };
  schema?: {
    [key: string]: {
      type: string;
      system?: string;
      custom?: string;
    };
  };
} 