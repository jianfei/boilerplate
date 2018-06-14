import './index.less';

import App from 'components/App';
import config from 'config';

loadExtensions();

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);

function loadExtensions() {
    if (config.extension) {
        config.extension.forEach(extension => {
            require(`extension/${extension}`);
        });
    }
}
