//GraphQL schema defines how various GraphQL queries and mutations are structured and inter-linked. 
const { type } = require('express/lib/response');
const graphql = require('graphql'); 
const _ = require('lodash')

//Import the required GraphQL types. For the basic query, we need:
//Types in GraphQL are used to convert the JavaScript data types and custom datatypes into GraphQL-friendly types for compilation.
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema, GraphQLNonNull } = graphql;

//add static data
//The data consists of articles and contributors. An article is written by a contributor. A contributor can have more than one article written under their name. Both articles and contributors have an associated ID to identify them uniquely. Articles have contributorId to identify the contributor.
let articles = [
    { name: 'The History of Node.js', topic: 'Node.js', date: '2020-08-25T00:00:00Z', id:"1", contributorId:"1"},
    { name: 'Understanding Docker Concepts', topic: 'Containers', date: '2020-07-23T00:00:00Z', id:"2", contributorId:"2"},
    { name: 'Linting in Node.js using ESLint', topic: 'Node.js', date: '2020-08-24T00:00:00Z', id:"3", contributorId:"2"},
    { name: 'REST APIs - Introductory guide', topic: 'API', date: '2020-06-26T00:00:00Z', id:"4", contributorId:"1"},
];

let contributors = [
    { name: 'John Doe', url: '/john-doe', major: 'Computer Science', id:"1"},
    { name: 'Jane Doe', url: '/jane-doe', major: 'Physics', id:"2"},
];

//Create a user-defined GraphQLObjectType for articles and authors. The ID field is of type GraphQLID and the rest as GraphQLString.
const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        topic: {type: GraphQLString},
        date: {type: GraphQLString},
        contributorId: {type: GraphQLString},
        contributor:{
            type: ContributorType,
            resolve(parent,args){
                return _.find(contributors,{id:parent.contributorId})
            }
        }
    })
})

const ContributorType = new GraphQLObjectType({
    name: 'Contributor',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        major: { type: GraphQLString },
        articles:{
            type: new GraphQLList(ArticleType),
            resolve(parent,args){
                return _.filter(articles, {contributorId:parent.id})
            }
        }
    })
})

//a root query that will print Welcome to GraphQL when the query contains a field named status.
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
        status: {
            type: GraphQLString,
            resolve(parent,args) {
                return "welcome to graphQL"
            }
        },
        article: {
            type: ArticleType,
            args: {id:{type: GraphQLID}},
            resolve(parent,args){
                return _.find(articles,{'id':args.id})
            }
        },
        contributor: {
            type: ContributorType,
            args: {id:{type: GraphQLID}},
            resolve(parent,args){
                return _.find(contributors,{'id':args.id})
            }
        },
    }
    
})

//Export the query as GraphQLSchema type so that GraphQL can parse it as its schema. The GraphQLSchema takes an object with key-value pairs. One key is query. 
//To this key, pass the above created RootQuery as a value.
module.exports = new GraphQLSchema({
    query: RootQuery
});