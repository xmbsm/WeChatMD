export interface Article {
  id: string;
  title: string;
  content: string;
  themeId: string;
  createdAt: number;
  updatedAt: number;
}

const ARTICLES_STORAGE_KEY = 'wechat-articles';

export function loadArticles(): Article[] {
  try {
    const saved = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load articles:', e);
  }
  return [];
}

export function saveArticles(articles: Article[]) {
  try {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('Failed to save articles:', e);
  }
}

export function createArticle(title: string = '新文章', themeId: string = 'default'): Article {
  const now = Date.now();
  return {
    id: `article-${now}`,
    title,
    content: '',
    themeId,
    createdAt: now,
    updatedAt: now
  };
}

export function updateArticle(articles: Article[], articleId: string, updates: Partial<Article>): Article[] {
  return articles.map(article => {
    if (article.id === articleId) {
      return {
        ...article,
        ...updates,
        updatedAt: Date.now()
      };
    }
    return article;
  });
}

export function deleteArticle(articles: Article[], articleId: string): Article[] {
  return articles.filter(article => article.id !== articleId);
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}
