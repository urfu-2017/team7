import got from 'got';
import metascraper from 'metascraper';
import toUTF8 from 'html-to-utf8';

export default async (requestUrl) => {
    const { body, headers, url } = await got(requestUrl, { encoding: null });
    const htmlInUTF8 = toUTF8(body, headers['content-type']);

    return metascraper({ html: htmlInUTF8, url });
};
