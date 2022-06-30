import Head from "next/head";
import { useEffect, useRef } from "react";
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/github.css';
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";

export default function Post({ postData }) {
  const elRef = useRef(null)
  useEffect(() => {
    hljs.highlightAll(elRef.current);
  },[])
  
  return (
    <Layout>
      <Head>
        <title>{postData.title ? postData.title : '柯里的语法糖'}</title>
      </Head>
      <article>
        {/* <h1 className={utilStyles.headingXl}>{postData.title}</h1> */}
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div ref={elRef} dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
