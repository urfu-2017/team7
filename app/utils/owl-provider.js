import _ from 'lodash';
import { OWL_RANGE_END, OWL_RANGE_START } from './constants';

// eslint-disable-next-line import/prefer-default-export
export function getOwlUrl() {
    return `/static/owls/${_.random(OWL_RANGE_START, OWL_RANGE_END)}.svg`;
}
