import React from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import Router from './Router';

class App extends React.Component {
    render() {
        return process.browser ? (
            <main className="root-div">
                <Header />
                <Menu />
                <Router />
            </main>
        ) : null;
    }
}

App.displayName = 'App';

export default App;
