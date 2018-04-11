import React from 'react';
import Head from 'next/head';
import { Provider } from 'mobx-react';
import Router from './Router';

import chatsStore from './stores/chats';
import messagesStore from './stores/messages';
import usersStore from './stores/users';
import urlMetaStore from './stores/url-meta';
import currentUserStore from './stores/current-user';

const stores = {
    chatsStore,
    messagesStore,
    usersStore,
    urlMetaStore, 
    currentUserStore
};
console.log(currentUserStore);
const semanticUiStyles = 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css';

class App extends React.Component {
    render() {
        return process.browser ? (
            <Provider {...stores}>
                <React.Fragment>
                    <Head>
                        <title>team7chat</title>
                        <link rel="stylesheet" href={semanticUiStyles} />
                        <link rel="stylesheet" href="/_next/static/style.css" />
                        <link rel="icon" type="image/png" href="/static/logo.png" />
                        <style jsx global>{`
                          body, html {
                            overflow: hidden;
                            background-color: #E7EBF0;
                          }
                        `}
                        </style>
                    </Head>
                    {/* <Header /> */}
                    {/* <Menu /> */}
                    <Router />
                </React.Fragment>
            </Provider>
        ) : null;
    }
}

App.displayName = 'App';

export default App;
