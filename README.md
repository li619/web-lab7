# React 五子棋游戏

一个使用 React 和 styled-components 构建的五子棋游戏，支持人机对战。

## 功能特点

- 🎮 支持人机对战
- 🎯 智能AI对手
- 🔄 悔棋功能
- 🎨 美观的界面设计
- 🎲 可选择执黑先手或执白后手
- 📱 响应式设计

## 在线演示

访问 [GitHub Pages](https://你的用户名.github.io/仓库名) 体验游戏

## 本地运行

1. 克隆仓库

bash
git clone https://github.com/你的用户名/仓库名.git

2. 安装依赖
bash
npm install

3. 启动开发服务器
bash
npm start

4. 打开浏览器访问 http://localhost:3000

## 技术栈

- React
- styled-components
- JavaScript ES6+

## 游戏规则

- 黑白双方交替落子
- 先形成五子连线（横、竖、斜）的一方获胜
- 可以随时悔棋或重新开始
- 棋盘填满且无人获胜则为平局

## 开发者

[你的名字]

## 许可证

MIT License
这个 README.md 包含了：
项目简介
主要功能
3. 如何运行
技术栈
游戏规则
开发者信息
许可证信息
你可以根据需要修改内容，比如：
添加项目截图
更新在线演示链接
添加更详细的游戏说明
添加贡献指南
添加更多技术细节
需要我帮你修改或添加其他内容吗？
readme文档你没有写完，请写完

好的，让我继续完成 README.md 文档：

## 在线演示

访问 [GitHub Pages](https://你的用户名.github.io/仓库名) 体验游戏

## 本地运行

1. 克隆仓库


## 在线演示

访问 [GitHub Pages](https://li619.github.io/web-lab7) 体验游戏

## 本地运行

1. 克隆仓库

bash
git clone https://github.com/li619/web-lab7.git

2. 安装依赖
bash
npm install

3. 启动开发服务器
bash
npm start

4. 打开浏览器访问 http://localhost:3000

## 技术栈

- React 18
- styled-components
- JavaScript ES6+

## 游戏规则

- 玩家可以选择执黑先手或执白后手
- 黑白双方交替落子
- 先形成五子连线（横、竖、斜）的一方获胜
- 可以使用悔棋功能回退一步
- 可以随时重新开始游戏
- 棋盘填满且无人获胜则为平局

## AI策略

AI采用评分系统进行决策：
- 连五：100000分（必胜）
- 活四：10000分
- 冲四：1000分
- 活三：1000分
- 眠三：100分
- 活二：100分
- 眠二：10分

AI会：
1. 优先寻找必胜位置
2. 阻止玩家的必胜位置
3. 评估每个可能的落子位置
4. 选择最高分值的位置落子

## 项目结构

src/
├── components/
│ └── Gomoku.js # 主要游戏组件
├── App.js # 应用入口
└── index.js # 渲染入口

## 部署

使用 GitHub Pages 部署：

npm run deploy


## 开发者

[Li619](https://github.com/li619)

## 许可证

MIT License

## 致谢

- Create React App
- styled-components
- GitHub Pages
