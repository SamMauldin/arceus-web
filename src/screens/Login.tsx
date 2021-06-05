import React, { useEffect } from 'react';
import { Card, Code, Intent, ProgressBar } from '@blueprintjs/core';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { CREATE_SESSION } from '../queries';

export const Login = () => {
  const [createSession, { data: createdSession }] = useMutation(CREATE_SESSION);

  useEffect(() => {
    createSession()
      .then(({ data }) => {
        localStorage.setItem(
          'ARCEUS_SESSION_TOKEN',
          data.createSession.sessionToken,
        );
      })
      .catch(() => {});
  }, []);

  return (
    <Container>
      <Card>
        <h2>Login</h2>
        {createdSession && (
          <>
            <p>Paste the following in Discord to authenticate:</p>
            <Code>
              @Arceus web:auth {createdSession.createSession.loginToken}
            </Code>
          </>
        )}
        <Progress intent={Intent.PRIMARY} />
      </Card>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Progress = styled(ProgressBar)`
  min-width: 300px;
  margin-top: 1em;
`;
