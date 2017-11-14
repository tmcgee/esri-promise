import { expect } from 'chai';
import { esriBootstrap } from '../../src';

export default () => (
    describe('esriBootstrap', () => {
        describe('with no arguments', () => {
            let loaded: boolean;
            beforeEach(() => {
                esriBootstrap().then(() => {
                    loaded = true;
                }).catch(() => {
                    loaded = false;
                });
            });

            it('should create a script tag', () => {
                expect(document.querySelector('script')).to.exist;
            });

            it('should set the script src equal to the latest version of jsapi', () => {
                const script = document.querySelector('script');
                if (script) {
                    expect(script.src).to.equal('https://js.arcgis.com/4.5/');
                } else {
                    throw new Error('The jsapi script could not be found!');
                }
            });

            it('should resolve when the script is loaded', (done) => {
                const script = document.querySelector('script');
                if (script) {
                    script.onload('foo' as any);
                    setTimeout(() => {
                        expect(loaded).to.be.true;
                        done();
                    }, 10);
                } else {
                    throw new Error('The jsapi script could not be found!');
                }
            });

            it('should reject if there is an error loading the script', (done) => {
                const script = document.querySelector('script');
                if (script) {
                    script.onerror('bar' as any);
                    setTimeout(() => {
                        expect(loaded).to.be.false;
                        done();
                    }, 10);
                }
            });

            afterEach(() => {
                const script = document.querySelector('script');
                if (script) {
                    document.body.removeChild(script);
                } else {
                    throw new Error('The jsapi script was never created!');
                }
            });
        });

        describe('with a version of the jsapi specified', () => {
            beforeEach(() => {
                esriBootstrap('https://js.arcgis.com/4.4/');
            });

            it('should set the script src according to the user specification', () => {
                const script = document.querySelector('script');
                if (script) {
                    expect(script.src).to.equal('https://js.arcgis.com/4.4/');
                } else {
                    throw new Error('The jsapi script could not be found!');
                }
            });

            afterEach(() => {
                const script = document.querySelector('script');
                if (script) {
                    document.body.removeChild(script);
                } else {
                    throw new Error('The jsapi script was never created!');
                }
            });
        });

        describe('with a custom dojoConfig specified', () => {
            beforeEach(() => {
                esriBootstrap('https://js.arcgis.com/4.5/', {
                    foo: 'bar'
                });
            });

            it('should set up window.dojoConfig', () => {
                expect(window['dojoConfig']).to.exist;
                expect(window['dojoConfig'].foo).to.equal('bar');
            });

            afterEach(() => {
                const script = document.querySelector('script');
                if (script) {
                    document.body.removeChild(script);
                } else {
                    throw new Error('The jsapi script was never created!');
                }
            });
        });

        describe('when the dojo loader has already been set up', () => {
            let loaded = true;
            beforeEach(() => {
                window['require'] = { on: true };
                esriBootstrap().catch(() => {
                    loaded = false;
                });
            });

            it('should not create a script', () => {
                const script = document.querySelector('script');
                expect(script).to.not.exist;
            });

            it('should reject the promise from esriBootstrap', () => {
                expect(loaded).to.be.false;
            });

            afterEach(() => {
                delete window['require'];
            });
        });
    })
);
