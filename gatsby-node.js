const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const _ = require("lodash")


exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        nodes {
          id
          fields {
            slug
          }
        }
      }
    }
  `)
  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes

  const postsPerPage = 10
  const numPages = Math.ceil(posts.length / postsPerPage)
  posts.forEach(({ node }, i) => {
    createPage({
      path: i === 0 ? `/` : `/p/${i + 1}/`,
      component: path.resolve(`src/templates/index.js`),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPage: numPages,
        currentPage: i + 1,
      },
    })
  })

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }
}

exports.onCreateNode = async ({
  node,
  actions,
  getNode,
}) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark` && (node.frontmatter.img !== null)) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
