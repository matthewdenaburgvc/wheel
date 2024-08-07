class Person {
  static #people = new Map();

  constructor(name, active=true) {
    if (Person.#people.has(name)) {
      return Person.#people.get(name);
    }

    this.name = String(name);
    this.active = Boolean(active);

    Person.#people.set(name, this);
  }

  toString() {
    return this.name;
  }

  static getPeople() {
    return Array.from(Person.#people.values());
  }
}

export default Person;
