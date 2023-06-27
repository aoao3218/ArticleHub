import { diff_match_patch, patch_obj, DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL, Diff } from 'diff-match-patch';
import articles from '../models/article.js';
import versions from '../models/version.js';
import { ValidationError } from './errorHandler.js';
const dmp = new diff_match_patch();

export async function getPatches(articleId: string, branch: string, story: string) {
  const article = await articles.findOne({ article_id: articleId, branch });
  if (article) {
    const text = dmp.patch_apply(article.history.flat() as patch_obj[], article.story as string)[0];
    const patches = dmp.patch_make(text, story);
    return patches;
  } else {
    const articleMain = await articles.findOne({ article_id: articleId, branch: 'main' });
    const articleBranch = await versions.findOne({ article_id: articleId, branch });
    if (!articleBranch) {
      const mainStory = dmp.patch_apply(articleMain?.history.flat() as patch_obj[], articleMain?.story as string)[0];
      const patches = dmp.patch_make(mainStory, story);
      return patches;
    }
    const previousIndex = articleBranch?.previous_index;
    const mainHistory = articleMain?.history.slice(0, previousIndex);
    const history = [...(mainHistory?.flat() as patch_obj[]), ...(articleBranch?.history.flat() as patch_obj[])];
    const branchStory = dmp.patch_apply(history as patch_obj[], articleMain?.story as string)[0];
    const patches = dmp.patch_make(branchStory, story);
    return patches;
  }
}

export async function getStory(articleId: string, branch: string, number: string) {
  const article = await articles.findOne({ article_id: articleId, branch });
  const version = !Number.isNaN(parseInt(number, 10)) ? parseInt(number, 10) : article?.history.length;
  if (article) {
    const title = article.title;
    const historySlice = article.history.slice(0, version);
    const history = historySlice.flat();
    const story = dmp.patch_apply(history as patch_obj[], article?.story as string)[0];
    return { title, story };
  } else {
    const articleMain = await articles.findOne({ article_id: articleId, branch: 'main' });
    const articleBranch = await versions.findOne({ article_id: articleId, branch });
    const title = articleMain?.title;
    if (!articleBranch) {
      const story = dmp.patch_apply(articleMain?.history.flat() as patch_obj[], articleMain?.story as string)[0];
      return { title, story };
    }
    const previousIndex = articleBranch?.previous_index;
    const mainHistory = articleMain?.history.slice(0, previousIndex);
    const branchHistory = articleBranch?.history.slice(0, version);
    const history = [...(mainHistory?.flat() as patch_obj[]), ...(branchHistory.flat() as patch_obj[])];
    const story = dmp.patch_apply(history as patch_obj[], articleMain?.story as string)[0];
    return { title, story };
  }
}

function differentText(main: string, branch: string) {
  const diffs = dmp.diff_main(main, branch);
  dmp.diff_cleanupSemantic(diffs);
  console.log(diffs);

  let diffText = '';
  for (const [op, data] of diffs) {
    if (op === DIFF_DELETE) {
      diffText += `[-${data}-]`;
    } else if (op === DIFF_INSERT) {
      diffText += `[+${data}+]`;
    } else if (op === DIFF_EQUAL) {
      diffText += data;
    }
  }
  return diffText;
}

export async function getCompare(articleId: string, branch: string) {
  const [article] = await articles.aggregate([
    {
      $match: {
        $or: [
          { article_id: articleId, branch },
          { article_id: articleId, branch: 'main' },
        ],
      },
    },
    {
      $lookup: {
        from: 'versions',
        localField: 'article_id',
        foreignField: 'article_id',
        as: 'versions',
      },
    },
  ]);
  const title = article.title;
  const mainStory = dmp.patch_apply(article.history.flat() as patch_obj[], article.story as string)[0];
  const branchHistory = article.versions[0].history;
  if (!branchHistory) {
    const diffText = await differentText('', mainStory);
    return { title, story: diffText };
  }
  const previousIndex = article.versions[0].previous_index;
  const mainHistory = article.history.slice(0, previousIndex) as patch_obj[];
  const history = [...mainHistory.flat(), ...branchHistory.flat()];
  const branchStory = dmp.patch_apply(history as patch_obj[], article.story as string)[0];
  console.log(mainStory);
  console.log(branchStory);
  const diffText = await differentText(mainStory, branchStory);
  return { title, story: diffText };
}

interface Article {
  _id: string;
  project_id: string;
  article_id: string;
  title: string;
  story: string;
  branch: string;
  history: HistoryEntry[][];
  previous_index: null;
  __v: number;
  versions: {
    _id: string;
    article_id: string;
    branch: string;
    history: {
      diffs: [number, string][];
      start1: number;
      start2: number;
      length1: number;
      length2: number;
    }[];
    previous_index: number;
    __v: number;
  }[];
}

interface HistoryEntry {
  diffs: [number, string][];
  start1: number;
  start2: number;
  length1: number;
  length2: number;
}

export async function updateStory(article: Article) {
  const mainStory = dmp.patch_apply(article.history.flat() as patch_obj[], article.story as string)[0];
  const branchHistory = article.versions[0].history;
  const previousIndex = article.versions[0].previous_index;
  const mainHistory = article.history.slice(0, previousIndex);
  const history = [...mainHistory.flat(), ...branchHistory.flat()];
  const branchStory = dmp.patch_apply(history as patch_obj[], article.story as string)[0];
  const diffs = dmp.diff_main(mainStory, branchStory);
  dmp.diff_cleanupSemantic(diffs);
  // diffs.forEach(([value, text]) => {
  //   const newValue = value == -1 ? 0 : value;
  //   return [newValue, text];
  // });
  console.log(diffs);
  let diffText = '';
  for (const [op, data] of diffs) {
    diffText += data;
  }
  console.log(diffText);
  const patches = dmp.patch_make(branchStory, diffText);
  return patches;
}

export async function mergeStory(article: Article) {
  const mainStory = dmp.patch_apply(article.history.flat() as patch_obj[], article.story as string)[0];
  const branchHistory = article.versions[0].history;
  const previousIndex = article.versions[0].previous_index;
  const mainHistory = article.history.slice(0, previousIndex);
  const history = [...mainHistory.flat(), ...branchHistory.flat()];
  const branchStory = dmp.patch_apply(history as patch_obj[], article.story as string)[0];
  const patches = dmp.patch_make(mainStory, branchStory);
  return patches;
}
