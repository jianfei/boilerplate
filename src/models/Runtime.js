import _get from 'lodash/get';
import config from 'config';

const { observable, action } = Mobx;

const query = window.location.search.slice(1) || window.location.hash.split('?')[1];
const localeFromQuery = _get(qs.parse(query), 'locale');
const localeFromLocalStorage = localStorage.getItem('locale');

export default class Runtime {
    @observable locale = localeFromQuery || localeFromLocalStorage || config.locale;
    @observable i18nTemplates = {};

    @action setLocale(locale) {
        this.locale = locale;
    }

    @action setI18nTemplates(templates) {
        this.i18nTemplates = templates;
    }
}
