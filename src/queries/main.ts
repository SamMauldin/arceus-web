import { gql } from '@apollo/client';

export const CREATE_SESSION = gql`
  mutation CreateSession {
    createSession {
      sessionToken
      loginToken
    }
  }
`;

export const GET_SESSION = gql`
  query GetSession {
    session {
      sessionToken
      loginToken
      discordUserId
    }
  }
`;

export const GET_GUILDS = gql`
  query GetGuilds {
    guilds {
      discordId
      name
      channels {
        discordId
        name
        messageCount
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages(
    $before: DateTime
    $channelDiscordId: String!
    $pinned: Boolean
  ) {
    messages(
      before: $before
      channelDiscordId: $channelDiscordId
      pinned: $pinned
    ) {
      id
      discordId
      content
      timestamp
      user {
        tag
      }
      attachments {
        discordId
        name
        signedUrl
      }
    }
  }
`;
