import debug from 'debug';

export default (key, content) => {
    if (typeof content === 'undefined') {
        content = key;
        key = 'app';
    }

    debug(key)(content);
};
