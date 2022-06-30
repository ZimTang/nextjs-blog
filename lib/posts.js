import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  const dirs = fs.readdirSync(postsDirectory);
  const allPostsData = [];
  // 遍历posts文件夹中的文件夹
  dirs.forEach((dir) => {
    const fileNames = fs.readdirSync(path.resolve(postsDirectory, dir));

    // 遍历文件夹
    fileNames.forEach((fileName) => {
      const id = dir + "-" + fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, dir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const matterResult = matter(fileContents);

      allPostsData.push({
        id,
        ...matterResult.data,
      });
    });
  });

  // 通过时间进行排序
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// 返回路由路径
export function getAllPostIds() {
  const dirs = fs.readdirSync(postsDirectory);
  const res = [];
  dirs.forEach((dir) => {
    const fileNames = fs.readdirSync(path.resolve(postsDirectory, dir));
    fileNames.forEach((fileName) => {
      res.push({
        params: {
          id: dir + "-" + fileName.replace(/\.md$/, ""),
        },
      });
    });
  });
  return res;
}

export async function getPostData(id) {
  const [dir, fileName] = id.split("-");
  const fullPath = path.join(postsDirectory, dir, `${fileName}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // 将头部和内容分开
  const matterResult = matter(fileContents);

  // 解析成html
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // 返回
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
