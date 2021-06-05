import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { uniqWith } from 'lodash';

const httpLink = createHttpLink({
  uri: import.meta.env.SNOWPACK_ARCEUS_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('ARCEUS_SESSION_TOKEN');
  return {
    headers: {
      ...headers,
      'X-Session-Token': token,
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        messages: {
          keyArgs: ['channelDiscordId', 'pinned'],
          merge(existing = [], incoming) {
            return uniqWith(
              [...existing, ...incoming],
              ({ __ref }, { __ref: __ref2 }) => __ref === __ref2,
            );
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
