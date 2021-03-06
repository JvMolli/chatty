import { gql } from 'apollo-server';

export const typeDefs = gql`
  # declare custom scalars
  scalar Date

  # input for creating messages
  # text is the message text
  # userId is the id of the user sending the message
  # groupId is the id of the group receiving the message
  input CreateMessageInput {
    userId: Int!
    groupId: Int!
    text: String!
  }

  # input for creating groups
  input CreateGroupInput {
    name: String!
    userIds: [Int!]
    userId: Int!
    imageId: Int!
  }

  # input for updating groups
  input UpdateGroupInput {
    id: Int!
    name: String
    imageId: Int!
  }

  type Image {
    id: Int!
    uri: String!
  }

  # a group chat entity
  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    users: [User!]! # users in the group
    messages: [Message!]! # messages sent to the group
    imageId: Int!
  }
  # a user -- keep type really simple for now
  type User {
    id: Int! # unique id for the user
    email: String! # we will also require a unique email per user
    username: String # this is the name we'll show other users
    messages: [Message!]! # messages sent by user
    groups: [Group!]! # groups the user belongs to
    friends: [User!]! # user's friends/contacts
  }
  # a message sent from a user to a group
  type Message {
    id: Int! # unique id for message
    to: Group! # group message was sent in
    from: User! # user who sent the message
    text: String! # message text
    createdAt: Date! # when message was created
  }
  # query for types
  type Query {
    # Return a user by their email or id
    user(email: String, id: Int): User
    # Return messages sent by a user via userId
    # Return messages sent to a group via groupId
    messages(groupId: Int, userId: Int): [Message]
    # Return a group by its id
    group(id: Int!): Group
  }
  type Mutation {
    # send a message to a group
    createMessage(message: CreateMessageInput!): Message
    createGroup(group: CreateGroupInput!): Group
    deleteGroup(id: Int!): Group
    leaveGroup(id: Int!, userId: Int!): Group # let user leave group
    updateGroup(group: UpdateGroupInput!): Group
  }
  schema {
    query: Query
    mutation: Mutation
  }
`;

export default typeDefs;
