Object.assign(Rx, {
    isObservable,
    setup: setupReactComponent,
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
    setupLifeCycles(context);
    setupSetState(context);
    setupEvent(context);
    setupTrigger(context);
}

function setupLifeCycles(context) {
    overwriteLifeCycle(context, 'componentDidMount');
    overwriteLifeCycle(context, 'shouldComponentUpdate', { returnValue: false });
    overwriteLifeCycle(context, 'getSnapshotBeforeUpdate', { returnValue: null });
    overwriteLifeCycle(context, 'componentDidUpdate');
    overwriteLifeCycle(context, 'componentWillUnmount');
    overwriteLifeCycle(context, 'componentDidCatch');
    overwriteLifeCycle(context, 'getDerivedStateFromProps', { isStatic: true, returnValue: null });
}

function overwriteLifeCycle(context, name, options) {
    const isStatic = options && options.isStatic;
    const hasReturnValue = options && typeof options.returnValue !== 'undefined';
    const defaultLifeCycle = isStatic ? context.constructor[name] : context[name];

    context[`${name}$`] = new Rx.Subject();

    Object.assign(isStatic ? context.constructor : context, {
        [name]: (...args) => {
            context[`${name}$`].next(args);

            if (hasReturnValue) {
                return defaultLifeCycle
                    ? defaultLifeCycle.call(context, ...args)
                    : options.returnValue;
            }

            return defaultLifeCycle && defaultLifeCycle.call(context);
        },
    });
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
            const returnArgs = args.length ? args : eventArgs;

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
