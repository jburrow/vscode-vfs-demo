"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
class Person {
    constructor(name, age, email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }
    greet() {
        return `Hi, I'm ${this.name} and I'm ${this.age} years old.`;
    }
    getEmail() {
        return this.email;
    }
    isAdult() {
        return this.age >= 18;
    }
}
exports.Person = Person;
//# sourceMappingURL=person.js.map