import PageLoading from 'pages/Loading';

export default Loadable({
    loader: () => import(/* webpackChunkName: "pages/home" */ './Home'),
    loading: PageLoading,
});
