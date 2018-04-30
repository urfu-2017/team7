import React from 'react';
import { Provider } from 'mobx-react';
import { HashRouter } from 'react-router-dom';
import chatsStore from './stores/chats';
import messagesStore from './stores/messages';
import usersStore from './stores/users';
import urlMetaStore from './stores/url-meta';
import weatherStore from './stores/weather';
import alarmsStore from './stores/alarms';
import currentUserStore from './stores/current-user';
import MainActivity from './activities/Main';


const stores = {
    chatsStore,
    messagesStore,
    usersStore,
    urlMetaStore,
    currentUserStore,
    weatherStore,
    alarmsStore
};


class App extends React.Component {
    componentDidMount() {
        // eslint-disable-next-line
        const storage = localStorage;
        let i = 0;
        let key = storage.key(i);
        while (key) {
            const alarm = JSON.parse(storage.getItem(key));
            alarmsStore.addAlarm(alarm);
            i++;
            key = storage.key(i);
        }
    }
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
