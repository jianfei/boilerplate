import PageLoading from 'pages/Loading';

const { Fragment } = React;
const { BrowserRouter, HashRouter, Route } = ReactRouter;
const Router = IS_DEV ? HashRouter : BrowserRouter;

const PageHome = Loadable({
    loader: () => import(/* webpackChunkName: "pages/home" */ 'pages/Home'),
    loading: PageLoading,
});

export default class AppRouter extends React.Component {
    render() {
        return (
            <Fragment>
                <Router>
                    <Fragment>
                        <Route exact path="/" component={PageHome} />
                    </Fragment>
                </Router>
            </Fragment>
        );
    }
}
