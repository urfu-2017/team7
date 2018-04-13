import got from 'got';
import metascraper from 'metascraper';
import toUTF8 from 'html-to-utf8';

export default async (url) => {
    const { body, headers } = await got(url, { encoding: null });
    const htmlInUTF8 = toUTF8(body, headers['content-type']);

    return metascraper({ html: htmlInUTF8, url });
};
