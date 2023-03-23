import * as React from "react"

const Seo = ({
  title,
  h1,
  children,
}) => {
  return (
    <>
      {h1 ? <title>{title} - {h1}</title>:<title>{title}</title>}
      <meta name="keywords" content={title} />
      {children}
    </>
  )
}

export default Seo
