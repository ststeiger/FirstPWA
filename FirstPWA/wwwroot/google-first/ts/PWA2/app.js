'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import luxon from "./luxon.js";
var weatherApp = {
    selectedLocations: {},
    addDialogContainer: document.getElementById('addDialogContainer'),
};
function toggleAddDialog() {
    weatherApp.addDialogContainer.classList.toggle('visible');
}
function addLocation() {
    toggleAddDialog();
    var select = document.getElementById('selectCityToAdd');
    var selected = select.options[select.selectedIndex];
    var geo = selected.value;
    var label = selected.textContent;
    var location = { label: label, geo: geo };
    var card = getForecastCard(location);
    getForecastFromNetwork(geo).then(function (forecast) {
        renderForecast(card, forecast);
    });
    weatherApp.selectedLocations[geo] = location;
    saveLocationList(weatherApp.selectedLocations);
}
function removeLocation(evt) {
    var parent = evt.target.parentElement;
    parent.remove();
    if (weatherApp.selectedLocations[parent.id]) {
        delete weatherApp.selectedLocations[parent.id];
        saveLocationList(weatherApp.selectedLocations);
    }
}
function renderForecast(card, data) {
    if (!data) {
        return;
    }
    var cardLastUpdatedElem = card.querySelector('.card-last-updated');
    var cardLastUpdated = cardLastUpdatedElem.textContent;
    var lastUpdated = parseInt(cardLastUpdated);
    if (lastUpdated >= data.currently.time) {
        return;
    }
    cardLastUpdatedElem.textContent = data.currently.time.toString();
    card.querySelector('.description').textContent = data.currently.summary;
    var forecastFrom = luxon.DateTime
        .fromSeconds(data.currently.time)
        .setZone(data.timezone)
        .toFormat('DDDD t');
    card.querySelector('.date').textContent = forecastFrom;
    card.querySelector('.current .icon')
        .className = "icon " + data.currently.icon;
    card.querySelector('.current .temperature .value')
        .textContent = Math.round(data.currently.temperature).toString();
    card.querySelector('.current .humidity .value')
        .textContent = Math.round(data.currently.humidity * 100).toString();
    card.querySelector('.current .wind .value')
        .textContent = Math.round(data.currently.windSpeed).toString();
    card.querySelector('.current .wind .direction')
        .textContent = Math.round(data.currently.windBearing).toString();
    var sunrise = luxon.DateTime
        .fromSeconds(data.daily.data[0].sunriseTime)
        .setZone(data.timezone)
        .toFormat('t');
    card.querySelector('.current .sunrise .value').textContent = sunrise;
    var sunset = luxon.DateTime
        .fromSeconds(data.daily.data[0].sunsetTime)
        .setZone(data.timezone)
        .toFormat('t');
    card.querySelector('.current .sunset .value').textContent = sunset;
    var futureTiles = card.querySelectorAll('.future .oneday');
    futureTiles.forEach(function (tile, index) {
        var forecast = data.daily.data[index + 1];
        var forecastFor = luxon.DateTime
            .fromSeconds(forecast.time)
            .setZone(data.timezone)
            .toFormat('ccc');
        tile.querySelector('.date').textContent = forecastFor;
        tile.querySelector('.icon').className = "icon " + forecast.icon;
        tile.querySelector('.temp-high .value')
            .textContent = Math.round(forecast.temperatureHigh).toString();
        tile.querySelector('.temp-low .value')
            .textContent = Math.round(forecast.temperatureLow).toString();
    });
    var spinner = card.querySelector('.card-spinner');
    if (spinner) {
        card.removeChild(spinner);
    }
}
function f2c(F) {
    return (5 / 9) * (F - 32);
}
function mph2kmh(m) {
    return m * 1.60934;
}
function getForecastFromNetwork(coords, metric) {
    return __awaiter(this, void 0, void 0, function () {
        var response, txt, json, i, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4, fetch("/forecast/" + coords)];
                case 1:
                    response = _a.sent();
                    return [4, response.text()];
                case 2:
                    txt = _a.sent();
                    json = JSON.parse(txt);
                    if (metric == null)
                        metric = true;
                    if (metric) {
                        if (json && json.currently) {
                            json.currently.temperature = f2c(json.currently.temperature);
                            json.currently.windSpeed = mph2kmh(json.currently.windSpeed);
                        }
                        if (json && json.daily && json.daily.data) {
                            for (i = 0; i < json.daily.data.length; ++i) {
                                json.daily.data[i].temperatureHigh = f2c(json.daily.data[i].temperatureHigh);
                                json.daily.data[i].temperatureLow = f2c(json.daily.data[i].temperatureLow);
                            }
                        }
                    }
                    return [2, json];
                case 3:
                    err_1 = _a.sent();
                    console.log("error: getForecastFromNetwork", err_1);
                    return [2, null];
                case 4: return [2];
            }
        });
    });
}
function getForecastFromCache(coords) {
}
function getForecastCard(location) {
    var id = location.geo;
    var card = document.getElementById(id);
    if (card) {
        return card;
    }
    var newCard = document.getElementById('weather-template').cloneNode(true);
    newCard.querySelector('.location').textContent = location.label;
    newCard.setAttribute('id', id);
    newCard.querySelector('.remove-city')
        .addEventListener('click', removeLocation);
    document.querySelector('main').appendChild(newCard);
    newCard.removeAttribute('hidden');
    return newCard;
}
function updateData() {
    Object.keys(weatherApp.selectedLocations).forEach(function (key) {
        var location = weatherApp.selectedLocations[key];
        var card = getForecastCard(location);
        getForecastFromNetwork(location.geo)
            .then(function (forecast) {
            renderForecast(card, forecast);
        });
    });
}
function saveLocationList(locations) {
    var data = JSON.stringify(locations);
    localStorage.setItem('locationList', data);
}
function loadLocationList() {
    var json = localStorage.getItem('locationList');
    var locations;
    if (json) {
        try {
            locations = JSON.parse(json);
        }
        catch (ex) {
            locations = {};
        }
    }
    if (!locations || Object.keys(locations).length === 0) {
        var key = '40.7720232,-73.9732319';
        locations = {};
        locations[key] = { label: 'New York City', geo: '40.7720232,-73.9732319' };
    }
    return locations;
}
function init() {
    weatherApp.selectedLocations = loadLocationList();
    updateData();
    document.getElementById('butRefresh').addEventListener('click', updateData);
    document.getElementById('butAdd').addEventListener('click', toggleAddDialog);
    document.getElementById('butDialogCancel')
        .addEventListener('click', toggleAddDialog);
    document.getElementById('butDialogAdd')
        .addEventListener('click', addLocation);
}
init();
