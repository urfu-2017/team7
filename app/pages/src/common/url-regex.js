const urlregex = /((https?:\/\/)?((?:(?:[а-яё-\w]+\.)+(?:[а-яё-\w]+))|localhost)(?::(\d{1,5}))?((?:(?:\/[а-яё-\w#@%]+)+)?\/?)(\?(?:(\w+=[\w%]+)&)*(\w+=[\w%]+))?)/i;

export default new RegExp(urlregex, 'gi');

export const getMatch = (text) => {
    const groups = text.match(urlregex);
    if (!groups) {
        return null;
    }
    // eslint-disable-next-line no-undef
    const { hostname: currentDomain, port: currentPort } = window.location;
    const [, fullmatch, schema, domain, port, path, query] = groups;
    const isSameDomain = currentDomain === domain &&
        (port === currentPort || (!currentPort && !port));

    return {
        fullmatch, schema, path: (path || '/') + (query || ''), isSameDomain
    };
};
