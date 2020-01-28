import {ApolloServer, gql, MockList} from 'apollo-server'
import casual = require('casual')

const postDefinition = gql`
  type Post {
    id: ID!
    title: String!
    content: String
    author: Author!
  }

  extend type Query {
    posts: [Post]
  }
`

const authorDefinition = gql`
  enum Role {
    User
    Moderator
    Administrator
  }

  type Author {
    id: ID!
    name: String!
    posts: [Post]
    role: Role
  }
`

const schemaDefinition = gql`
  type Query

  schema {
    query: Query
  }
`

const server = new ApolloServer({
  typeDefs: [postDefinition, authorDefinition, schemaDefinition],
  mocks: {
    Query: () => ({
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
