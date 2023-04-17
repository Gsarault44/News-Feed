import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { Data } from '../api/news-feed';
import Link from 'next/link';

interface articleType {
    urlToImage?: string;
    title?: string;
    author?: string;
    content?: string;
}

const Post: NextPage = () => {

  const router = useRouter()
  const { publishedAt } = router.query
  const [article, setArticle] = useState<articleType>();

  const getArticle = async () => {
    const response = await fetch(
      `/api/news-feed-uk`
    );

    const {articles, status, message} = await response.json();
    console.log(articles)
      // check to see if there are any articles
    if (articles && articles.length > 0) {
      // Filter out the articles to only show the one that matches the query
      articles.filter((article: Data) => 
        article.publishedAt == publishedAt
      )
      // Set the article to the state
      setArticle(
        articles.filter((article: Data) => 
          article.publishedAt == publishedAt
        )[0]
      );
    } else if (status == 'error') {
      console.error(message);
    }
  }


  useEffect(() => {
    getArticle();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Post</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.post}>
        <header className={styles.postHeader}>
          <Link href='/'>Back</Link>
        </header>
        <div className={styles.grid}>
          {article && 
            <div className={styles.postContent}>
              <h1>{article.title}</h1>
              {article.urlToImage && <img src={article.urlToImage} />}
              {article.author && <p>{article.author}</p>}
              {article.content && <div>
                {article.content}
              </div>}
            </div>
          }
        </div>
      </main>
    </div>
  )
}

export default Post