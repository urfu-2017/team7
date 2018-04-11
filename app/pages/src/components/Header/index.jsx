import React from 'react';
import { Header, Icon } from 'semantic-ui-react';
import css from './styles.css';

class MainHeader extends React.Component {
    render() {
        return (
            <Header className={css.header} as="h1" icon textAlign="center" size="tiny">
                <Icon className={css.header__image} circular />
                <Header.Content>
                    KILOGRAMM
                </Header.Content>
            </Header>
        );
    }
}

export default MainHeader;
