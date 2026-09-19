# 待辦清單 Web App

這是一個在 GitHub Copilot 實戰工作坊完成的待辦清單 Web App。專案以簡潔、可直接使用的介面，提供日常待辦事項的新增、整理與狀態管理，並保留使用者的資料與顯示偏好。

## 線上展示

![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)
[GitHub Pages](https://linyute.github.io/copilot-workshop-agent-mode-mcp/)

> 請將網址中的 `<你的帳號>` 與 `<你的repo名稱>` 替換成實際的 GitHub 帳號與儲存庫名稱。

## 功能

- 新增待辦事項，並支援按 Enter 送出。
- 將待辦事項標記為已完成或取消完成。
- 刪除單筆待辦事項。
- 依照「全部」、「未完成」與「已完成」篩選待辦事項。
- 記住目前選擇的篩選條件。
- 顯示未完成待辦事項的數量。
- 一次清除所有已完成的待辦事項，操作前會要求確認。
- 在淺色模式與深色模式之間切換。
- 沒有手動設定主題時，依照作業系統的顯示偏好設定主題。
- 將待辦事項與主題設定保存至瀏覽器，重新載入頁面後仍可保留。
- 針對不同篩選結果顯示相應的空清單提示。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript。
- 不使用前端框架或第三方套件。
- 待辦事項、主題設定與篩選條件使用瀏覽器的 `localStorage` 保存。
- 使用原生 DOM API 建立與更新清單內容。
- 使用語意化 HTML、表單操作與 ARIA 屬性，支援基本的鍵盤與輔助工具使用情境。

## 開發方式

本專案是在 GitHub Copilot 實戰工作坊中，透過 GitHub Copilot Agent Mode、MCP 與 `.github/prompts` 的 agentic workflow 逐步完成。開發過程將需求拆分為可驗證的工作項目，讓 Agent Mode 協助理解程式碼、執行修改與驗證；再透過 MCP 連結工作流程所需的外部開發工具與資訊；`.github/prompts` 則用來整理可重複使用的任務指引，讓修正與開發步驟更一致、容易追蹤。

## 我學到什麼

- 如何使用 GitHub Copilot Agent Mode，從需求、程式修改到驗證建立完整的開發流程。
- 如何將 MCP 納入開發工作流程，讓 AI 助手能配合更多工具與專案資訊完成任務。
- 如何使用 `.github/prompts` 撰寫結構化的任務指引，降低重複說明與操作成本。
- 如何以 `localStorage` 保存前端應用程式的資料與使用者偏好。
- 如何透過小步驟修改與驗證，逐步改善待辦清單的使用體驗。
