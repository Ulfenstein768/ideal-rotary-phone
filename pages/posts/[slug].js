export default function Post(data) {
  const post = data.post;

  return (
    <div className="container">
      <h1>{post.title}</h1>
      <div className="article-container">
        <article
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="article"
        ></article>
      </div>
      <style jsx>{``}</style>
    </div>
  );
}

export async function getStaticProps(context) {
  const res = await fetch(
    "http://javascriptreact-react-frameworks.local/graphql",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
                query SinglePost($id: ID!, $idType: PostIdType!) {
                    post(id: $id, idType: $idType) {
                        title
                        slug
                        content
                        featuredImage {
                            node {
                                sourceUrl
                            }
                        }
                    }
                }
            `,
        variables: {
          id: context.params.slug,
          idType: "SLUG",
        },
      }),
    }
  );

  const json = await res.json();

  return {
    props: {
      post: json.data.post,
    },
  };
}

export async function getStaticPaths() {
  const res = await fetch(
    "http://javascriptreact-react-frameworks.local/graphql",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
            query allPostsQuery {
                posts {
                    nodes {
                        slug
                        content
                        title
                        featuredImage {
                            node {
                                sourceUrl
                            }
                        }
                    }
                }
            }
        `,
      }),
    }
  );

  const json = await res.json();
  const posts = json.data.posts.nodes;

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
}
