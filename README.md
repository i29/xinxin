# 🐣 鑫鑫宠物 (Xinxin Pet)

一款精美的**虚拟宠物养成与冒险游戏**，从孵化神秘蛋开始，见证宠物的华丽进化，开启奇幻冒险之旅。

![版本](https://img.shields.io/badge/版本-0.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![测试覆盖率](https://img.shields.io/badge/覆盖率-71.65%25-yellow)

## ✨ 特性

- 🥚 **6 种宠物**：猫咪、小狗、兔子、仓鼠、狐狸、独角兽
- 🔄 **10 阶段进化**：从新生到神话，见证完整成长历程
- ⚔️ **冒险战斗**：3 大区域，9 个关卡的回合制战斗
- 🎮 **丰富玩法**：孵化、养成、任务、商店、成就系统
- 📱 **响应式设计**：完美适配桌面和移动设备
- 💾 **本地存档**：自动保存进度，支持离线收益

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

输出目录：`dist/`

### 预览构建结果

```bash
npm run preview
```

### 运行测试

```bash
# 运行测试
npm test

# 带覆盖率报告
npm run test:coverage

# 交互式 UI 模式
npm run test:ui
```

### 代码检查

```bash
# ESLint
npm run lint
npm run lint:fix

# Prettier
npm run format:check
npm run format
```

## 🎮 游戏系统

### 宠物养成

| 状态 | 说明 |
|------|------|
| 🍖 饥饿 | 随时间下降，使用食物恢复 |
| 😊 快乐 | 使用玩具提升 |
| 🛁 清洁 | 使用清洁用品恢复 |

### 进化阶段

每种宠物有 10 个进化阶段，例如猫咪：
```
新生小毛球 → 好奇奶猫 → 灵动幼猫 → 影迹黑猫 → 
丛林山猫 → 烈焰猛虎 → 赤金狮王 → 圣域守卫 → 
星辰之主 → 万界之灵
```

### 冒险区域

| 区域 | 等级 | 名称 |
|------|------|------|
| 1 | 1-3 | 迷雾森林 |
| 2 | 4-6 | 暗影洞穴 |
| 3 | 7-9 | 苍穹之巅 |

## 📁 项目结构

```
xinxin/
├── src/
│   ├── main.ts           # 入口文件
│   ├── gameState.ts      # 游戏状态管理
│   ├── petData.ts        # 宠物数据定义
│   ├── combat.ts         # 战斗系统
│   ├── hatching.ts       # 孵化逻辑
│   ├── petNurture.ts     # 养成界面
│   ├── adventureView.ts  # 冒险视图
│   ├── taskSystem.ts     # 任务系统
│   ├── taskPanel.ts      # 任务面板
│   ├── animations.ts     # 动画效果
│   ├── style.css         # 全局样式
│   └── test/             # 测试文件
├── assets/               # 静态资源
├── public/               # 公共资源
├── index.html            # HTML 模板
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── vitest.config.ts      # Vitest 配置
```

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 语言 | TypeScript 5.9 |
| 构建 | Vite 8.0 |
| 测试 | Vitest 4.1 |
| 代码质量 | ESLint 10 + Prettier |
| 渲染 | Canvas + DOM |

## 📊 测试覆盖率

```
--------------|---------|----------|---------|---------|
File          | % Stmts | % Branch | % Funcs | % Lines |
--------------|---------|----------|---------|---------|
All files     |   71.65 |    51.65 |   81.81 |   73.64 |
combat.ts     |   97.29 |     92.3 |     100 |   97.22 |
gameState.ts  |   71.67 |    50.94 |   83.72 |   73.42 |
petData.ts    |      50 |     37.5 |   57.14 |      50 |
--------------|---------|----------|---------|---------|
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 `git checkout -b feature/amazing-feature`
3. 提交更改 `git commit -m 'Add amazing feature'`
4. 推送到分支 `git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📝 开发计划

- [ ] 新手引导教程
- [ ] 音效/背景音乐
- [ ] 宠物社交系统
- [ ] 更多小游戏类型
- [ ] 每日挑战任务

## 📄 许可证

MIT License

## 👥 作者

https://github.com/i29

---

<div align="center">
  <strong>🐣 开启你的宠物养成之旅吧！</strong>
</div>
