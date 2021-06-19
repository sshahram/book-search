import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink()
const httpLink = createHttpLink({
  uri: '/graphql',
});

// create a middleware function that will retrieve the token for us
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// use the ApolloClient() constructor to instantiate the Apollo Client instance and create the connection to the API endpoint
const client = new ApolloClient({
  // combine the authLink and httpLink objects so that every request retrieves the token and sets the request headers before making the request to the API
  link: authLink.concat(httpLink),
  // instantiate a new cache object using new InMemoryCache()
  cache: new InMemoryCache(),
});

function App() {
  return (
    // enable our entire application to interact with our Apollo Client instance.
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
