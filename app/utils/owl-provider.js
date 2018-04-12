import _ from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export function getOwlUrl() {
    return `/static/owls/${_.random(1, 18)}.svg`;
}
