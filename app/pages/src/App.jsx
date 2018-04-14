import React from 'react';
import { Provider } from 'mobx-react';
import { HashRouter } from 'react-router-dom';
import chatsStore from './stores/chats';
import messagesStore from './stores/messages';
import usersStore from './stores/users';
import urlMetaStore from './stores/url-meta';
import weatherStore from './stores/weather';
import currentUserStore from './stores/current-user';
import MainActivity from './activities/Main';


const stores = {
    chatsStore,
    messagesStore,
    usersStore,
    urlMetaStore,
    currentUserStore,
    weatherStore
};


class App extends React.Component {
    render() {
        return process.browser ? (
            <Provider {...stores}>
                <HashRouter hashType="noslash">
                    <MainActivity />
                </HashRouter>
            </Provider>
        ) : null;
    }
}

App.displayName = 'App';

export default App;
