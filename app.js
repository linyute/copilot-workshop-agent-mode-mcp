// 待辦清單:純原生 JavaScript,資料存放於 localStorage

const STORAGE_KEY = 'todo-list-items';
const THEME_STORAGE_KEY = 'todo-list-theme';
const FILTER_STORAGE_KEY = 'todo-list-filter';
const FILTER_OPTIONS = ['all', 'active', 'completed'];

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const listEl = document.getElementById('todo-list');
const emptyHintEl = document.getElementById('empty-hint');
const remainingEl = document.getElementById('remaining');
const clearCompletedEl = document.getElementById('clear-completed');
const themeToggleEl = document.getElementById('theme-toggle');
const filterButtons = document.querySelectorAll('.filter-btn');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

/** 目前的待辦資料,每筆為 { id, text, done } */
let todos = loadTodos();
let currentFilter = loadFilter();

/** 依照儲存偏好或作業系統設定套用主題 */
function applyTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const theme = savedTheme || (systemTheme.matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  themeToggleEl.textContent = theme === 'dark' ? '☀️ 淺色模式' : '🌙 深色模式';
  themeToggleEl.setAttribute('aria-label', theme === 'dark' ? '切換淺色模式' : '切換深色模式');
}

/** 從 localStorage 讀取資料,格式不符時回傳空陣列 */
function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.text === 'string')
      .map((item) => ({
        id: String(item.id ?? Date.now() + Math.random()),
        text: item.text,
        done: Boolean(item.done)
      }));
  } catch {
    return [];
  }
}

/** 將目前資料寫回 localStorage */
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/** 從 localStorage 讀取篩選偏好,格式不符時回傳全部 */
function loadFilter() {
  const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
  return FILTER_OPTIONS.includes(savedFilter) ? savedFilter : 'all';
}

/** 更新篩選按鈕的選取狀態 */
function updateFilterButtons() {
  filterButtons.forEach((filterButton) => {
    const isActive = filterButton.dataset.filter === currentFilter;
    filterButton.classList.toggle('active', isActive);
    filterButton.setAttribute('aria-pressed', String(isActive));
  });
}

/** 依照目前資料重新繪製畫面 */
function render() {
  listEl.replaceChildren();

  const visibleTodos = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.done;
    if (currentFilter === 'completed') return todo.done;
    return true;
  });

  visibleTodos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = todo.done ? 'todo-item done' : 'todo-item';
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.done;
    checkbox.setAttribute('aria-label', '標記完成');

    // 使用 textContent 設定文字,避免使用者輸入被當成 HTML 執行
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn-delete';
    delBtn.textContent = '刪除';
    delBtn.setAttribute('aria-label', `刪除:${todo.text}`);

    li.append(checkbox, span, delBtn);
    listEl.appendChild(li);
  });

  // 篩選後沒有項目時顯示符合目前狀態的提示
  const emptyMessages = {
    all: '還沒有任何待辦事項,新增一個吧!',
    active: '目前沒有未完成的待辦事項',
    completed: '目前沒有已完成的待辦事項,項目只是被篩選掉,並未刪除'
  };
  emptyHintEl.textContent = emptyMessages[currentFilter];
  emptyHintEl.hidden = visibleTodos.length > 0;

  const remaining = todos.filter((todo) => !todo.done).length;
  remainingEl.textContent = `未完成:${remaining} 項`;
  clearCompletedEl.hidden = !todos.some((todo) => todo.done);
}

/** 新增一筆待辦 */
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();

  // 空白內容不新增
  if (!text) {
    input.value = '';
    input.focus();
    return;
  }

  todos.push({
    id: String(Date.now()) + Math.random().toString(16).slice(2),
    text,
    done: false
  });
  saveTodos();
  render();

  input.value = '';
  input.focus();
});

/** 以事件委派處理勾選與刪除 */
listEl.addEventListener('click', (event) => {
  const target = event.target;
  const li = target.closest('.todo-item');
  if (!li) return;

  const id = li.dataset.id;

  if (target.classList.contains('todo-checkbox')) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, done: target.checked } : todo
    );
    saveTodos();
    render();
    return;
  }

  if (target.classList.contains('btn-delete')) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    render();
  }
});

clearCompletedEl.addEventListener('click', () => {
  const hasCompletedTodos = todos.some((todo) => todo.done);
  if (!hasCompletedTodos) return;
  if (!window.confirm('確定要清除所有已完成的項目嗎?')) return;

  todos = todos.filter((todo) => !todo.done);
  saveTodos();
  render();
});

themeToggleEl.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = FILTER_OPTIONS.includes(button.dataset.filter) ? button.dataset.filter : 'all';
    localStorage.setItem(FILTER_STORAGE_KEY, currentFilter);
    updateFilterButtons();
    render();
  });
});

// 沒有手動偏好時,作業系統主題變更會同步更新
systemTheme.addEventListener('change', () => {
  if (!localStorage.getItem(THEME_STORAGE_KEY)) applyTheme();
});

// 首次載入時繪製畫面
applyTheme();
updateFilterButtons();
render();
