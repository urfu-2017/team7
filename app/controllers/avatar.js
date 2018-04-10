import seedrandom from 'seedrandom';


export class AvatarController {
    constructor(generator) {
        this.generator = generator;
    }

    getAvatar(req, res) {
        const rng = AvatarController.getRandomInt.bind(null, seedrandom(req.params.userId));
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
