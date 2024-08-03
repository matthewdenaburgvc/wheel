class Person {
  static nextId = 1;

  constructor(name, active=true) {
    this.name = name;
    this.id = Person.nextId++;
    this.active = active;
  };

  toString() {
    return this.name;
  };
};
