import Link from "next/link";
import { client } from "../libs/client";
import styles from "../styles/Home.module.scss";

// microCMSからブログデータを取得
export const getStaticProps = async () => {
  const data = await client.get({ endpoint: "blog" });
  return {
    props: {
      blog: data.contents,
    },
  };
};

export default function Home({ blog }) {
  return (
    <div className={styles.container}>
      {blog.map((blog) => (
        <li className={styles.list} key={blog.id}>
          <Link className={styles.title} href={`blog/${blog.id}`}>
            {blog.title}
          </Link>
          <p className={styles.publishedAtIndex}>記事投稿日：{new Date(blog.publishedAt).toLocaleDateString()}</p>
        </li>
      ))}
    </div>
  );
}