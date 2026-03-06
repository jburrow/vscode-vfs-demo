// TypeScript Class Example
interface IPerson {
    name: string;
    age: number;
    email: string;
}

export class Person implements IPerson {
    constructor(
        public name: string,
        public age: number,
        public email: string
    ) {}

    greet(): string {
        return `Hi, I'm ${this.name} and I'm ${this.age} years old.`;
    }

    getEmail(): string {
        return this.email;
    }

    isAdult(): boolean {
        return this.age >= 18;
    }
}
