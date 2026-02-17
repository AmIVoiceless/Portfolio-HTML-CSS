document.addEventListener("DOMContentLoaded", () => {

    let character = Character.load();

    if (!character) {
        const name = prompt("Имя персонажа:");
        character = new Character(name || "Герой");
        character.save();
    }

    const taskManager = new TaskManager();

    function renderCharacter() {
        document.getElementById("characterName").textContent = character.name;
        document.getElementById("level").textContent = character.level;
        document.getElementById("currentXP").textContent = character.xp;
        document.getElementById("neededXP").textContent = character.getExperienceToNextLevel();
        document.getElementById("createdDate").textContent = character.created;

        const percent = (character.xp / character.getExperienceToNextLevel()) * 100;
        document.getElementById("xpProgress").style.width = percent + "%";
    }

    function renderTasks() {
        const taskList = document.getElementById("taskList");
        const completedList = document.getElementById("completedList");

        taskList.innerHTML = "";
        completedList.innerHTML = "";

        let totalCompleted = 0;
        let totalXP = 0;

        taskManager.tasks.forEach(task => {
            const div = document.createElement("div");
            div.className = "task";
            div.innerHTML = `
                <strong>${task.title}</strong> (+${task.xp} XP)
                <p>${task.description}</p>
                <button onclick="completeTask(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">✖</button>
            `;

            if (task.completed) {
                completedList.appendChild(div);
                totalCompleted++;
                totalXP += task.xp;
            } else {
                taskList.appendChild(div);
            }
        });

        document.getElementById("totalCompleted").textContent = totalCompleted;
        document.getElementById("totalXP").textContent = totalXP;
    }

    window.completeTask = function(id) {
        const xp = taskManager.completeTask(id);
        if (xp) {
            character.addExperience(xp);
            renderCharacter();
            renderTasks();
        }
    };

    window.deleteTask = function(id) {
        taskManager.removeTask(id);
        renderTasks();
    };

    document.getElementById("addTask").addEventListener("click", () => {
        const title = document.getElementById("taskTitle").value;
        const description = document.getElementById("taskDescription").value;
        const xp = parseInt(document.getElementById("taskDifficulty").value);

        if (!title) return alert("Название задачи");

        const task = new Task(title, description, xp);
        taskManager.addTask(task);
        renderTasks();
    });

    document.getElementById("resetProgress").addEventListener("click", () => {
        if (confirm("Вы уверены?")) {
            Storage.clear();
            location.reload();
        }
    });

    renderCharacter();
    renderTasks();
});