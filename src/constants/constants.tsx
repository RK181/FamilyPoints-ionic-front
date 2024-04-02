// APP constants
const API_URL = "http://localhost:8000/api".replace(/\/+$/, "");
const TOKEN_KEY = "accessToken";

const appIcons = [
    { name: '1', img: '/coins/coconut.svg' },
    { name: 'eur', img: '/coins/coin-e.svg' },
    { name: 'dolar', img: '/coins/coin-s.svg' },
    { name: 'mops', img: '/coins/dog-mops.svg' },
    { name: 'dog', img: '/coins/dog.svg' },
    { name: 'warhammer', img: '/coins/warhammer.svg' },
];

const getIcon = (name: string) => {
    return appIcons.find((icon) => icon.name == name)?.img;
}

export { API_URL, TOKEN_KEY, appIcons, getIcon };