import store from 'models';
import createBrowserHistory from 'history/createBrowserHistory';
import createHashHistory from 'history/createHashHistory';

const DEFAULT_TITLE = 'app.title';
const TITLE_MAP = {};

const { runtime } = store;
const { reaction } = Mobx;
const createHistory = IS_DEV ? createHashHistory : createBrowserHistory;
const history = createHistory();

reaction(() => runtime.i18nTemplates, () => updateTitle());
history.listen(location => updateTitle(location));

function updateTitle(location = history.location) {
    const key = TITLE_MAP[location.pathname] || DEFAULT_TITLE;
    const title = key ? i18n(key) : '';

    if (title) {
        document.title = title;
    }
}
