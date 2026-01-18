import express from "express";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import { getAllArticles } from "./utils/getArticles.js";
import { getPaginationRange } from "./utils/getPaginationRange.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "simple-blog-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// setup view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  const articles = getAllArticles();

  const sortedArticles = articles.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const limit = 6;
  const totalPages = Math.max(1, Math.ceil(sortedArticles.length / limit));

  let page = parseInt(req.query.page);

  if (isNaN(page) || page < 1) {
    return res.redirect("/?page=1");
  }

  if (page > totalPages) {
    return res.redirect(`/?page=${totalPages}`);
  }

  const start = (page - 1) * limit;
  const paginatedArticles = sortedArticles.slice(start, start + limit);

  const pagination = getPaginationRange(page, totalPages);

  res.render("index", {
    articles: paginatedArticles,
    pagination,
    currentPage: page,
    totalPages,
  });
});

app.get("/post/:id", (req, res) => {
  const { id } = req.params;

  const article = getAllArticles().find((a) => a.id == id);

  if (!article) {
    return res.status(404).render("404");
  }

  res.render("post", { article });
});
