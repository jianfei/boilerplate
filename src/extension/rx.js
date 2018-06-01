Object.assign(Rx, {
    isObservable,
    setup: setupReactComponent,
});

Object.assign(Rx.Observable, {
    fromRequest,
});

Object.assign(Rx.Observable.prototype, {
    delayRetry,
});

function isObservable(target) {
    if (!target) {
        return false;
    }

    const isInstance = target instanceof Rx.Observable;
    const isObservableLike = typeof target.lift === 'function'
        && typeof target.subscribe === 'function';

    return isInstance || isObservableLike;
}

function setupReactComponent(context) {
    setupSetState(context);
    setupEvent(context);
    setupTrigger(context);
}

function setupSetState(context) {
    context.setState$ = (...args) => {
        args.forEach(arg => {
            if (isObservable(arg)) {
                arg.subscribe(values => {
                    if (typeof values === 'object') {
                        context.setState(values);
                    }
                });
            }
            else if (typeof arg === 'object') {
                Object.keys(arg).forEach(key => {
                    if (typeof arg[key].subscribe === 'function') {
                        arg[key].subscribe(value => context.setState({ [key]: value }));
                    }
                });
            }
        });
    };
}

function setupEvent(context) {
    context.event$ = eventName => {
        if (!context[`${eventName}$`]) {
            context[`${eventName}$`] = new Rx.Subject();
        }

        return context[`${eventName}$`];
    };
}

function setupTrigger(context) {
    context.trigger$ = (eventName, ...args) => {
        const event$ = context.event$(eventName);

        return (...eventArgs) => {
            const returnArgs = args.concat(eventArgs);

            if (returnArgs.length > 1) {
                return event$.next(returnArgs);
            }
            else if (returnArgs.length === 1) {
                return event$.next(returnArgs[0]);
            }

            return event$.next();
        };
    };
}

function fromRequest(requestPromise, ...args) {
    return Rx.Observable.defer(() => Rx.Observable.fromPromise(requestPromise(...args)));
}

function delayRetry(delay = 3000, timesRetry = 1) {
    const results = [];

    return this.retryWhen(errors =>
        errors
            .mergeMap(error => {
                results.push(error);

                if (results.length <= timesRetry) {
                    return Rx.Observable.of(error);
                }

                return Rx.Observable.throw(results);
            })
            .delay(delay),
    );
}
