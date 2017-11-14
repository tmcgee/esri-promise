export default function createMockRequire(shouldSucceed: boolean) {
    const subscribers: any[] = [];
    const require = (modules: string[], callback: () => any) => {
        if (shouldSucceed) {
            callback(...modules);
        } else {
            window['require'].throwError();
        }
    };
    require['subscribers'] = subscribers;
    require['on'] = (event: string, handler: (e: Error) => any) => {
        subscribers.push(handler);
        return {
            remove: () => {
                const index = subscribers.indexOf(handler);
                subscribers.splice(index, 1);
            }
        };
    };
    require['throwError'] = () => {
        subscribers.forEach((handler) => {
            handler('foo');
        });
    };
    return require;
};
