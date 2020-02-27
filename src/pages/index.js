import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"
import Link from "gatsby-link"

import '../css/index.css'; // add some style if you want!

export default function Index({
                                data,
                              }) {
  const { edges: posts } = data.allMarkdownRemark
  const groupedItems = groupBy(posts, (post) => post.node.frontmatter.topic)
  return (
    <div className="flex index-container">
      <Helmet title={`Ian's Blog`}/>
      <div className="flex w-0 lg:w-40 xl:w-40"/>
      <div className="flex-1 h-screen bg-black px-10 overflow-auto">
        <div className="flex flex-row my-10">
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
                        <Link className="text-white font-bold"
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