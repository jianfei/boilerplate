import './Home.less';

const { inject, observer } = MobxReact;

@inject('runtime')
@observer
export default class Home extends React.Component {
    static defaultProps = {
    };

    state = {
    };

    render() {
        return (
            <div className="page-home">
                {i18n('app.title')}
            </div>
        );
    }
}
