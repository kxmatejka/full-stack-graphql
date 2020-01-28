import {ApolloServer, gql, MockList} from 'apollo-server'
import casual = require('casual')

const postDefinition = gql`
  type PostConnection {
    totalCount: Int!
    edges: [PostEdge]
    pageInfo: PageInfo
  }

  type PostEdge {
    node: Post
    cursor: ID!
  }

  type Post {
    id: ID!
    title: String!
    content: String
    author: Author!
  }

  extend type Query {
    posts: PostConnection
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
  type PageInfo {
    endCursor: ID
    hasNextPage: Boolean
  }

  type Query

  schema {
    query: Query
  }
`

const server = new ApolloServer({
  typeDefs: [postDefinition, authorDefinition, schemaDefinition],
  mocks: {
    Query: () => ({
      posts: {
        edges: new MockList([3, 10])
      }
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
