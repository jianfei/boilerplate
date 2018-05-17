Rx.setup = context => {
    setupLifeCycles(context);
};

function setupLifeCycles(context) {
    const lifeCycles = {
        componentDidMount: context.componentDidMount,
        getDerivedStateFromProps: context.constructor.getDerivedStateFromProps,
        shouldComponentUpdate: context.shouldComponentUpdate,
        getSnapshotBeforeUpdate: context.getSnapshotBeforeUpdate,
        componentDidUpdate: context.componentDidUpdate,
        componentWillUnmount: context.componentWillUnmount,
        componentDidCatch: context.componentDidCatch,
    };

    Object.assign(context, {
        componentDidMount$: new Rx.Subject(),
        getDerivedStateFromProps$: new Rx.Subject(),
        shouldComponentUpdate$: new Rx.Subject(),
        getSnapshotBeforeUpdate$: new Rx.Subject(),
        componentDidUpdate$: new Rx.Subject(),
        componentWillUnmount$: new Rx.Subject(),
        componentDidCatch$: new Rx.Subject(),
    });

    Object.assign(context, {
        componentDidMount: () => {
            context.componentDidMount$.next();

            return lifeCycles.componentDidMount.call(context);
        },

        shouldComponentUpdate: (nextProps, nextState) => {
            context.shouldComponentUpdate$.next([nextProps, nextState]);

            return lifeCycles.shouldComponentUpdate
                ? lifeCycles.shouldComponentUpdate.call(context, nextProps, nextState)
                : true;
        },

        getSnapshotBeforeUpdate: (prevProps, prevState) => {
            context.getSnapshotBeforeUpdate$.next([prevProps, prevState]);

            return lifeCycles.getSnapshotBeforeUpdate
                ? lifeCycles.getSnapshotBeforeUpdate.call(context, prevProps, prevState)
                : null;
        },

        componentDidUpdate: (prevProps, prevState, snapshot) => {
            context.componentDidUpdate$.next([prevProps, prevState, snapshot]);

            return lifeCycles.componentDidUpdate
                && lifeCycles.componentDidUpdate.call(context, prevProps, prevState, snapshot);
        },

        componentWillUnmount: () => {
            context.componentWillUnmount$.next();

            return lifeCycles.componentWillUnmount
                && lifeCycles.componentWillUnmount.call(context);
        },

        componentDidCatch: (error, info) => {
            context.componentDidCatch$.next([error, info]);

            return lifeCycles.componentDidCatch
                && lifeCycles.componentDidCatch.call(context, error, info);
        },
    });

    context.constructor.getDerivedStateFromProps = (nextProps, prevState) => {
        context.getDerivedStateFromProps$.next([nextProps, prevState]);

        return lifeCycles.getDerivedStateFromProps
            ? lifeCycles.getDerivedStateFromProps.call(context, nextProps, prevState)
            : prevState;
    };
}
