import { client } from "../../libs/client";
import styles from "../../styles/Home.module.scss";
import cheerio from 'cheerio';
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css';

// microCMSからブログデータid毎に取得
export const getStaticProps = async (context) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "blog", contentId: id });

  const $ = cheerio.load(data.body);  // data.contentはmicroCMSから返されるリッチエディタ部
  $('pre code').each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass('hljs');
  });
  data.content = $.html();

  return {
    props: {
      blog: data.content,
    },
  };
};

export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "blog" });

  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return {
    paths,
    fallback: false,
  };
};

export default function BlogId({ blog }) {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{blog.title}</h1>
      <p className={styles.publishedAtDetail}>{blog.publishedAt}</p>
      <div
        dangerouslySetInnerHTML={{ __html: `${blog}` }}
        className={styles.post}
      ></div>
    </main>
  );
}