const express = require('express')
const app = express()
const schema = require('./schema/schema');
const { graphqlHTTP } = require('express-graphql');

//Add GraphQL endpoint to the server. It’s a common practice to add GraphQL endpoint to /graphql but this is customizable per requirements.
//graphqlHTTP takes schema as a mandatory parameter.
//graphqlHTTP takes an optional parameter graphiql.
//If graphiql is set to true, it provides an in-browser GraphQL query tool.
app.use(
    "/graphql",
    graphqlHTTP({
    schema: schema,
    graphiql: true,
    }));  

app.listen(5000, () => {
    console.log("Listening for requests on port 5000")
    //type localhost:5000/graphql
})