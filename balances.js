const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const fetch = require('cross-fetch/polyfill').fetch;
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;

const codaURI = 'http://localhost:3085/graphql';

const client = new ApolloClient({
    link: createHttpLink({
        uri: codaURI,
        fetch: fetch
    }),
    cache: new InMemoryCache()
});

client.query({
  query: gql`
query {
    blocks(first: 1) {
          nodes {
                  creator
                        stateHash
                              protocolState {
                                        blockchainState {
                                                    date
                                                            }
                                                                  }
                                                                      }
                                                                        }
}
  `,
})
  .then(data => console.log(data.data.blocks.nodes[0].creator))
  .catch(error => console.error(error));

