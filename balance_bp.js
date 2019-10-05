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

// get last block
client.query({
  query: gql`
  query {
    blocks {
      nodes(first: 1) {
        creator
      }
    }
  }
    `,
})
// print out their public key
.then(res => {  
  const publicKey = res.data.blocks.nodes[0].creator;
  console.log('block producer\'s publicKey', publicKey); 
  return publicKey;
})
// get balance of who made the last block
.then(creator => {
  return client.query({
    variables: { pubkey: creator },
    query: gql`
    query {
      wallet (publicKey: $pubkey) {
        balance {
          total
        }
      }
    }`
  });
})
.then(res => console.log('block producer\' balance', res.data.wallet.balance.total))
.catch(error => console.error(error));
