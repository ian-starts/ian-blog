import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"

import "../css/blog-post.css" // make it pretty!

export default function Template({ data }) {
  const { markdownRemark: post } = data // data.markdownRemark holds our post data
  console.log(post);
  return (
    <div className="flex justify-center">
      <Helmet title={`Ian's Blog - ${post.frontmatter.title}`}/>
      <div className="flex-1 max-w-4xl my-10 bg-white rounded-md p-10">
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }}/>
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`