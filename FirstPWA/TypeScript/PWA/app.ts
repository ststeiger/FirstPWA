/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';

import * as luxon from 'luxon';


interface location_t  {label: string, geo:string} ;

interface  locations_t { [key:string] : location_t };


interface IWeatherApp {
    selectedLocations: locations_t,
    addDialogContainer: HTMLElement,
};


const weatherApp : IWeatherApp = {
    selectedLocations: {},
    addDialogContainer: document.getElementById('addDialogContainer'),
};

// Toggles the visibility of the add location dialog box.
function toggleAddDialog()
{
    weatherApp.addDialogContainer.classList.toggle('visible');
}

// Event handler for butDialogAdd, adds the selected location to the list.
function addLocation()
{
    // Hide the dialog
    toggleAddDialog();
    // Get the selected city
    const select = <HTMLSelectElement>document.getElementById('selectCityToAdd');
    const selected = select.options[select.selectedIndex];
    const geo = selected.value;
    const label = selected.textContent;
    const location = { label: label, geo: geo };
    // Create a new card & get the weather data from the server
    const card = getForecastCard(location);
    
    getForecastFromNetwork(geo).then((forecast) =>
    {
        renderForecast(card, forecast);
    });
    // Save the updated list of selected cities.
    weatherApp.selectedLocations[geo] = location;
    saveLocationList(weatherApp.selectedLocations);
}

/**
 * Event handler for .remove-city, removes a location from the list.
 *
 * @param {Event} evt
 */
function removeLocation(evt:MouseEvent)
{
    const parent = (<HTMLElement>evt.target).parentElement
    parent.remove();
    if (weatherApp.selectedLocations[parent.id])
    {
        delete weatherApp.selectedLocations[parent.id];
        saveLocationList(weatherApp.selectedLocations);
    }
}

/**
 * Renders the forecast data into the card element.
 *
 * @param {Element} card The card element to update.
 * @param {Object} data Weather forecast data to update the element with.
 */
function renderForecast(card:HTMLElement, data:any)
{
    if (!data)
    {
        // There's no data, skip the update.
        return;
    }

    // Find out when the element was last updated.
    const cardLastUpdatedElem = card.querySelector('.card-last-updated');
    const cardLastUpdated = cardLastUpdatedElem.textContent;
    const lastUpdated = parseInt(cardLastUpdated);

    // If the data on the element is newer, skip the update.
    if (lastUpdated >= data.currently.time)
    {
        return;
    }
    cardLastUpdatedElem.textContent = data.currently.time;

    // Render the forecast data into the card.
    card.querySelector('.description').textContent = data.currently.summary;
    const forecastFrom = luxon.DateTime
        .fromSeconds(data.currently.time)
        .setZone(data.timezone)
        .toFormat('DDDD t');
    card.querySelector('.date').textContent = forecastFrom;
    card.querySelector('.current .icon')
        .className = `icon ${data.currently.icon}`;
    card.querySelector('.current .temperature .value')
        .textContent = Math.round(data.currently.temperature).toString();
    card.querySelector('.current .humidity .value')
        .textContent = Math.round(data.currently.humidity * 100).toString();
    card.querySelector('.current .wind .value')
        .textContent = Math.round(data.currently.windSpeed).toString();
    card.querySelector('.current .wind .direction')
        .textContent = Math.round(data.currently.windBearing).toString();
    const sunrise = luxon.DateTime
        .fromSeconds(data.daily.data[0].sunriseTime)
        .setZone(data.timezone)
        .toFormat('t');
    card.querySelector('.current .sunrise .value').textContent = sunrise;
    const sunset = luxon.DateTime
        .fromSeconds(data.daily.data[0].sunsetTime)
        .setZone(data.timezone)
        .toFormat('t');
    card.querySelector('.current .sunset .value').textContent = sunset;

    // Render the next 7 days.
    const futureTiles = card.querySelectorAll('.future .oneday');
    futureTiles.forEach((tile:HTMLElement, index:number) =>
    {
        const forecast = data.daily.data[index + 1];
        const forecastFor = luxon.DateTime
            .fromSeconds(forecast.time)
            .setZone(data.timezone)
            .toFormat('ccc');
        tile.querySelector('.date').textContent = forecastFor;
        tile.querySelector('.icon').className = `icon ${forecast.icon}`;
        tile.querySelector('.temp-high .value')
            .textContent = Math.round(forecast.temperatureHigh).toString();
        tile.querySelector('.temp-low .value')
            .textContent = Math.round(forecast.temperatureLow).toString();
    });

    // If the loading spinner is still visible, remove it.
    const spinner = card.querySelector('.card-spinner');
    if (spinner)
    {
        card.removeChild(spinner);
    }
}


// C = (5/9) * (F - 32)
function f2c(F:number)
{
    return (5/9) * (F - 32);
}


// km = m * 1.60934
function mph2kmh(m:number)
{
    return m * 1.60934;
}



/**
 * Get's the latest forecast data from the network.
 *
 * @param {string} coords Location object to.
 * @return {Object} The weather forecast, if the request fails, return null.
 */
async function getForecastFromNetwork(coords:string, metric?:boolean)
{
    try
    {
        let response = await fetch(`/forecast/${coords}`);
        let txt = await response.text();
        // console.log("got text", txt);
        
        let json = JSON.parse(txt);
        
        if(metric == null)
            metric= true;
        
        if(metric)
        {
            if(json && json.currently)
            {
                json.currently.temperature = f2c(json.currently.temperature);
                json.currently.windSpeed = mph2kmh(json.currently.windSpeed);
            }
            
            if(json && json.daily && json.daily.data)
            {
                for(let i = 0; i < json.daily.data.length;++i)
                {
                    json.daily.data[i].temperatureHigh = f2c(json.daily.data[i].temperatureHigh);
                    json.daily.data[i].temperatureLow = f2c(json.daily.data[i].temperatureLow);
                } // Next i 
            }
        }
        
        return json;
    }
    catch (err)
    {
        console.log("error: getForecastFromNetwork", err);
        return null;
    }
    

    /*
    return fetch(`/forecast/${coords}`)
        .then((response) =>
        {
            // return response.json();

            var txt = response.text();
            console.log("got text", txt);

            return JSON.parse(txt);
        })
        .catch((error) =>
        {
            console.log("error: getForecastFromNetwork", error);
            return null;
        });
    */
}

/**
 * Get's the cached forecast data from the caches object.
 *
 * @param {string} coords Location object to.
 * @return {Object} The weather forecast, if the request fails, return null.
 */
function getForecastFromCache(coords:string)
{
    // CODELAB: Add code to get weather forecast from the caches object.
    
}

/**
 * Get's the HTML element for the weather forecast, or clones the template
 * and adds it to the DOM if we're adding a new item.
 *
 * @param {Object} location Location object
 * @return {Element} The element for the weather forecast.
 */
function getForecastCard(location:location_t)
{
    const id = location.geo;
    const card = document.getElementById(id);
    if (card)
    {
        return card;
    }
    const newCard =<HTMLElement> document.getElementById('weather-template').cloneNode(true);
    newCard.querySelector('.location').textContent = location.label;
    newCard.setAttribute('id', id);
    newCard.querySelector('.remove-city')
        .addEventListener('click', removeLocation);
    document.querySelector('main').appendChild(newCard);
    newCard.removeAttribute('hidden');
    return newCard;
}

// Gets the latest weather forecast data and updates each card with the new data.
function updateData()
{
    Object.keys(weatherApp.selectedLocations).forEach((key) =>
    {
        const location:location_t = <location_t> <any>weatherApp.selectedLocations[key];
        const card = getForecastCard(location);
        // CODELAB: Add code to call getForecastFromCache

        // Get the forecast data from the network.
        getForecastFromNetwork(location.geo)
            .then((forecast) =>
            {
                renderForecast(card, forecast);
            });
    });
}

/**
 * Saves the list of locations.
 *
 * @param {Object} locations The list of locations to save.
 */
function saveLocationList(locations:locations_t)
{
    const data = JSON.stringify(locations);
    localStorage.setItem('locationList', data);
}


// Loads the list of saved location.
function loadLocationList():locations_t
{
    let json:string = localStorage.getItem('locationList');
    let locations :locations_t;
    if (json)
    {
        try
        {
            locations = JSON.parse(json);
        } catch (ex)
        {
            locations = {};
        }
    }
    if (!locations || Object.keys(locations).length === 0)
    {
        const key = '40.7720232,-73.9732319';
        locations = {};
        locations[key] = { label: 'New York City', geo: '40.7720232,-73.9732319' };
    }
    return locations;
}







// Initialize the app, gets the list of locations from local storage, then renders the initial data.
function init()
{
    // Get the location list, and update the UI.
    weatherApp.selectedLocations = loadLocationList();
    updateData();

    // Set up the event handlers for all of the buttons.
    document.getElementById('butRefresh').addEventListener('click', updateData);
    document.getElementById('butAdd').addEventListener('click', toggleAddDialog);
    document.getElementById('butDialogCancel')
        .addEventListener('click', toggleAddDialog);
    document.getElementById('butDialogAdd')
        .addEventListener('click', addLocation);
}

init();
