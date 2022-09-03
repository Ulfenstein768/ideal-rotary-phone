import Link from "next/link";

export default function Home({ posts }) {
  console.log(posts);

  return (
    <div className="container">
      <h1>Pointless Blog</h1>
      {posts.nodes.map((post) => {
        return (
          <ul key={post.slug}>
            <li>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          </ul>
        );
      })}
      <style jsx>{`
        .container {
          margin: 5rem;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("http://reactframeworks.local/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
          query HomePageQuery {
            posts {
              nodes {
                slug
                title
              }
            }
          }
          `,
    }),
  });

  const json = await res.json();

  return {
    props: {
      posts: json.data.posts,
    },
  };
}
