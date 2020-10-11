/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path")

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)
  return graphql(`{
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
    ) {
      edges {
        node {
          htmlAst
          id
          frontmatter {
            path
            date
            title
            keywords
            topic
            readTime
            author
            ogImagePath
            description
            featuredImage {
              childImageSharp {
                fluid(maxWidth: 800) {
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
                fluid(maxWidth: 800) {
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
    }
  }`,
  )
    .then(result => {
      if (result.errors) {
        return Promise.reject(result.errors)
      }

      result.data.allMarkdownRemark.edges
        .forEach(({ node }) => {
          createPage({
            path: node.frontmatter.path,
            component: blogPostTemplate,
            context: {}, // additional data can be passed via context
          })
        })
    })
}