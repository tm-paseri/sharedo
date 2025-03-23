// タスクデータの構造
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let tags = new Set();

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    updateTagFilter();
    updateTagSuggestions();
});

// タスクの追加
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const tagInput = document.getElementById('tagInput');
    
    const taskText = taskInput.value.trim();
    const tagText = tagInput.value.trim();
    
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        tags: tagText ? tagText.split(',').map(tag => tag.trim()) : [],
        comment: ''
    };

    tasks.push(task);
    saveTasks();
    
    taskInput.value = '';
    tagInput.value = '';
    
    renderTasks();
    updateTagFilter();
    updateTagSuggestions();
}

// タスクの保存
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTagFilter();
    updateTagSuggestions();
}

// タグフィルターの更新
function updateTagFilter() {
    const tagFilter = document.getElementById('tagFilter');
    tags = new Set();
    
    tasks.forEach(task => {
        task.tags.forEach(tag => tags.add(tag));
    });
    
    const currentValue = tagFilter.value;
    tagFilter.innerHTML = '<option value="">全てのタグ</option>';
    
    Array.from(tags).sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        if (tag === currentValue) {
            option.selected = true;
        }
        tagFilter.appendChild(option);
    });
}

// タグの補完候補を更新
function updateTagSuggestions() {
    const tagSuggestions = document.getElementById('tagSuggestions');
    tagSuggestions.innerHTML = '';
    
    Array.from(tags).sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        tagSuggestions.appendChild(option);
    });
}

// タスクの表示
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const selectedTag = document.getElementById('tagFilter').value;
    
    taskList.innerHTML = '';
    
    const filteredTasks = selectedTag
        ? tasks.filter(task => task.tags.includes(selectedTag))
        : tasks;

    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        
        taskElement.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <div class="task-content">
                <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
                <div class="task-tags">
                    ${task.tags.map(tag => `<span class="task-tag">${tag}</span>`).join('')}
                </div>
                <div class="task-comment">${task.comment}</div>
                <input type="text" class="comment-input" 
                       placeholder="コメントを追加" 
                       value="${task.comment}"
                       onchange="updateComment(${task.id}, this.value)">
            </div>`;
        
        taskList.appendChild(taskElement);
    });
}

// タスクの完了状態を切り替え
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// コメントの更新
function updateComment(id, comment) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.comment = comment;
        saveTasks();
        renderTasks();
    }
}

// タスクのフィルタリング
function filterTasks() {
    renderTasks();
}

// タグ入力のイベントリスナー
document.getElementById('tagInput').addEventListener('input', function(e) {
    const currentValue = e.target.value;
    const lastTag = currentValue.split(',').pop().trim();
    
    // タグ候補の更新
    if (lastTag) {
        const matchingTags = Array.from(tags).filter(tag => 
            tag.toLowerCase().startsWith(lastTag.toLowerCase())
        );
        
        const tagSuggestions = document.getElementById('tagSuggestions');
        tagSuggestions.innerHTML = '';
        
        matchingTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = currentValue.split(',')
                .slice(0, -1)
                .concat([tag])
                .map(t => t.trim())
                .filter(t => t)
                .join(', ');
            tagSuggestions.appendChild(option);
        });
    }
});