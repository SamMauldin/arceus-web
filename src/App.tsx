import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_SESSION } from './queries';
import { Login, Ledger } from './screens';
import { Spinner } from '@blueprintjs/core';

export const App = () => {
  const { data, error, loading } = useQuery(GET_SESSION, {
    pollInterval: 5000,
    errorPolicy: 'all',
  });
  if (loading) return <Spinner />;
  if (error) {
    if (
      error.message ===
      "Access denied! You don't have permission for this action!"
    )
      return <Login />;

    return <Spinner />;
  }
  if (data?.session && !data?.session.discordUserId) return <Login />;

  return <Ledger />;
};
