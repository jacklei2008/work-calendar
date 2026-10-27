# 🌰 栗子上班 · Scriptable 小组件安装步骤

脚本文件：`scriptable-lizi-widget.js`（本目录）
规则：2026-10-27 起每 3 天一次，至 2035-12-30，与订阅日历 `lizishangban.ics` 一致。

## iPhone 上安装（不用审核、不用开发者账号）

1. 在 App Store 免费下载 **Scriptable**。
2. 在 iPhone 上打开脚本链接，复制全部代码：
   https://raw.githubusercontent.com/jacklei2008/work-calendar/main/scriptable-lizi-widget.js
3. 打开 Scriptable，点右上角 `+` 新建脚本，粘贴，点 Done（可把脚本名改成“栗子上班”）。
4. 回到主屏幕，长按空白处 → 左上角 `+` → 搜索 **Scriptable** → 添加小组件。
5. 长按刚添加的小组件 → 编辑小组件 → 选择脚本“栗子上班”。
6. 尺寸建议：**大号看本月月历**（上班日棕底 + 栗字），中号看接下来 3 个上班日，小号看今天/下次。

## 说明

- 点小组件会打开系统日历（不是改日历 App 里面的日期格子，那个苹果不开放）。
- 小组件由 iOS 决定刷新时间，已设置每天午夜后可刷新；如果某天早上还没变，点一下小组件或等 iOS 刷新即可。
- 想改规则（起始日、间隔天数），改脚本开头的 `ANCHOR` / `END` 和 `isWork` 里的间隔即可。
