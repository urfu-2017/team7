import React from 'react';
import Head from 'next/head';
import Header from './components/Header';
import Menu from './components/Menu';
import Router from './Router';


class App extends React.Component {
    render() {
        return process.browser ? (
            <main className="root-div">
                <Head>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
                </Head>
                <Header />
                <Menu />
                <Router />
            </main>
        ) : null;
    }
}

App.displayName = 'App';

export default App;
