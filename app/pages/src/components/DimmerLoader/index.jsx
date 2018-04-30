import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const DimmerLoader = ({ size, text }) => (
    <Dimmer active inverted>
        <Loader size={size || 'large'}>{text}</Loader>
    </Dimmer>
);

export default DimmerLoader;
