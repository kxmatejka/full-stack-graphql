import {ApolloServer, gql} from 'apollo-server'
import Knex from 'knex'

const db = Knex({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'blog'
  }
})

const typeDefs = gql`
  type Post {
    id: ID
    title: String
    user: User
  }

  type User {
    id: ID
    name: String
    posts: [Post]
  }

  type Query {
    post(id: String!): Post
    posts: [Post]
    me: User
  }

  schema {
    query: Query
  }
`

const resolvers = {
  Query: {
    post: async (obj, args) => {
      const post = await db.from('posts').where({id: args.id}).first()
      const user = await db.from('users').where({id: post.user_id}).first()

      return {
        ...post,
        user
      }
    },
    posts: async (obj, args, context, info) => {
      const posts = await db.from('posts')

      return posts.map(async post => {
        const user = await db.from('users').where({id: post.user_id}).first()

        return {
          ...post,
          user
        }
      })
    },
    me: async () => {
      const user = await db.from('users').where({id: 1}).first()
      const posts = await db.from('posts').where({user_id: 1})

      return {
        ...user,
        posts
      }
    }
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
