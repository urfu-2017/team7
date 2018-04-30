import ArtasAdd from './files/Artas/add.mp3';
import UndeadAdd from './files/Undead/add.mp3';

import ArtasImg from './files/Artas/img.jpg';
import UndeadImg from './files/Undead/img.jpg';

import UndeadRemove from './files/Undead/remove.mp3';
import ArtasRemove from './files/Artas/remove.mp3';

import Artas0 from './files/Artas/0.mp3';
import Artas1 from './files/Artas/1.mp3';
import Artas2 from './files/Artas/2.mp3';
import Artas3 from './files/Artas/3.mp3';

import Undead0 from './files/Undead/0.mp3';
import Undead1 from './files/Undead/1.mp3';
import Undead2 from './files/Undead/2.mp3';
import Undead3 from './files/Undead/3.mp3';

import Cant from './files/Common/cant.mp3';

export const alarmsInfo = [
    {
        voice: 'Artas',
        name: 'Артас',
        add: ArtasAdd,
        remove: ArtasRemove,
        sounds: [Artas0, Artas1, Artas2, Artas3],
        img: ArtasImg,
        header: 'За Лордерон!',
        interval: 3000
    },
    {
        voice: 'Undead',
        name: 'Плеть',
        add: UndeadAdd,
        remove: UndeadRemove,
        sounds: [Undead0, Undead1, Undead2, Undead3],
        img: UndeadImg,
        header: 'Мертвые идут!',
        interval: 3000
    }
];

const alarms = [
    ...alarmsInfo,
    {
        voice: 'common',
        cant: Cant
    }
];

let sound = null;

export const stopSound = () => {
    if (sound) {
        sound.pause();
    }
};

export const playSoundSrc = (src) => {
    stopSound();
    // eslint-disable-next-line
    sound = new Audio(src);
    sound.play();
};

export const playSound = (voice, soundName) => {
    const foundedVoice = alarms.find(i => i.voice === voice);
    playSoundSrc(foundedVoice && foundedVoice[soundName] ? foundedVoice[soundName] : null);
};
