import './style.css'
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import MousePosition from 'ol/control/MousePosition';
import {defaults as defaultControls} from 'ol/control.js';
import Graticule from 'ol/layer/Graticule';
import Stroke from 'ol/style/Stroke';
import {format} from 'ol/coordinate';

const defaultUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const urlFromLocalStorage = localStorage.getItem('serverurl');
const urlInput = document.querySelector('.server-url') as HTMLInputElement
urlInput.value = urlFromLocalStorage ? urlFromLocalStorage : ''

const url = urlInput.value === '' ? defaultUrl : `${urlInput.value}?&x={x}&y={y}&z={z}`;

const template = 'Ш: <strong style="color: darkred;">{y}</strong> Д: <strong style="color: darkred;">{x}</strong>';

const mousePositionControl = new MousePosition({
    coordinateFormat: (coordinate: any): string => format(coordinate, template, 4),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position') as HTMLElement,
});

const tileLayer = new TileLayer({
        source: new OSM({
            url
        }),
    })
tileLayer.set('id', 'osmId');

const graticule = new Graticule({
    strokeStyle: new Stroke({
        color: 'rgba(84,41,3,0.5)',
        width: 1,
        lineDash: [3, 1],
    }),
    showLabels: true,
    wrapX: false,
})

const map = new Map({
    controls: defaultControls().extend([mousePositionControl]),
    layers: [tileLayer, graticule],
    target: 'map',
    view: new View({
        center: [0, 0], zoom: 2,
    }),
});

const view = map.getView();
view.on('change:center', () => {
    const zoomValue = document.querySelector('.zoom-value');
    if (zoomValue) {
        zoomValue.innerHTML = view.getZoom()!.toFixed();
    }
})

function listener(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    localStorage.setItem('serverurl', value);

    if (value) {
        (tileLayer.getSource() as OSM).setUrl(`${value}?&x={x}&y={y}&z={z}`);
    } else {
        (tileLayer.getSource() as OSM).setUrl(defaultUrl);
    }
}

urlInput.addEventListener('input', listener)
urlInput.addEventListener('blur', listener)
