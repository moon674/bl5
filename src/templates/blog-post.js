import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post, allMarkdownRemark: p },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title
  const siteDes = site.siteMetadata?.description
  const menuTop = site.siteMetadata?.menuTop
  const menuBot = site.siteMetadata?.menuBot
  const posts = p.nodes

  return (
    <Layout
      location={location}
      title={siteTitle}
      des={siteDes}
      menuTop={menuTop}
      menuBot={menuBot}
    >
      <article className="w-full p-3">
        <div className="border-y-2 py-4 mb-2 text-center text-gray-700">
          <h1 className="text-2xl font-bold">{post.frontmatter.title}</h1>
          <div className="text-sm my-3">
            <time>{post.frontmatter.date}</time>
          </div>
        </div>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <hr />

      <div className="flex flex-row p-3 my-2 rounded-xl">
        {previous && !previous.fields.slug.match(/(\/)?page\/\S*/) && (
          <div className="flex-1">
            <div className="inline-block text-base font-bold">
              <span className="items-center text-[2em]">← </span>
              <Link to={previous.fields.slug} rel="prev">
                {previous.frontmatter.title}
              </Link>
            </div>
          </div>
        )}
        {next && !next.fields.slug.match(/(\/)?page\/\S*/) && (
          <div className="flex-1">
            <div className="inline-block text-base font-bold float-right">
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title}
              </Link>
              <span className="items-center text-[2em]"> →</span>
            </div>
          </div>
        )}
      </div>
      <hr />

      {posts.map(post => {
        const { title } = post.frontmatter
        return (
          <section className="bg-white" key={post.fields.slug}>
            <div className="mx-auto">
              <div className="flex shadow-md hover:shadow-lg border border-gray-100 p-3 rounded-xl mt-3 mx-2">
                <div className="flex w-9/12 ">
                  <div className="mx-5 my-auto">
                    <Link to={post.fields.slug}>
                      <span className="text-lg font-semibold  text-gray-800">
                        {title}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </Layout>
  )
}

export const Head = ({ data: { site, markdownRemark: post } }) => {
  const title = post.frontmatter.title
  const h1 = site.siteMetadata?.title
  return (
    <Seo
      title={title}
      h1={h1}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 5) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "DD-MM-YYYY")
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`