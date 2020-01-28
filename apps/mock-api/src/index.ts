import {ApolloServer, gql, MockList} from 'apollo-server'
import casual = require('casual')

const schemaDefinition = gql`
  type Post {
    id: ID!
    title: String!
    content: String
    author: Author!
  }

  type Author {
    id: ID!
    name: String!
    posts: [Post]
  }

  type RootQuery {
    posts: [Post]
  }

  schema {
    query: RootQuery
  }
`

const server = new ApolloServer({
  typeDefs: schemaDefinition,
  mocks: {
    RootQuery: () => ({
      posts: () => new MockList([1, 5])
    }),
    Post: () => ({
      title: casual.title,
      content: casual.text
    }),
    Author: () => ({
      name: casual.name
    })
  }
})

server.listen()
  .then(({url}) => console.log(`listening at: ${url}`))
  .catch(console.error)
