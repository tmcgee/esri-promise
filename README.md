# esri-promise
Very lightweight promise wrapper for asynchronous loading of [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) modules.

This was completely inspired by and modeled after Tom Wayson's very useful library [esri-loader](https://www.npmjs.com/package/esri-loader). See his blog post on why this sort of thing could be useful [here](http://tomwayson.com/2016/11/27/using-the-arcgis-api-for-javascript-in-applications-built-with-webpack/).

## Installation

```bash
npm install esri-promise
```

## New in 0.3.x:

Esri-promise will now use version 4.4 of the ArcGIS JS API by default.

## New in 0.2.x!

Now in version 0.2.x, you can pass dojo configuration parameters into `esriBootstrap` like so:

```js
import esriPromise, { esriBootstrap } from 'esri-promise';

const package_path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));

esriBootstrap('https://js.arcgis.com/4.3/', {
  async: true,
  packages: [
    {
      location: package_path + '/config',
      name: 'config'
    }
  ]
}).then(() => {
    esriPromise([
        'dojo/text!config/test.json'
    ]).then(([
        result
    ]) => {
        console.log(result);
    });
});

```

This helps you use dojo plugins like text and i18n in conjunction with esri-promise.

## Use

By default, esri-promise will use version 4.4 of the ArcGIS API for JavaScript (*or whatever version has already been loaded through esriBootstrap('url')*):

```js
import { esriPromise } from 'esri-promise';

esriPromise([
    'esri/Map',
    'esri/views/MapView'
]).then(([Map, MapView]) => { // Modules come back as an array, so array destructuring is convenient here.
    // Make a map with the Map and MapView modules from the API.
})
.catch((err) => {
    handle(err);
});

function handle(err) {
    // Do something with the error.
}
```

Alternatively, you can specify a version by calling `esriBootstrap('url')` (this also returns a promise):

```js
import { esriPromise, esriBootstrap } from 'esri-promise';

esriBootstrap('https://js.arcgis.com/3.20/').then(() => {
  esriPromise([
    'esri/map',
    'esri/views/MapView'
  ]).then(([Map, MapView]) => {
    // Make a map with v3 of the API.
  })
  .catch((err) => {
    // Do something with a module load error.
  });
}).catch((err) => {
  // Shucks, couldn't load the API
});
```