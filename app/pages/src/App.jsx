import React from 'react';
import Head from 'next/head';
import { Provider } from 'mobx-react';
import Router from './Router';

import chats from './stores/chats';
import messages from './stores/messages';
import users from './stores/users';
import urlMetaStore from './stores/url-meta';

const stores = {
    chats,
    messages,
    users,
    urlMetaStore
};
const semanticUiStyles = 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css';

class App extends React.Component {
    render() {
        return process.browser ? (
            <Provider {...stores}>
                <React.Fragment>
                    <Head>
                        <link rel="stylesheet" href={semanticUiStyles} />
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
