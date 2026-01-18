import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const ARTICLES_DIR = path.join(process.cwd(), "articles");

const parseMarkdownArticle = (filename) => {
  const filePath = path.join(ARTICLES_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");

  const { data, content } = matter(raw);

  const date = new Date(data.date);
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    id: data.id ?? "",
    title: data.title ?? "",
    author: data.author ?? "",
    date: formatted ?? "",
    description: data.description ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    image: data.image ?? "",
    content: marked(content),
  };
};

export const getAllArticles = () => {
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".md"));

  return files.map(parseMarkdownArticle);
};
