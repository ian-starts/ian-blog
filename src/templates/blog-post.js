import React from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import rehypeReact from "rehype-react"
import Table from "../components/Table"
import "../css/blog-post.css"
import Link from "gatsby-link" // make it pretty!

export default function Template({ data }) {
  const { markdownRemark: post } = data // data.markdownRemark holds our post data
  let featuredImgFluid = post.frontmatter.featuredImage.childImageSharp.fluid
  let authorimageFluid = post.frontmatter.authorImage.childImageSharp.fluid
  let title = "Ian's Blog - " + post.frontmatter.title

  const renderAst = new rehypeReact({
    createElement: React.createElement,
    components: {
      table: Table,
    },
  }).Compiler

  return (
    <div className="flex justify-center">
      <Helmet>
        <title>{`Ian's Blog - ${post.frontmatter.title}`}</title>
        <meta name="title" content={title}/>
        <meta name="description"
              content={post.frontmatter.description}/>

        <meta name="keywords" content={post.frontmatter.keywords}/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={"https://blog.iankok.com" + post.frontmatter.path}/>
        <meta property="og:title" content={title}/>
        <meta property="og:description"
              content={post.frontmatter.description}/>
        <meta property="og:image" content={`https://blog.iankok.com${post.frontmatter.ogImagePath}`}/>

        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:url" content={"https://blog.iankok.com" + post.frontmatter.path}/>
        <meta property="twitter:title" content={title}/>
        <meta property="twitter:description"
              content={post.frontmatter.description}/>
        <meta property="twitter:image" content={`https://blog.iankok.com${post.frontmatter.ogImagePath}`}/>
        <meta charSet="utf-8"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <meta name="msapplication-TileColor" content="#da532c"/>
        <meta name="theme-color" content="#ffffff"/>
      </Helmet>
      <div className="absolute top-0 w-full z-0 image-container">
        <Img className="flex header-image" fluid={featuredImgFluid}
             alt="cover art"
        />
      </div>
      <Link to={"/"} className="absolute bg-teal-100 py-1 px-3 rounded-md"
            style={{ top: "4vw", left: "5vw", color: "black" }}>
        ← Home
      </Link>
      <div className="max-w-4xl mb-40 mt-56 bg-white rounded-md p-6 z-10 w-full md:p-10 lg:p-10 xl:p-10">
        <h1>{post.frontmatter.title}</h1>
        <div className="flex flex-row my-5">
          <Img className="rounded-full w-10 mr-5" fluid={authorimageFluid}
               alt={post.frontmatter.author}
          />
          <p
            className="italic text-gray-700">By {post.frontmatter.author} - {new Date(post.frontmatter.date).toDateString()} - {post.frontmatter.readTime} read</p>
        </div>
        {
          renderAst(post.htmlAst)
        }
      </div>
    </div>
  )
}

export const pageQuery = graphql`
query BlogPostByPath($path: String!) {
  markdownRemark(frontmatter: {path: {eq: $path}}) {
  htmlAst
  frontmatter {
  date(formatString: "MMMM DD, YYYY")
  path
  title
  keywords
  readTime
  author
  ogImagePath
  description
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