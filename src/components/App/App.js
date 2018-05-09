import { hot } from 'react-hot-loader';
import store from 'models';
import AppRouter from 'components/AppRouter';
import appProps from 'utils/appProps';
import 'utils/appTitle';

const { Provider, observer } = MobxReact;

@observer
class App extends React.Component {
    render() {
        return (
            <div {...appProps()}>
                <Provider {...store}>
                    <AppRouter />
                </Provider>
            </div>
        );
    }
}

export default hot(module)(App);
