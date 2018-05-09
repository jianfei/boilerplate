import store from 'models';

const { runtime } = store;

function getClassname() {
    const { locale } = runtime;

    return [
        'app',
        `locale-${locale}`,
    ];
}

export default () => ({
    className: classnames(getClassname()),
});
