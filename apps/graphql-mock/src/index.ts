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
    posts(first: Int): PostConnection
  }
`

const authorDefinition = gql`
  type AuthorConnection {
    totalCount: Int!
    edges: [AuthorEdge]
    pageInfo: PageInfo
  }

  type AuthorEdge {
    node: Author
    cursor: ID!
  }

  enum Role {
    User
    Moderator
    Administrator
  }

  type Author {
    id: ID!
    name: String!
    posts(first: Int): PostConnection
    role: Role
  }
  
  extend type Query {
    authors(first: Int): AuthorConnection
  }
`

const searchDefinition = gql`
  union SearchResult = Author | Post

  extend type Query {
    search(phrase: String!): [SearchResult]
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
  typeDefs: [postDefinition, authorDefinition, searchDefinition, schemaDefinition],
  mocks: {
    PostConnection: () => ({
      totalCount: () => 5,
      edges: () => new MockList(5)
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
