const Artas0 = '/static/alarms/Artas/0.mp3';
const Artas1 = '/static/alarms/Artas/1.mp3';
const Artas2 = '/static/alarms/Artas/2.mp3';
const Artas3 = '/static/alarms/Artas/3.mp3';
const ArtasRemove = '/static/alarms/Artas/remove.mp3';
const ArtasAdd = '/static/alarms/Artas/add.mp3';
const ArtasImg = '/static/alarms/Artas/img.jpg';

const Undead0 = '/static/alarms/Undead/0.mp3';
const Undead1 = '/static/alarms/Undead/1.mp3';
const Undead2 = '/static/alarms/Undead/2.mp3';
const Undead3 = '/static/alarms/Undead/3.mp3';
const UndeadRemove = '/static/alarms/Undead/remove.mp3';
const UndeadAdd = '/static/alarms/Undead/add.mp3';
const UndeadImg = '/static/alarms/Undead/img.jpg';

const Succubus0 = '/static/alarms/Succubus/0.mp3';
const Succubus1 = '/static/alarms/Succubus/1.mp3';
const Succubus2 = '/static/alarms/Succubus/2.mp3';
const Succubus3 = '/static/alarms/Succubus/3.mp3';
const SuccubusRemove = '/static/alarms/Succubus/remove.mp3';
const SuccubusAdd = '/static/alarms/Succubus/add.mp3';
const SuccubusImg = '/static/alarms/Succubus/img.jpg';

const Thrall0 = '/static/alarms/Thrall/0.mp3';
const Thrall1 = '/static/alarms/Thrall/1.mp3';
const Thrall2 = '/static/alarms/Thrall/2.mp3';
const Thrall3 = '/static/alarms/Thrall/3.mp3';
const ThrallRemove = '/static/alarms/Thrall/remove.mp3';
const ThrallAdd = '/static/alarms/Thrall/add.mp3';
const ThrallImg = '/static/alarms/Thrall/img.jpg';

const CenaShort = '/static/alarms/Cena/short.mp3';
const CenaLong = '/static/alarms/Cena/long.mp3';
const CenaImg = '/static/alarms/Cena/img.jpg';

const DIMONShort = '/static/alarms/DIMON/short.mp3';
const DIMONLong = '/static/alarms/DIMON/long.mp3';
const DIMONImg = '/static/alarms/DIMON/img.jpg';

const Cant = '/static/alarms/Common/cant.mp3';

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
