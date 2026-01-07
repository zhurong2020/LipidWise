# LipidWise (脂慧)

**一款基于《中国血脂管理指南（2023年）》的 ASCVD 风险评估与管理助手**

LipidWise 是一个专为中国心内科医生和患者设计的微信小程序。它采用**纯前端 (Local-First)** 架构，能够在无需联网的情况下，安全地在用户手机本地进行风险评估、数据存储和健康模拟。

## 🌟 核心功能

*   **科学评估 (Scientific Assessment)**: 
    *   内置 2023 年最新版中国血脂管理指南的风险分层逻辑。
    *   综合考虑血压、血脂 (LDL-C, TC, HDL-C)、年龄、吸烟史、糖尿病等关键因子。
    *   智能识别 "极高危 / 高危 / 中危 / 低危" 等级。
*   **健康预演 (Intervention Simulator)**:
    *   **"如果我戒烟会怎样?"**: 实时模拟生活方式改变对风险等级的影响。
    *   直观展示降脂降压后的获益，辅助医生进行患教。
*   **适老化设计 (Elderly Friendly)**:
    *   大字号、高对比度界面，专为老年患者优化。
    *   清晰的医学术语解释。
*   **隐私保护 (Privacy First)**:
    *   **零数据上传**: 所有健康数据仅保存在用户手机本地 (WeChat Storage)。
    *   支持医患面对面结果查看或截图分享。
*   **云架构就绪 (Cloud Ready)**:
    *   预置 `DataService` 抽象层和同步接口，支持未来平滑迁移至云端数据库。

## 🛠️ 技术栈

*   **平台**: 微信小程序 (WeChat Mini Program)
*   **架构**: MVVM (Native) + Local Storage
*   **语言**: JavaScript / WXML / WXSS

## 🚀 快速开始

### 开发环境
你需要安装 [微信开发者工具 (WeChat Developer Tools)](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。

### 运行步骤
1.  **克隆/下载** 本仓库。
2.  打开微信开发者工具，点击 **"导入项目"**。
3.  选择本项目根目录（包含 `project.config.json` 的目录）。
4.  AppID 可选择 "测试号" 或输入您自己的 AppID。
5.  点击 "编译" 即可在模拟器中运行。

## 📁 目录结构

```
LipidWise/
├── miniprogram/             # 小程序源码
│   ├── pages/               # 页面文件
│   │   ├── index/           # 首页
│   │   └── assessment/      # 评估流程 (Input/Result)
│   ├── utils/
│   │   ├── riskCalculator.js # 核心风险计算算法
│   │   ├── simulator.js      # 干预模拟器逻辑
│   │   ├── dataService.js    # 数据服务层 (支持未来同步)
│   │   └── storage.js        # 本地存储工具
│   ├── app.js               # 全局逻辑
│   └── app.wxss             # 全局样式 (含适老化变量)
├── docs/                    # 参考文档与素材
└── project.config.json      # 项目配置文件
```

## 📚 参考文献
*   《中国血脂管理指南（2023年）》
*   《中国心血管病风险评估和管理指南》

---
*Disclaimer: 本工具评估结果仅供参考，不可替代专业医疗诊断。如有不适请及时就医。*
