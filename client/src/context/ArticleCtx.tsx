import { useState, createContext } from 'react';

interface ArticleContextValue {
  articleId: string | undefined;
  setArticleId: (articleId: string) => void;
}

export const ArticleCtx = createContext<ArticleContextValue>({
  articleId: undefined,
  setArticleId: () => {},
});

export const ArticleCtxProvider = ({ children }: any) => {
  const [articleId, setArticleId] = useState<string>();

  return <ArticleCtx.Provider value={{ articleId, setArticleId }}>{children}</ArticleCtx.Provider>;
};
