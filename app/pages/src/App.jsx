import React from 'react';
import Head from 'next/head';
import Router from './Router';


class App extends React.Component {
    render() {
        return process.browser ? (
            <React.Fragment>
                <Head>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
                </Head>
                {/* <Header /> */}
                {/* <Menu /> */}
                <Router />
            </React.Fragment>
        ) : null;
    }
}

App.displayName = 'App';

export default App;
