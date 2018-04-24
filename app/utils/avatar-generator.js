import PNGImage from 'pngjs-image';


const IMAGE_SIZE = 220;
const TOTAL_BLOCKS = 5;
const BLOCK_SIZE = IMAGE_SIZE / TOTAL_BLOCKS;


export default class AvatarGenerator {
    constructor() {
        this.backgroundColor = AvatarGenerator.createColor(255, 255, 255);
        this.colorList = [
            AvatarGenerator.createColor(115, 221, 221),
            AvatarGenerator.createColor(251, 176, 64),
            AvatarGenerator.createColor(255, 92, 92),
            AvatarGenerator.createColor(53, 183, 41),
            AvatarGenerator.createColor(82, 113, 255),
            AvatarGenerator.createColor(183, 96, 230)
        ];
    }

    createAvatar(rng) {
        const image = PNGImage.createImage(IMAGE_SIZE, IMAGE_SIZE);

        AvatarGenerator.fillBackground(image, this.backgroundColor);

        const pictureColor = this.colorList[rng(0, this.colorList.length)];
        const blocks = AvatarGenerator.generateBlocks(rng);

        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            AvatarGenerator.drawBlock(image, block[0], block[1], pictureColor);
            AvatarGenerator.drawBlock(image, TOTAL_BLOCKS - 1 - block[0], block[1], pictureColor);
        }

        return image;
    }

    static generateBlocks(rng) {
        const hashesSet = new Set();
        const result = [];

        const blocksCount = rng(6, 10);

        while (hashesSet.size < blocksCount) {
            const x = rng(0, TOTAL_BLOCKS / 2);
            const y = rng(0, TOTAL_BLOCKS);
            if (!hashesSet.has((x * 6) + y)) {
                result.push([x, y]);
                hashesSet.add((x * 6) + y);
            }
        }

        return result;
    }

    static drawBlock(image, x, y, color) {
        for (let i = x * BLOCK_SIZE; i < (x + 1) * BLOCK_SIZE; i++) {
            for (let j = y * BLOCK_SIZE; j < (y + 1) * BLOCK_SIZE; j++) {
                image.setAt(i, j, color);
            }
        }

        return image;
    }

    static fillBackground(image, color) {
        for (let i = 0; i < image.getWidth(); i++) {
            for (let j = 0; j < image.getHeight(); j++) {
                image.setAt(i, j, color);
            }
        }

        return image;
    }

    static createColor(r, g, b) {
        return {
            red: r,
            green: g,
            blue: b,
            alpha: 255
        };
    }
}
