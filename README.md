### 技术栈

- react 全家桶
    - react
    - react-router 路由
    - mobx 状态管理
- webpack
- less

按需引用:
- lodash 常用工具
- rxjs 事件流
- axios 网络请求

### 目录结构

- `app` 入口文件
    - `index.ejs` 默认 html 模板
    - `app.js` 默认入口文件，将导出为 `dist/app.js`
    - `entry` 可选，当应用需要配置多个入口时使用
        - `[ENTRY_NAME]` 每个文件夹为一个入口，名字即为入口名。
            - `index.ejs` 模板文件，如果不提供则使用默认模板
            - `index.js` 入口文件，必须
- `components` 组件库
    - `vendor` 引入的外部组件，为了方便以后升级和扩展，最好在这里包装一层
- `pages` 页面库
- `i18n` 国际化
- `models` 状态管理、数据模型等
- `services` 服务，如网络请求等
- `utils` 工具
    - `appProps` 应用全局 class 管理
    - `appTitle` 应用标题管理
    - `logger` 日志模块
    - `rx.ext` rxjs 扩展
- `config` 全局设置，存放一些变量
- `assets` 图片、字体等静态资源
- `lib` 外部资源，这个文件夹打包时会被拷贝到 `dist` 中

### Webpack 配置

- `react-hot-loader` React 局部刷新，不丢失当前状态
- `webpack-dev-server` 支持局域网通过 IP 访问
- `html-webpack-plugin` 使用 ejs 模板，生产环境对 HTML 进行压缩
- `treeshaking` 去除无用代码
- `splitChunks` 公用代码分离
- `webpack-bundle-analyzer` 构建代码分析报告
- `imagemin-webpack-plugin` 自动压缩图片
- `happypack` 多线程打包
- `devServer.historyApiFallback` 根据 url 自动切换入口文件

### 多入口检测

默认的入口文件是 `src/app/index.js`, HTML 模板文件是 `src/app/index.ejs`。

如果需要配置多个入口，可以添加一个 `src/app/entry` 文件夹，里面用来存放不同的入口。

在这个文件夹下，每个单独的文件夹都会被认为是一个入口，文件夹的名字就是入口名。

每个入口需要有 `index.js` 入口文件，可以有 `index.ejs` 模板文件，如果没有的话会使用外层的默认模板。

### 动态加载机制

动态加载一个模块:

```javascript
import(/* webpackChunkName: "moduleName" */ './modulePath').then(...);
```

动态加载一个组件或页面:

```javascript
const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "moduleName" */ './MyPage'),
    loading: LoadingPage,
})
```

### 资源引用

#### 外部引用

- 将文件放入 `lib` 文件夹
- 不要使用 `import`, 直接使用资源地址

```javascript
<img src='./lib/img/logo.png' />
```

```css
body { background-image: url(./lib/img/bg.png); }
```

#### 内部引用

- 将文件放入 `assets` 文件夹
- 使用 `import` 加载资源

```javascript
import logo from 'assets/img/logo.png';

<img src={logo} />
```

```css
body { background-image: url(~assets/img/bg.png); }
```

### 国际化

当前语言默认为 `zh`，可以在 `config/defaults` 中修改。
可以在 url 中设置 `?locale=xx` 来修改语言。
也可以在 localStorage 中设置 `locale` 键来修改语言，优先级比 url 的低。

文案储存在 `i18n` 目录下，每种语言对应一个文件。
在代码中直接使用 `i18n(key)` 即可以获得当前语言下对应的文案。

所有的语言包都是动态加载的，生成在 `i18n` 文件夹中。修改语言后会立即生效，不需要刷新页面。
可以在开发模式下，在 console 中输入 `i18nStats` 来查看文案的引用次数。

```javascript
// i18n/zh
export default {
    title: '我的应用',
    demoWithArgs: '传入的值: {0}, {1}',
    demoWithObjectArgs: '传入的值: {value}',
}

// 代码中:
i18n('title'); // 我的应用
i18n('demoWithArgs', 'foo', 'bar'); // 传入的值: foo, bar
i18n('demoWithArgs', ['foo', 'bar']); // 传入的值: foo, bar
i18n('demoWithObjectArgs', { value: 'foo' }); // 传入的值: foo
```

### 日志

首先设置一下:

```javascript
localStorage.debug = '*,-sockjs-client*';
```

```javascript
log('app:demo', 'This is a demo');
```

可以在 `utils/logger` 中进行修改函数，比如上报日志等。

### rxjs 与 react 组件的结合

#### 准备

首先，你需要在组件的 `constructor` 中调用 `Rx.setup(this)`。

#### 生命周期订阅

你可以订阅以下的生命周期流:

- ~~`this.componentWillMount$`~~
- `this.componentDidMount$`
- ~~`this.componentWillReceiveProps$`~~
- `this.getDerivedStateFromProps$`
- `this.shouldComponentUpdate$`
- ~~`this.componentWillUpdate$`~~
- `this.getSnapshotBeforeUpdate$`
- `this.componentDidUpdate$`
- `this.componentWillUnmount$`
- `this.componentDidCatch$`

这些事件流主要是用来方便链式调用的。比如：

```javascript
const clock$ = Rx.Observable
    .interval(3000)
    .takeUntil(this.componentWillUnmount$);
```

#### 通过事件流修改 State

```javascript
this.setState$(Rx.Observable.of({ foo: 'bar' }));
this.setState$({ foo: Rx.Observable.of('bar') });
```

#### 事件优化

```javascript
<div onClick={this.trigger$('buttonClick')} />
<div onClick={this.trigger$('buttonClick', 'foo', 'bar')} />
<div onClick={event => this.trigger$('buttonClick')(event, 'foo', 'bar')} />
```

调用 `this.trigger$` 方法会生成一个 `Rx.Subject` 实例并绑到到 `this` 上。

```javascript
this.buttonClick$.subscribe(...);
```

如果你的组件是延迟加载的，直接调用可能会报错，因为 `this.buttonClick$` 可能还不存在。
这时可以使用 `this.event$` 来提前声明。

```javascript
this.event$('buttonClick').subscribe(...);
```

#### 网络请求优化

```javascript
const request$ = Rx.Observable.fromRequest(request, 'foo', 'bar');
```

这样做会将 `request('foo', 'bar')` 的结果以事件流返回。

`fromRequest` 和 `fromPromise` 的区别是，`fromPromise` 在进行 retry 时不会再次触发请求，而是直接返回之前的结果。

进行延时重试:

```javascript
const request$ = Rx.Observable
    .fromRequest(request, 'foo', 'bar')
    .delayRetry(3000, 2);
```

入参：

- `delay`: 每次重试的间隔（毫秒）；默认 `3000`
- `timesRetry`: 重试次数；默认 `1`

在重试次数到达最大时，会将所有错误信息以数组的形式返回。
