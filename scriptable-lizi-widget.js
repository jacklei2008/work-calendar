// 🌰 栗子上班 · Scriptable 小组件
// 规则：2026-10-27 起，每 3 天一次，至 2035-12-30（与订阅日历 lizishangban.ics 一致）
// 用法：见同目录 SCRIPTABLE-README.md
// 尺寸：小号 = 今天/下次；中号 = 接下来 3 个上班日；大号 = 本月月历，上班日棕底 + 栗字

const ANCHOR = Date.UTC(2026, 9, 27) // 2026-10-27，月份从 0 开始
const END = Date.UTC(2035, 11, 30) // 2035-12-30
const BROWN = "#B5651D"
const DARK_BROWN = "#7C3A12"
const LIGHT_BG = "#FFF8F0"
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]

function utcOf(y, m, d) {
  return Date.UTC(y, m, d)
}

function isWork(y, m, d) {
  const t = utcOf(y, m, d)
  if (t < ANCHOR || t > END) return false
  return Math.round((t - ANCHOR) / 86400000) % 3 === 0
}

function fmtDay(d) {
  return (d.getMonth() + 1) + "月" + d.getDate() + "日"
}

function fmtDayWeek(d) {
  return fmtDay(d) + " 周" + WEEKDAYS[d.getDay()]
}

// 从 start（含当天）起，找 count 个上班日
function nextWorkDays(start, count) {
  const out = []
  const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  while (out.length < count && utcOf(cur.getFullYear(), cur.getMonth(), cur.getDate()) <= END) {
    if (isWork(cur.getFullYear(), cur.getMonth(), cur.getDate())) {
      out.push(new Date(cur))
    }
    cur.setDate(cur.getDate() + 1)
  }
  return out
}

function addText(stack, text, font, color) {
  const t = stack.addText(text)
  t.font = font
  t.textColor = new Color(color)
  t.lineLimit = 1
  return t
}

const now = new Date()
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const todayIsWork = isWork(today.getFullYear(), today.getMonth(), today.getDate())
const upcoming = nextWorkDays(today, 4)
const nextAfterToday = upcoming.filter((d) => d.getTime() !== today.getTime())[0]

const widget = new ListWidget()
widget.backgroundColor = new Color(LIGHT_BG)
widget.url = "calshow://" // 点小组件打开系统日历
widget.setPadding(12, 12, 12, 12)
const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
widget.refreshAfterDate = tomorrow

const family = (config.widgetFamily || "large").toLowerCase()

if (family === "small") {
  widget.addSpacer()
  const title = addText(widget, "🌰 栗子上班", Font.boldSystemFont(15), BROWN)
  title.centerAlignText()
  widget.addSpacer(8)
  const status = addText(
    widget,
    todayIsWork ? "今天上班" : "今天休息",
    Font.boldSystemFont(26),
    todayIsWork ? BROWN : "#333333"
  )
  status.centerAlignText()
  widget.addSpacer(8)
  const nextText = addText(
    widget,
    nextAfterToday ? "下次：" + fmtDayWeek(nextAfterToday) : "已到 2035 年底",
    Font.systemFont(12),
    "#666666"
  )
  nextText.centerAlignText()
  widget.addSpacer()
} else if (family === "medium") {
  const title = addText(widget, "🌰 栗子上班", Font.boldSystemFont(16), BROWN)
  title.leftAlignText()
  widget.addSpacer(4)
  const status = addText(
    widget,
    todayIsWork ? "今天栗子上班 🌰" : "今天休息 · 下次 " + (nextAfterToday ? fmtDayWeek(nextAfterToday) : "—"),
    Font.systemFont(12),
    "#666666"
  )
  status.leftAlignText()
  widget.addSpacer(8)
  const list = upcoming.slice(0, 3)
  for (let i = 0; i < list.length; i++) {
    const d = list[i]
    const row = widget.addStack()
    row.layoutHorizontally()
    row.centerAlignContent()
    const label = d.getTime() === today.getTime() ? "今天 · " : ""
    addText(row, label + fmtDayWeek(d), Font.systemFont(14), "#222222")
    row.addSpacer()
    const badge = row.addStack()
    badge.backgroundColor = new Color(BROWN)
    badge.cornerRadius = 6
    badge.setPadding(2, 7, 2, 7)
    addText(badge, "栗", Font.boldSystemFont(12), "#FFFFFF")
    if (i < list.length - 1) widget.addSpacer(6)
  }
} else {
  // 大号：本月月历，上班日棕底 + 栗字
  const titleRow = widget.addStack()
  titleRow.layoutHorizontally()
  titleRow.centerAlignContent()
  addText(titleRow, "🌰 栗子上班", Font.boldSystemFont(16), BROWN)
  titleRow.addSpacer()
  addText(
    titleRow,
    today.getFullYear() + "年" + (today.getMonth() + 1) + "月",
    Font.boldSystemFont(15),
    "#222222"
  )
  widget.addSpacer(4)
  const status = addText(
    widget,
    todayIsWork
      ? "今天栗子上班 🌰"
      : "今天休息 · 下次 " + (nextAfterToday ? fmtDayWeek(nextAfterToday) : "—"),
    Font.systemFont(12),
    "#666666"
  )
  status.leftAlignText()
  widget.addSpacer(6)

  // 星期头：周一起
  const headRow = widget.addStack()
  headRow.layoutHorizontally()
  const headNames = ["一", "二", "三", "四", "五", "六", "日"]
  for (let i = 0; i < 7; i++) {
    const cell = headRow.addStack()
    cell.size = new Size(43, 18)
    cell.centerAlignContent()
    const t = addText(cell, headNames[i], Font.systemFont(11), "#999999")
    t.centerAlignText()
  }
  widget.addSpacer(2)

  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekdayMondayFirst = (new Date(year, month, 1).getDay() + 6) % 7
  let day = 1
  let firstRow = true
  while (day <= daysInMonth) {
    const row = widget.addStack()
    row.layoutHorizontally()
    for (let col = 0; col < 7; col++) {
      const cell = row.addStack()
      cell.size = new Size(43, 30)
      cell.centerAlignContent()
      cell.layoutHorizontally()
      if (firstRow && col < firstWeekdayMondayFirst) {
        addText(cell, " ", Font.systemFont(14), "#222222")
      } else if (day > daysInMonth) {
        addText(cell, " ", Font.systemFont(14), "#222222")
      } else {
        const work = isWork(year, month, day)
        const isToday = day === today.getDate()
        if (work) {
          cell.backgroundColor = new Color(isToday ? DARK_BROWN : BROWN)
          cell.cornerRadius = 8
        } else if (isToday) {
          cell.backgroundColor = new Color("#FDEBD7")
          cell.cornerRadius = 8
        }
        const num = addText(cell, String(day), Font.boldSystemFont(15), work ? "#FFFFFF" : "#222222")
        num.centerAlignText()
        if (work) {
          cell.addSpacer(1)
          const li = addText(cell, "栗", Font.boldSystemFont(10), "#FFFFFF")
          li.centerAlignText()
        }
        day++
      }
    }
    firstRow = false
    widget.addSpacer(2)
  }

  const foot = addText(widget, "上班日：棕底 + 栗字 · 每 3 天一次 · 点小组件打开日历", Font.systemFont(10), "#999999")
  foot.leftAlignText()
}

if (config.runsInWidget) {
  Script.setWidget(widget)
  Script.complete()
} else {
  widget.presentLarge()
}
