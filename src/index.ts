function isLoaded(): boolean {
    if (!!window['require']) {
        if (!window['require'].on) {
            console.warn('A non-dojo AMD loader is already present. This is incompatible with the ArcGIS API for JavaScript. The existing loader will be replaced with the dojo loader.');
            return false;
        }
        return true;
    }
    return false;
}

function dojoPromise(modules: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        const handle = window['require'].on('error', (err: Error) => {
            handle.remove();
            reject(err);
        });
        window['require'](modules, (...args: any[]) => {
            handle.remove();
            resolve(args);
        });
    });
}

export function esriBootstrap(url?: string, dojoConfig?: { [propName: string]: any }): Promise<any> {
    return new Promise((resolve, reject) => {
        if (isLoaded()) {
            reject('The ArcGIS API for JavaScript has already been loaded!');
        } else {
            if (!url) {
                url = 'https://js.arcgis.com/4.9/';
            }

            if (dojoConfig) {
                window['dojoConfig'] = dojoConfig;
            }

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        }
    });
}

export async function esriPromise(modules: string[]): Promise<any> {
    if (!isLoaded()) {
        await esriBootstrap();
    }
    return dojoPromise(modules);
}

export default esriPromise;
