import {ApolloServer, gql} from 'apollo-server'

const typeDefs = gql`
  type Post {
    id: ID
    title: String
  }

  type Query {
    posts: [Post]
  }

  schema {
    query: Query
  }
`

interface Post {
  id: string,
  title: string
}

const posts: Post[] = [
  {
    id: 'abcd',
    title: 'Koule'
  },
  {
    id: 'aece',
    title: 'ptak'
  }
]

const resolvers = {
  Query: {
    posts: () => posts
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen({
  port: 4001
})
  .then(({url}) => console.log(`listening at: ${url}`))
  .catch(console.error)
