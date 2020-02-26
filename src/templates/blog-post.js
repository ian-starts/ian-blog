import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import "../css/blog-post.css" // make it pretty!

export default function Template({ data }) {
  const { markdownRemark: post } = data // data.markdownRemark holds our post data
  let featuredImgFluid = post.frontmatter.featuredImage.childImageSharp.fluid
  let authorimageFluid = post.frontmatter.authorImage.childImageSharp.fluid;
  return (
    <div className="flex justify-center">
      <Helmet title={`Ian's Blog - ${post.frontmatter.title}`}/>
      <div className="absolute top-0 w-full h-64 z-0">
        <Img className="flex h-full" fluid={featuredImgFluid}
             alt="cover art"
        />
      </div>
      <div className="flex-1 max-w-4xl my-0 md:my-10 lg:my-10 xl:my-10 bg-white rounded-md p-10 z-10">
        <h1>{post.frontmatter.title}</h1>
        <div className="flex flex-row my-5">
          <Img className="rounded-full w-10 mr-5" fluid={authorimageFluid}
               alt={post.frontmatter.author}
          />
          <p className="italic text-gray-700">By {post.frontmatter.author} - {new Date(post.frontmatter.date).toDateString()} - {post.frontmatter.readTime} read</p>
        </div>
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
        readTime
        author
        featuredImage {
          childImageSharp {
            fluid(maxWidth: 1000) {
              src
              srcSet
              aspectRatio
              sizes
              base64
            }
          }
        }
        authorImage {
          childImageSharp {
            fluid(maxWidth: 100) {
              src
              srcSet
              aspectRatio
              sizes
              base64
            }
          }
        }
      }
    }
  }
`