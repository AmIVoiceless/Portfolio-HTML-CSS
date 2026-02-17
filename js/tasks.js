class Task {
    constructor(title, description, xp) {
        this.id = Date.now();
        this.title = title;
        this.description = description;
        this.xp = xp;
        this.completed = false;
        this.created = new Date().toLocaleDateString();
        this.completedDate = null;
    }
}

class TaskManager {
    constructor() {
        this.tasks = Storage.load("tasks") || [];
    }

    addTask(task) {
        this.tasks.push(task);
        this.save();
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
    }

    completeTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task && !task.completed) {
            task.completed = true;
            task.completedDate = new Date().toLocaleDateString();
            this.save();
            return task.xp;
        }
        return 0;
    }

    save() {
        Storage.save("tasks", this.tasks);
    }
}