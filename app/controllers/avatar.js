import Router from 'express-promise-router';
import seedrandom from 'seedrandom';
import murmurhash from 'murmurhash';
import AvatarGenerator from '../utils/avatar-generator';

const generator = new AvatarGenerator();

export default Router()
    .get('/:userId', (req, res) => {
        const seedRng = seedrandom(murmurhash(req.params.userId));
        const minMaxRng = (min, max) => Math.floor(seedRng() * (max - min)) + min;
        generator.createAvatar(minMaxRng).toBlob((err, img) => {
            res.contentType('png');
            res.end(img, 'binary');
        });
    });
