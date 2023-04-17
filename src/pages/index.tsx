import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { Data } from './api/news-feed';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(Array);
  const [staticArticlesList, setStaticArticles] = useState([]);
  const [menuState, setMenuState] = useState(false);
  const [categoryType, setCategoryType] = useState(false);
  const [location, setLocation] = useState("United States");


  // Get the categoreis based on source or author depending on API data avaiable.
  const getCategories = (articles: any) => {
    const cats: string[] = []
    articles.map((article: Data) => {
      categoryType ? cats.push(article.author) : cats.push(article.source.name)
    });
    // Filter out the duplicates
    const newCats = Array.from(new Set(cats))
    // Push categories to an array in state
    setCategories(newCats);
  }
  
  // Get the artices from the United State API
  const getArticles = async () => {
    const response = await fetch(
      `/api/news-feed`
      );
    const {articles, status, message} = await response.json();
    if (articles && articles.length > 0) {
      setArticles(articles);
    } else if (status == 'error') {
      console.error(message);
    }
    setCategoryType(false);
    setStaticArticles(articles);
    getCategories(articles);
    setLocation("United States");
  }

  // Get the articles from the Great Britain API 
  const getUkArticles = async () => {
    const response = await fetch(
      `/api/news-feed-uk`
      );
    const {articles, status, message} = await response.json();
    if (articles && articles.length > 0) {
      setArticles(articles);
    } else if (status == 'error') {
      console.error(message);
    }
    setCategoryType(true);
    setStaticArticles(articles);
    getCategories(articles);
    setLocation("Great Britain");
  }

  // filter articles by title based on text input 
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>{
    const results = staticArticlesList.filter((post: Data) => {
      if (event.target.value === "") return articles
        return post.title.toLowerCase().includes(event.target.value.toLowerCase())
    })
    if (event.target.value.length === 0) {
      getArticles();  
    }
    setArticles(results);
  };

  // Filter articles base on author from Great Britain api
  const filterArticles = (event: any) => {
    const results = staticArticlesList.filter((post: Data) => {
      if (event === "") return articles
      return categoryType ? post.author.toLowerCase().includes(event.toLowerCase()) : post.source.name.toLowerCase().includes(event.toLowerCase())
    })
    setArticles(results);
    setMenuState(false);
  }

  // Toggle the menu to show categories
  const openMenu = () => {
    setMenuState(!menuState);
    getCategories(staticArticlesList);
  }

  // Reset to show all articles
  const reset = () => {
    setArticles(staticArticlesList);
  }
  
  useEffect(() => {
    getArticles();
    getCategories(articles);
  }, []);
  return (
    <>
      <Head>
        <title>News Feed App</title>
        <meta name="description" content="My news feed app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.nav}>
            <div className={styles.categoriesToggle}>
              <button onClick={reset} type="button">Top News</button>
            </div>
            <div className={styles.categoriesList}>
              <div className={styles.categoriesToggle}>
                <button onClick={openMenu} type="button">Sources</button>
              </div>
              {menuState && <div className={styles.categories}>
                {categories.map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <button onClick={() => filterArticles(item)} type="button">{item}</button>
                    </div>
                  )
                })}
              </div>}
            </div>
          </div>
          <div className={styles.utilityNav}>
            <div className={styles.search}>
              <label>Search:</label>
              <input type="text" onChange={(event) =>handleSearch(event)} />
            </div>
            <div className={styles.location}>
              <button onClick={getUkArticles} type="button">Uk</button>
              <button onClick={getArticles} type="button">US</button>
            </div>
          </div>
        </header>
        <div className={styles.hero}>
          <h1>Top News from {location}</h1>
        </div>
        <div className={styles.grid}>
          {articles.length > 0 ? 
            articles.slice(0, 10).map((article: Data) => {
              return (
                <a key={article.title} href={`${categoryType ? 'postsUK' : 'posts'}/${article.publishedAt}`} className={styles.card}>
                  <h2>{article.title}</h2>
                  {article.urlToImage && <img src={article.urlToImage} alt="iamge" className={styles.postImage} />}
                  <p>{article.description}</p>
                </a>
              )
            })
            : <p>There are no Articles to be viewed</p>
          }
        </div>
      </main>
    </>
  )
}
