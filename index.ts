import { Promise } from 'es6-promise';

function isLoaded(): boolean {
    // Make sure there is a global require and that it is dojo's
    return !!window['require'] && !!window['require'].on;
}

function dojoPromise(modules: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        // If something goes wrong loading the esri/dojo scripts, reject with the error.
        const handle = window['require'].on('error', (err: Error) => {
            handle.remove();
            reject(err);
        });
        window['require'](modules, (...args: any[]) => {
            handle.remove();
            // Resolve with the parameters from dojo require as an array.
            resolve(args);
        });
    });
}

export function esriBootstrap(url?: string, dojoConfig?: { [propName: string]: any }): Promise<any> {
    return new Promise((resolve, reject) => {
        if (isLoaded()) {
            // If the API is already loaded, reject with an error message.
            reject('The ArcGIS API for JavaScript has already been loaded!');
        }

        if (!url) {
            url = 'https://js.arcgis.com/4.5/';
        }

        if (dojoConfig) {
            window['dojoConfig'] = dojoConfig;
        }

        const script = document.createElement('script');
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
        return esriBootstrap().then(() => dojoPromise(modules));
    } else {
        return dojoPromise(modules);
    }
}

export default esriPromise;
