### 技术栈

- react 全家桶
    - react
    - react-router
    - mobx
- webpack
- lodash
- less
- debug

#### 其他库推荐

- rxjs 事件流
- axios 网络请求
- joi 输入校验

### 目录结构

- `app` 入口文件
    - `index.ejs` 默认 html 模板
    - `app.js` 默认入口文件，将导出为 `dist/app.js`
    - `entry` 可选，多入口，当需要配置多个入口文件时使用
        - `[ENTRY_NAME]` 单独的入口，文件夹名即为入口名，比如 `home`, `login` 等
            - `index.ejs` 模板，如果不提供则使用默认模板
            - `index.js` 入口文件
- `components` 组件库
    - `vendor` 引入的外部组件，为了方便升级和扩展，都需要在这里包装一层
- `pages` 单页应用的页面文件
- `i18n` 国际化
- `models` 状态管理、数据模型等
- `services` 服务
- `utils` 工具
    - `appProps` 注入全局 class
    - `appTitle` 修改应用标题
    - `logger` 日志模块
- `config` 全局设置
- `assets` 图片、字体等静态资源
- `lib` 外部资源，这个文件夹会被整个拷贝到 `dist` 中

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

默认的入口文件是 `src/app/index.js`, HTML 模板文件是 `src/app/index.ejs`
如果需要多个入口，可以添加一个 `src/app/entry` 文件夹，里面用来存放不同的入口。
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
<img src='.lib/img/logo.png' />
```

```css
body { background-image: url(./lib/img/bg.png); }
```

#### 内部引用

- 将文件放入 `assets` 文件夹
- 使用 `import`

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
在代码中直接使用 `i18n(key)` 即可以获得当前语言下对应的文案。可以使用模板。

所有的语言包都是动态加载的，生成在最终目录下的 `i18n` 文件夹中。
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

```javascript
// log(key)(content);
log('app:demo', 'This is a demo');
```

可以在 `utils/logger` 中修改日志的行为。
