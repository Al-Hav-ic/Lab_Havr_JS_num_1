// 1.2.3 Створення car1 за допомогою new Object()
const car1 = new Object();
car1.color = "black";
car1.maxSpeed = 200;
car1.tuning = true;
car1["number of accidents"] = 0;

car1.driver = new Object();
car1.driver.name = "Іван Іванов"; 
car1.driver.category = "C";
car1.driver["personal limitations"] = "No driving at night";

// 1.2.4 Створення car2 за допомогою синтаксису літерала
const car2 = {
  color: "red",
  maxSpeed: 220,
  tuning: false,
  "number of accidents": 2,
  driver: {
    name: "Іван Іванов", 
    category: "B",
    "personal limitations": null
  }
};

// 1.2.5 Додавання методу drive до car1
car1.drive = function() {
  console.log("I am not driving at night");
};
car1.drive(); 

// 1.2.6 Додавання методу drive до car2
car2.drive = function() {
  console.log("I can drive anytime");
};
car2.drive(); 

// 1.2.7 Конструктор для "класу" Truck
function Truck(color, weight, avgSpeed, brand, model) {
  this.color = color;
  this.weight = weight;
  this.avgSpeed = avgSpeed;
  this.brand = brand;
  this.model = model;

  // 1.2.9 Додавання методу trip у конструктор
  this.trip = function() {
    if (!this.driver) {
      console.log("No driver assigned");
    } else {
      let nightMsg = this.driver.nightDriving ? "drives at night" : "does not drive at night";
      console.log(`Driver ${this.driver.name} ${nightMsg} and has ${this.driver.experience} years of experience.`);
    }
  };
}

// 1.2.8 Додавання "статичного" методу через prototype
Truck.prototype.AssignDriver = function(name, nightDriving, experience) {
  this.driver = {
    name: name,
    nightDriving: nightDriving,
    experience: experience
  };
};

// 1.2.10 Створення об'єктів Truck та демонстрація
const truck1 = new Truck("white", 5000, 80, "Volvo", "FH16");
const truck2 = new Truck("blue", 7000, 85, "MAN", "TGX");

truck1.AssignDriver("Олександр", true, 10);
truck2.AssignDriver("Михайло", false, 5);

truck1.trip();
truck2.trip();

// 1.2.12 - 1.2.15 Клас Square
class Square {
  constructor(a) {
    this.a = a;
  }

  static help() {
    console.log("Квадрат — це правильний чотирикутник, у якого всі сторони рівні, а кути прямі (90 градусів).");
  }

  length() {
    console.log(`Периметр квадрата: ${4 * this.a}`);
    return 4 * this.a;
  }

  square() {
    const area = this.a * this.a;
    console.log(`Площа квадрата: ${area}`);
    return area;
  }

  info() {
    console.log("--- Інформація про Квадрат ---");
    console.log(`Довжини сторін: 4 сторони по ${this.a}`);
    console.log("Кути: 4 кути по 90 градусів");
    this.length();
    this.square();
  }
}

// 1.2.16 - 1.2.17 Клас Rectangle (успадкований від Square)
class Rectangle extends Square {
  constructor(a, b) {
    super(a); 
    this.b = b;
  }

  static help() {
    console.log("Прямокутник — це чотирикутник, усі кути якого прямі, а протилежні сторони рівні.");
  }

  length() {
    console.log(`Периметр прямокутника: ${2 * (this.a + this.b)}`);
    return 2 * (this.a + this.b);
  }

  square() {
    const area = this.a * this.b;
    console.log(`Площа прямокутника: ${area}`);
    return area;
  }

  info() {
    console.log("--- Інформація про Прямокутник ---");
    console.log(`Довжини сторін: a = ${this.a}, b = ${this.b}`);
    console.log("Кути: 4 кути по 90 градусів");
    this.length();
    this.square();
  }
}

// 1.2.18 - 1.2.19 та 1.2.22 Клас Rhombus

class Rhombus extends Square {
  constructor(a, alpha, beta) {
    super(a);
    this._alpha = alpha;
    this._beta = beta;
  }

  // 1.2.22 Ґеттери та сеттери для Rhombus
  get a() { return this._a; }
  set a(value) { this._a = value > 0 ? value : 1; }

  get alpha() { return this._alpha; }
  set alpha(value) { this._alpha = value; }

  get beta() { return this._beta; }
  set beta(value) { this._beta = value; }

  static help() {
    console.log("Ромб — це паралелограм, у якого всі сторони рівні.");
  }

  length() {
    console.log(`Периметр ромба: ${4 * this.a}`);
    return 4 * this.a;
  }

  square() {
    const area = Math.pow(this.a, 2) * Math.sin(this.alpha * (Math.PI / 180));
    console.log(`Площа ромба: ${area.toFixed(2)}`);
    return area;
  }

  info() {
    console.log("--- Інформація про Ромб ---");
    console.log(`Довжини сторін: 4 сторони по ${this.a}`);
    console.log(`Кути: 2 по ${this.alpha}°, 2 по ${this.beta}°`);
    this.length();
    this.square();
  }
}

// 1.2.20 - 1.2.21 Клас Parallelogram (успадкований від Rectangle)
class Parallelogram extends Rectangle {
  constructor(a, b, alpha, beta) {
    super(a, b);
    this.alpha = alpha;
    this.beta = beta;
  }

  static help() {
    console.log("Паралелограм — це чотирикутник, протилежні сторони якого попарно паралельні.");
  }

  length() {
    console.log(`Периметр паралелограма: ${2 * (this.a + this.b)}`);
    return 2 * (this.a + this.b);
  }

  square() {
    const area = this.a * this.b * Math.sin(this.alpha * (Math.PI / 180));
    console.log(`Площа паралелограма: ${area.toFixed(2)}`);
    return area;
  }

  info() {
    console.log("--- Інформація про Паралелограм ---");
    console.log(`Довжини сторін: a = ${this.a}, b = ${this.b}`);
    console.log(`Кути: 2 по ${this.alpha}°, 2 по ${this.beta}°`);
    this.length();
    this.square();
  }
}

// 1.2.23 Виклик статичного методу help
Square.help();
Rectangle.help();
Rhombus.help();
Parallelogram.help();

// 1.2.24 Створення об'єктів та виклик info
const mySquare = new Square(5);
const myRectangle = new Rectangle(4, 6);
const myRhombus = new Rhombus(5, 120, 60);
const myParallelogram = new Parallelogram(5, 8, 150, 30);

mySquare.info();
myRectangle.info();
myRhombus.info();
myParallelogram.info();

// 1.2.25 Функція Triangular
function Triangular(a = 3, b = 4, c = 5) {
  return { a, b, c };
}

// 1.2.26 Створення 3 об'єктів
const tri1 = Triangular();
const tri2 = Triangular(6, 8, 10);
const tri3 = Triangular(7, 14, 15);

console.log("Об'єкти Triangular:", tri1, tri2, tri3);

// 1.2.27 Функція PiMultiplier (замикання)
function PiMultiplier(multiplier) {
  return function() {
    return Math.PI * multiplier;
  };
}

// 1.2.28 Створення трьох функцій
const multiplyBy2 = PiMultiplier(2);
const multiplyBy3_2 = PiMultiplier(3/2);
const divideBy2 = PiMultiplier(1/2);

console.log("PI * 2 =", multiplyBy2());
console.log("PI * 3/2 =", multiplyBy3_2());
console.log("PI / 2 =", divideBy2());

// 1.2.29 Функція Painter
function Painter(color) {
  return function(obj) {
    if (obj.hasOwnProperty('type')) {
      console.log(`Колір: ${color}, тип: ${obj.type}`);
    } else {
      console.log("No 'type' property occurred!");
    }
  };
}

// 1.2.30 Створення функцій фарбування
const PaintBlue = Painter("blue");
const PaintRed = Painter("red");
const PaintYellow = Painter("yellow");

// 1.2.31 Тестові об'єкти
const obj1 = { maxSpeed: 280, type: "Sportcar", color: "magenta" };
const obj2 = { type: "Truck", "avg speed": 90, "load capacity": 2400 };
const obj3 = { maxSpeed: 180, color: "purple", isCar: true }; 

console.log("Демонстрація Painter");
PaintBlue(obj1);
PaintRed(obj2);
PaintYellow(obj3);
