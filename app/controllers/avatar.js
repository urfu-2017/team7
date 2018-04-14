import seedrandom from 'seedrandom';
import murmurhash from 'murmurhash';

export default class AvatarController {
    constructor(generator) {
        this.generator = generator;
    }

    getAvatar(req, res) {
        const seed = murmurhash(req.params.userId);
        const rng = AvatarController.getRandomInt.bind(null, seedrandom(seed));
        const avatarBuffer = this.generator.createAvatar(rng);
        avatarBuffer.toBlob((err, img) => {
            res.contentType('png');
            res.setHeader('Cache-Control', 'public, max-age=300');
            res.end(img, 'binary');
        });
    }

    static getRandomInt(random, min, max) {
        return Math.floor(random() * (max - min)) + min;
    }
}
