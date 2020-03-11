import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"
import Link from "gatsby-link"

import "../css/index.css" // add some style if you want!

export default function Index({
                                data,
                              }) {
  const { edges: posts } = data.allMarkdownRemark
  const groupedItems = groupBy(posts, (post) => post.node.frontmatter.topic)
  return (
    <div className="flex index-container">
      <Helmet>
        <title>Ian's Blog</title>
        <meta name="title" content="Ian's Blog"/>
        <meta name="description"
              content="A blog about which is mostly about how tech and society works together. Expect things like
              'Cognitive Behavioural Therapy as an algorithm'. I also have to break my head on some techy stuff every now
              and then, so expect some guides revolving around that too!"/>

        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://blog.iankok.com"/>
        <meta property="og:title" content="Ian's Blog"/>
        <meta property="og:description"
              content="A blog about which is mostly about how tech and society works together. Expect things like
              'Cognitive Behavioural Therapy as an algorithm'. I also have to break my head on some techy stuff every now
              and then, so expect some guides revolving around that too!"/>
        <meta property="og:image" content="https://blog.iankok.com/images/og-image.png"/>

        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:url" content="https://blog.iankok.com"/>
        <meta property="twitter:title" content="Ian's Blog"/>
        <meta property="twitter:description"
              content="A blog about which is mostly about how tech and society works together. Expect things like
              'Cognitive Behavioural Therapy as an algorithm'. I also have to break my head on some techy stuff every now
              and then, so expect some guides revolving around that too!"/>
        <meta property="og:image" content="https://blog.iankok.com/images/og-image.png"/>
        <meta charSet="utf-8"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <meta name="msapplication-TileColor" content="#da532c"/>
        <meta name="theme-color" content="#ffffff"/>
      </Helmet>
      <a href="https://iankok.com">
        <div className="flex w-0 lg:w-40 xl:w-40"/>
      </a>
      <div className="flex-1 h-screen bg-black py-10 px-8 md:px-12 lg:px-12 xl:px-12 overflow-auto">
        <div className="flex flex-row my-6">
          <h1 className="text-white font-bold text-6xl md:text-7xl lg:text-8xl xl:text-8xl">BLOG</h1>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {Object.keys(groupedItems).map((key, index) => {
            let posts = groupedItems[key]
            return (
              <div className="mt-10">
                <h1 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl xl:text-6xl">{key}</h1>
                {posts.map((post) => {
                  post = post.node
                  return (
                    <div key={post.id} className="mb-10">
                      <h1 className="my-0 text-2xl md:text-3xl lg:text-3xl xl:text-3xl">
                        <Link className="text-white font-bold link"
                              to={post.frontmatter.path}>{post.frontmatter.title}</Link>
                      </h1>
                      <h3
                        className="text-white text-lg md:text-xl lg:text-2xl xl:text-xl italic">{post.frontmatter.readTime} read
                      </h3>
                    </div>
                  )
                })}
              </div>)
          })}
        </div>
      </div>
    </div>
  )
}

const groupBy = (list, keyGetter) => {
  let map = {}
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map[key]
    if (!collection) {
      map = { ...map, [key]: [item] }
    } else {
      collection.push(item)
    }
  })
  return map
}


export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          frontmatter {
            title
            topic
            readTime
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
  }
`