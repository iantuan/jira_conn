import { atom } from 'jotai';
// import { atomWithStorage } from 'jotai/utils'; // No longer using atomWithStorage for jiraConfigAtom
import { JiraConfig, JiraPage, JiraPageGroup } from '@/types/jira'; // Keep these client-side types for now
import { JiraPageConfig, JiraPageGroup as PrismaJiraPageGroup, JiraConnectionSetting } from '@/generated/prisma'; // For data from API

// Default empty configuration for the client-side atom
const defaultClientConfig: JiraConfig = {
  baseUrl: '',
  email: '',
  apiToken: '', // This will effectively store the token fetched for client-side operations or indicate presence
  pages: [],
  groups: []
};

// This atom will now be populated from API data via SWR hooks in the ConfigPage or a global initializer.
// It serves as the client-side representation that other components might depend on.
// The apiToken field in this client-side atom should be handled with extreme care.
// For calls to /api/jira, the API token will be fetched server-side in that route handler.
export const jiraConfigAtom = atom<JiraConfig>(defaultClientConfig);

// Atom to store the raw API response for JIRA connection settings (excluding token)
export const jiraConnectionApiAtom = atom<Partial<JiraConnectionSetting & { hasApiToken: boolean }>>({});

// Atom to store the raw API response for JIRA page configurations
export const jiraPagesApiAtom = atom<JiraPageConfig[]>([]);

// Atom to store the raw API response for JIRA page groups
export const jiraPageGroupsApiAtom = atom<PrismaJiraPageGroup[]>([]);

// Current selected page ID (can remain as is, managed by client)
export const currentPageIdAtom = atom<string | null>(null); // Kept atomWithStorage for user selection persistence
// If you want to remove localStorage for currentPageId as well:
// export const currentPageIdAtom = atom<string | null>(null);


// Derived atom for the current page details (based on currentPageId and API-fetched pages)
export const currentPageAtom = atom((get) => {
  const pagesFromApi = get(jiraPagesApiAtom); // Use pages fetched from API
  const currentId = get(currentPageIdAtom);
  
  if (!currentId || !pagesFromApi.length) return null;
  
  const foundPage = pagesFromApi.find(page => page.id === currentId);
  if (!foundPage) return null;

  // Map JiraPageConfig (from DB) to JiraPage (client-side type if different)
  // For now, assume they are compatible enough or types/jira.ts JiraPage is adapted.
  return {
    id: foundPage.id,
    title: foundPage.title,
    description: foundPage.description || '',
    jql: foundPage.jql,
    type: foundPage.type as 'issue' | 'epic',
    columns: foundPage.columns,
    sortBy: foundPage.sortBy || null,
    sortOrder: foundPage.sortOrder || null,
    ownerId: foundPage.ownerId || null,
    createdAt: foundPage.createdAt,
    updatedAt: foundPage.updatedAt
  } as JiraPage; // Cast to client-side JiraPage type
});

// searchParamsAtom can remain as is, it's a client-side UI state
export const searchParamsAtom = atom<{
  startAt: number;
  maxResults: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}>({
  startAt: 0,
  maxResults: 20
}); 