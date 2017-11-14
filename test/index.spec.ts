import bootstrapTests from './functions/esriBootstrap.spec';
import promiseTests from './functions/esriPromise.spec';

describe('esriPromise', () => {
    bootstrapTests();
    promiseTests();
});
