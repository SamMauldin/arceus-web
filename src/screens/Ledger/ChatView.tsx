import { useQuery } from '@apollo/client';
import React, { useEffect, useRef } from 'react';
import { GET_MESSAGES } from '../../queries';
import { map, orderBy, includes, last } from 'lodash';
import { Card, Elevation, Spinner } from '@blueprintjs/core';
import Linkify from 'react-linkify';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';

const extensions = {
  video: ['mov', 'mp4', 'webm'],
  audio: ['mp3', 'wav', 'flac', 'ogg'],
  photo: ['png', 'jpg', 'jpeg', 'gif'],
} as const;

const linkDecorator = (
  decoratedHref: string,
  decoratedText: string,
  key: number,
) => {
  return (
    <a href={decoratedHref} key={key} target="_blank">
      {decoratedText}
    </a>
  );
};

export const ChatView = ({
  channelDiscordId,
  pinned,
}: {
  channelDiscordId: string;
  pinned: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, fetchMore, refetch, loading } = useQuery(GET_MESSAGES, {
    variables: { channelDiscordId, pinned },
  });

  const messages = orderBy(
    data?.messages,
    [({ timestamp }) => new Date(timestamp)],
    ['desc'],
  );

  useEffect(() => {
    refetch();
  }, [channelDiscordId, pinned]);

  const fetchNext = () => {
    if (loading || !data) return;

    fetchMore({
      variables: {
        channelDiscordId,
        before: last(messages)?.timestamp,
        pinned,
      },
    });
  };

  const onScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollHeight - (scrollTop + clientHeight) > 1000) return;

    fetchNext();
  };

  if (loading) return <Spinner />;
  if (!data) return null;

  return (
    <Container ref={containerRef} onScroll={onScroll}>
      {map(messages, (message) => {
        return (
          <Message key={message.discordId} elevation={Elevation.ONE}>
            <h3>
              {message.user.tag}{' '}
              <small>
                {formatDistanceToNow(new Date(message.timestamp), {
                  addSuffix: true,
                })}
              </small>
            </h3>
            {message.content && (
              <p>
                <Linkify componentDecorator={linkDecorator}>
                  {message.content}
                </Linkify>
              </p>
            )}
            {message.attachments.map(({ name, signedUrl, discordId }: any) => {
              const extension = last(name.split('.'));
              if (includes(extensions.photo, extension)) {
                return (
                  <div key={discordId}>
                    <a href={signedUrl} target="_blank">
                      {name}
                      <br />
                      <EmbedImage src={signedUrl} />
                    </a>
                  </div>
                );
              }

              if (includes(extensions.audio, extension)) {
                return (
                  <div key={discordId}>
                    <a href={signedUrl} target="_blank">
                      {name}
                    </a>
                    <br />
                    <audio controls src={signedUrl} />
                  </div>
                );
              }

              if (includes(extensions.video, extension)) {
                return (
                  <div key={discordId}>
                    <a href={signedUrl} target="_blank">
                      {name}
                    </a>
                    <br />
                    <EmbedVideo controls src={signedUrl} />
                  </div>
                );
              }

              return (
                <div key={discordId}>
                  <a href={signedUrl} target="_blank">
                    {name}
                  </a>
                </div>
              );
            })}
          </Message>
        );
      })}
    </Container>
  );
};

const Message = styled(Card)`
  margin: 0.5em;
`;
const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`;
const EmbedImage = styled.img`
  max-height: 200px;
`;
const EmbedVideo = styled.video`
  max-height: 400px;
`;
