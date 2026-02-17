class Character {
    constructor(name) {
        this.name = name;
        this.level = 1;
        this.xp = 0;
        this.created = new Date().toLocaleDateString();
    }

    getExperienceToNextLevel() {
        return 100 * this.level;
    }

    addExperience(amount) {
        this.xp += amount;
        while (this.xp >= this.getExperienceToNextLevel()) {
            this.xp -= this.getExperienceToNextLevel();
            this.levelUp();
        }
        this.save();
    }

    levelUp() {
        this.level++;
        alert("Повышение уровня");
    }

    save() {
        Storage.save("character", this);
    }

    static load() {
        const data = Storage.load("character");
        if (!data) return null;
        const character = new Character(data.name);
        Object.assign(character, data);
        return character;
    }
}