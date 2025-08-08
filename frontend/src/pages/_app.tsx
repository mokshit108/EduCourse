import React from 'react';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ApolloProvider>
  );
}