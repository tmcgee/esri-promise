import { Promise } from 'es6-promise';

function isLoaded(): boolean {
    return typeof window['require'] !== 'undefined';
}

function dojoPromise(modules: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        // If something goes wrong loading the esri/dojo scripts, reject with the error.
        window['require'].on("error", reject);
        window['require'](modules, (...args) => {
            // Resolve with the parameters from dojo require as an array.
            resolve(args);
        });
    });
}

export function esriBootstrap(url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
        if (isLoaded()) {
            // If the API is already loaded, reject with an error message.
            reject('The ArcGIS API for JavaScript has already been loaded!');
        }

        if (!url) {
            url = 'https://js.arcgis.com/4.3/';
        }

        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = () => {
            // Resolve after the script is loaded.
            resolve();
        };
        // Reject if something goes wrong loading the script.
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

export function esriPromise(modules: string[]): Promise<any> {
    if (!isLoaded()) {
        return esriBootstrap().then(() => dojoPromise(modules))
    }
    else {
        return dojoPromise(modules);
    }
}