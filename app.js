// 待辦清單:純原生 JavaScript,資料存放於 localStorage

const STORAGE_KEY = 'todo-list-items';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const listEl = document.getElementById('todo-list');
const emptyHintEl = document.getElementById('empty-hint');
const remainingEl = document.getElementById('remaining');

/** 目前的待辦資料,每筆為 { id, text, done } */
let todos = loadTodos();

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

/** 依照目前資料重新繪製畫面 */
function render() {
  listEl.replaceChildren();

  todos.forEach((todo) => {
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

  // 清單為空時顯示提示文字
  emptyHintEl.hidden = todos.length > 0;

  const remaining = todos.filter((todo) => !todo.done).length;
  remainingEl.textContent = `未完成:${remaining} 項`;
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

// 首次載入時繪製畫面
render();
