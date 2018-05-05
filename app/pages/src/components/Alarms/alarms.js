import Artas0 from './files/Artas/0.mp3';
import Artas1 from './files/Artas/1.mp3';
import Artas2 from './files/Artas/2.mp3';
import Artas3 from './files/Artas/3.mp3';
import ArtasRemove from './files/Artas/remove.mp3';
import ArtasAdd from './files/Artas/add.mp3';
import ArtasImg from './files/Artas/img.jpg';

import Undead0 from './files/Undead/0.mp3';
import Undead1 from './files/Undead/1.mp3';
import Undead2 from './files/Undead/2.mp3';
import Undead3 from './files/Undead/3.mp3';
import UndeadRemove from './files/Undead/remove.mp3';
import UndeadAdd from './files/Undead/add.mp3';
import UndeadImg from './files/Undead/img.jpg';

import Succubus0 from './files/Succubus/0.mp3';
import Succubus1 from './files/Succubus/1.mp3';
import Succubus2 from './files/Succubus/2.mp3';
import Succubus3 from './files/Succubus/3.mp3';
import SuccubusRemove from './files/Succubus/remove.mp3';
import SuccubusAdd from './files/Succubus/add.mp3';
import SuccubusImg from './files/Succubus/img.jpg';

import Thrall0 from './files/Thrall/0.mp3';
import Thrall1 from './files/Thrall/1.mp3';
import Thrall2 from './files/Thrall/2.mp3';
import Thrall3 from './files/Thrall/3.mp3';
import ThrallRemove from './files/Thrall/remove.mp3';
import ThrallAdd from './files/Thrall/add.mp3';
import ThrallImg from './files/Thrall/img.jpg';

import CenaShort from './files/Cena/short.mp3';
import CenaLong from './files/Cena/long.mp3';
import CenaImg from './files/Cena/img.jpg';

import DIMONShort from './files/DIMON/short.mp3';
import DIMONLong from './files/DIMON/long.mp3';
import DIMONImg from './files/DIMON/img.jpg';

import Cant from './files/Common/cant.mp3';

export const alarmsInfo = [
    {
        voice: 'Artas',
        name: 'Артас',
        add: ArtasAdd,
        remove: ArtasRemove,
        sounds: [Artas0, Artas1, Artas2, Artas3],
        img: ArtasImg,
        interval: 3000
    },
    {
        voice: 'Undead',
        name: 'Плеть',
        add: UndeadAdd,
        remove: UndeadRemove,
        sounds: [Undead0, Undead1, Undead2, Undead3],
        img: UndeadImg,
        interval: 3000
    },
    {
        voice: 'Sucubus',
        name: 'Суккуб',
        add: SuccubusAdd,
        remove: SuccubusRemove,
        sounds: [Succubus0, Succubus1, Succubus2, Succubus3],
        img: SuccubusImg,
        interval: 2000
    },
    {
        voice: 'Thrall',
        name: 'Тралл',
        add: ThrallAdd,
        remove: ThrallRemove,
        sounds: [Thrall0, Thrall1, Thrall2, Thrall3],
        img: ThrallImg,
        interval: 2000
    },
    {
        voice: 'Cena',
        name: 'Джон Сина',
        add: CenaShort,
        remove: CenaShort,
        sounds: [CenaLong],
        img: CenaImg,
        interval: 10000
    },
    {
        voice: 'DIMON',
        name: 'ДИМОООООН',
        add: DIMONShort,
        remove: DIMONShort,
        sounds: [DIMONLong],
        img: DIMONImg,
        interval: 10000
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
    sound = new Audio(src);
    sound.play();
};

export const playSound = (voice, soundName) => {
    const foundedVoice = alarms.find(i => i.voice === voice);
    playSoundSrc(foundedVoice && foundedVoice[soundName] ? foundedVoice[soundName] : null);
};
