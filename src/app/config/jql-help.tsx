import React from 'react';

type JQLExample = {
  title: string;
  jql: string;
  description: string;
};

const JQL_EXAMPLES: JQLExample[] = [
  {
    title: '按項目搜索',
    jql: 'project = "PROJECT_KEY"',
    description: '替換 PROJECT_KEY 為您的項目代碼，例如 "TES"'
  },
  {
    title: '按項目和狀態搜索',
    jql: 'project = "PROJECT_KEY" AND status = "In Progress"',
    description: '查找特定項目中處於特定狀態的任務'
  },
  {
    title: '分配給我的任務',
    jql: 'assignee = currentUser()',
    description: '查找分配給當前登錄用戶的所有任務'
  },
  {
    title: '最近更新的問題',
    jql: 'updated >= -7d ORDER BY updated DESC',
    description: '過去 7 天內更新的問題，按更新時間降序排序'
  },
  {
    title: '高優先級問題',
    jql: 'priority in (High, Highest)',
    description: '查找所有高優先級或最高優先級的問題'
  },
  {
    title: '按問題類型搜索',
    jql: 'issuetype = Bug',
    description: '查找所有類型為 Bug 的問題'
  }
];

export default function JQLHelp() {
  const copyToClipboard = (jql: string) => {
    navigator.clipboard.writeText(jql);
  };

  return (
    <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg mt-4">
      <h3 className="text-lg font-medium mb-3">JQL 查詢幫助</h3>
      
      <div className="mb-4">
        <p className="text-sm mb-2">JQL (Jira Query Language) 是 Jira 用於搜索問題的特殊查詢語言。以下是一些常見的例子：</p>
      </div>
      
      <div className="space-y-3 mb-4">
        {JQL_EXAMPLES.map((example, index) => (
          <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
            <div className="flex justify-between">
              <h4 className="font-medium">{example.title}</h4>
              <button
                onClick={() => copyToClipboard(example.jql)}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
              >
                複製
              </button>
            </div>
            <code className="block bg-gray-100 dark:bg-gray-800 p-2 my-2 rounded text-sm overflow-x-auto">
              {example.jql}
            </code>
            <p className="text-xs text-gray-600 dark:text-gray-300">{example.description}</p>
          </div>
        ))}
      </div>
      
      <div className="text-sm bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded border-l-4 border-yellow-400">
        <h4 className="font-medium mb-1">JQL 語法注意事項：</h4>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>確保項目名稱、狀態等用雙引號括起來，如 <code className="bg-white px-1">project = "PROJECT_KEY"</code></li>
          <li>條件之間使用 AND、OR 連接，如 <code className="bg-white px-1">project = "ABC" AND status = "Open"</code></li>
          <li>日期格式可以使用相對值，如 <code className="bg-white px-1">created &gt;= -7d</code> (過去7天)</li>
          <li>字符串比較區分大小寫，使用 ~ 進行部分匹配，如 <code className="bg-white px-1">summary ~ "bug"</code></li>
          <li>使用 ORDER BY 排序，如 <code className="bg-white px-1">ORDER BY created DESC</code></li>
        </ul>
      </div>
      
      <div className="mt-4 text-xs text-center">
        <a 
          href="https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          了解更多 JQL 語法 →
        </a>
      </div>
    </div>
  );
} 