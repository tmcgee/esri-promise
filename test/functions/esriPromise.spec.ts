import { expect } from 'chai';
import * as sinon from 'sinon';
import createMockRequire from '../doubles/mockRequire';

import { esriPromise } from '../../src';

export default () => (
    describe('esriPromise', () => {
        describe('the js api has been bootstrapped', () => {
            beforeEach(() => {
                window['require'] = sinon.stub();
                window['require'].on = sinon.stub();
                esriPromise(['foo', 'bar']);
            });

            it('should call require with the specified modules', () => {
                const modules = window['require'].lastCall.args[0];
                expect(modules.length).to.equal(2);
                expect(modules[0]).to.equal('foo');
                expect(modules[1]).to.equal('bar');
            });

            it('should register an error handler with the dojo require', () => {
                expect(window['require'].on.callCount).to.be.above(0);
            });

            describe('the module request succeeds', () => {
                const stub = sinon.stub();
                beforeEach((done) => {
                    window['require'] = createMockRequire(true);
                    esriPromise(['foo', 'bar']).then(stub);
                    setTimeout(() => {
                        done();
                    }, 10);
                });

                it('should resolve esriPromise', () => {
                    expect(stub.callCount).to.be.above(0);
                });

                it('should resolve esriPromise with an array of modules corresponding to the args', () => {
                    const modules = stub.lastCall.args[0];
                    expect(modules.length).to.equal(2);
                });

                it('should remove the corresponding error handler from dojo require', () => {
                    expect(window['require'].subscribers.length).to.equal(0);
                });

                afterEach(() => {
                    delete window['require'];
                });
            });

            describe('the module request fails', () => {
                const stub = sinon.stub();
                beforeEach((done) => {
                    window['require'] = createMockRequire(false);
                    esriPromise(['foo', 'bar']).then(() => {
                        throw new Error('The request was successful for some reason..');
                    }).catch(stub);
                    setTimeout(() => {
                        done();
                    }, 10);
                });

                it('should reject esriPromise', () => {
                    expect(stub.callCount).to.be.above(0);
                });

                it('should remove the corresponding error handler from dojo require', () => {
                    expect(window['require'].subscribers.length).to.equal(0);
                });

                afterEach(() => {
                    delete window['require'];
                });
            });

            afterEach(() => {
                delete window['require'];
            });
        });

        describe('the js api has not yet been bootstrapped', () => {
            beforeEach(() => {
                esriPromise(['foobar']);
            });

            it('should bootstrap the js api', () => {
                expect(document.querySelector('script')).to.exist;
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

        describe('it fails to bootstrap the js api', () => {
            const stub = sinon.stub();
            beforeEach((done) => {
                esriPromise(['foobar']).catch(stub);
                const script = document.querySelector('script');
                if (script) {
                    script.onerror('bar' as any);
                    setTimeout(() => {
                        done();
                    }, 10);
                }
            });

            it('should bubble the error up to the user', () => {
                expect(stub.callCount).to.be.above(0);
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

        describe('an alternate amd loader is being used', () => {
            it('should still bootstrap the js api', () => {
                window['require'] = {};
                esriPromise(['foobar']);
                expect(document.querySelector('script')).to.exist;
            });

            after(() => {
                const script = document.querySelector('script');
                if (script) {
                    document.body.removeChild(script);
                } else {
                    throw new Error('The jsapi script was never created!');
                }
            });
        });
    })
);
