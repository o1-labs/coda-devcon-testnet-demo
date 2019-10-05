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

// create a wallet
client.query({
  query: gql`
  query {
    ownedWallets {
      publicKey
    }
  }`
})
.then(res => {
  if (res.data.ownedWallets.length == 0) {
    return client.mutate({
      mutation: gql`
      mutation {
        addWallet(input: {password: "test"}) {
          publicKey
        }
      }`
    }).then((data) => {
      return data.addWallet.publicKey;
    });
  } else {
    return res.data.ownedWallets[0].publicKey;
  }
})
.then(myPublicKey => {
  // look at its balance
  console.log('local publicKey', myPublicKey);
  return client.query({
    variables: { pubkey: myPublicKey },
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
.then(res => console.log('local balance', res.data.wallet.balance.total))
.catch(error => console.error(error));
