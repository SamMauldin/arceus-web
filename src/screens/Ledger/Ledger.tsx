import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_GUILDS } from '../../queries';
import { Select } from '@blueprintjs/select';
import {
  Button,
  Callout,
  Intent,
  MenuItem,
  Spinner,
  Switch,
} from '@blueprintjs/core';
import styled from 'styled-components';
import arceus from '../../resources/arceus.png';
import { ChatView } from './ChatView';
import { orderBy } from 'lodash';

type DiscordItem = { discordId: string; name: string };
const DiscordItemSelect = Select.ofType<DiscordItem>();

export const Ledger = () => {
  const [pinned, setPinned] = useState(false);
  const [selectedGuild, setSelectedGuild] = useState<DiscordItem | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<DiscordItem | null>(
    null,
  );

  useEffect(() => {
    setSelectedChannel(null);
  }, [selectedGuild]);

  const { data: guilds, loading, refetch } = useQuery(GET_GUILDS);

  if (loading) return <Spinner />;
  if (!guilds)
    return (
      <Callout title="Error" intent={Intent.DANGER}>
        You do not have the neccesary permissions to view Ledger.
        <RetryContainer>
          <Button onClick={() => refetch()}>Retry</Button>
        </RetryContainer>
      </Callout>
    );

  return (
    <Layout>
      <Header>
        <Logo src={arceus} />
        <LogoText>Ledger</LogoText>

        <DiscordItemSelect
          filterable={false}
          popoverProps={{ minimal: true }}
          items={guilds.guilds}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              active={modifiers.active}
              disabled={modifiers.disabled}
              text={item.name}
              key={item.discordId}
              onClick={handleClick}
            />
          )}
          onItemSelect={setSelectedGuild}
        >
          <Button
            rightIcon="caret-down"
            text={
              selectedGuild
                ? `Server: ${selectedGuild.name}`
                : 'Select Server...'
            }
          />
        </DiscordItemSelect>

        <DiscordItemSelect
          filterable={false}
          popoverProps={{ minimal: true }}
          items={
            orderBy(
              guilds.guilds?.find(
                ({ discordId }: { discordId: string }) =>
                  discordId === selectedGuild?.discordId,
              )?.channels,
              'messageCount',
              'desc',
            ) || []
          }
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              active={modifiers.active}
              disabled={modifiers.disabled}
              text={item.name}
              key={item.discordId}
              label={(item as any).messageCount}
              onClick={handleClick}
            />
          )}
          onItemSelect={setSelectedChannel}
        >
          <Button
            rightIcon="caret-down"
            text={
              selectedChannel
                ? `Channel: ${selectedChannel.name}`
                : 'Select Channel...'
            }
            disabled={!selectedGuild}
          />
        </DiscordItemSelect>

        <Switch
          checked={pinned}
          label="Pinned"
          onChange={({ currentTarget: { checked } }) => setPinned(checked)}
        />
      </Header>
      {selectedChannel && (
        <ChatView
          channelDiscordId={selectedChannel.discordId}
          pinned={pinned}
        />
      )}
    </Layout>
  );
};

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  border-bottom: 1px solid grey;

  & > * {
    margin-left: 1em;
  }
`;

const Layout = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-rows: 75px 1fr;
  grid-template-columns: 1fr;
`;

const Logo = styled.img`
  height: 60%;
`;

const LogoText = styled.h3`
  margin-right: 2em;
`;

const RetryContainer = styled.div`
  margin-top: 0.5em;
`;
