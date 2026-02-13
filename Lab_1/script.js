

console.log("Інструкція: triangle(значення1, 'тип1', значення2, 'тип2')");
console.log("Типи: 'leg', 'hypotenuse', 'adjacent angle', 'opposite angle', 'angle'");

console.log("\nВАЖЛИВО: Деякі комбінації типів є НЕСУМІСНИМИ:");
console.log("- Не можна вводити дві гіпотенузи.");
console.log("- Не можна вводити два кути (без хоча б однієї сторони трикутник не розв'язати).");
console.log("- Не можна вводити гіпотенузу та прилеглий/протилежний кут (використовуйте тип 'angle').");


function triangle(val1, type1, val2, type2) {
    
    if (val1 <= 0 || val2 <= 0) {
        console.log("Zero or negative input");
        return "Zero or negative input";
    }

    const toRad = (deg) => deg * (Math.PI / 180);
    const toDeg = (rad) => rad * (180 / Math.PI);

    let a, b, c, alpha, beta;

    const data = {};
    data[type1] = val1;
    data[type2] = val2;

    const keys = Object.keys(data);

    if (keys.length !== 2 && !(type1 === 'leg' && type2 === 'leg')) {
        console.log("failed: перечитайте інструкцію (несумісні типи)");
        return "failed";
    }

    try {
        if (keys.includes('leg') && keys.includes('hypotenuse')) {
            a = data['leg'];
            c = data['hypotenuse'];
            if (a >= c) {
                console.log("Катет не може бути більшим за гіпотенузу");
                return "failed";
            }
            b = Math.sqrt(c * c - a * a);
            alpha = toDeg(Math.asin(a / c));
            beta = 90 - alpha;
        } 
        else if (type1 === 'leg' && type2 === 'leg') {
            a = val1;
            b = val2;
            c = Math.sqrt(a * a + b * b);
            alpha = toDeg(Math.atan(a / b));
            beta = 90 - alpha;
        }
        else if (keys.includes('leg') && keys.includes('adjacent angle')) {
            b = data['leg'];
            beta = data['adjacent angle'];
            if (beta >= 90) return "failed: кут має бути гострим";
            alpha = 90 - beta;
            a = b * Math.tan(toRad(alpha));
            c = b / Math.cos(toRad(alpha));
        }
        else if (keys.includes('leg') && keys.includes('opposite angle')) {
            a = data['leg'];
            alpha = data['opposite angle'];
            if (alpha >= 90) return "failed: кут має бути гострим";
            beta = 90 - alpha;
            b = a / Math.tan(toRad(alpha));
            c = a / Math.sin(toRad(alpha));
        }
        else if (keys.includes('hypotenuse') && keys.includes('angle')) {
            c = data['hypotenuse'];
            alpha = data['angle'];
            if (alpha >= 90) return "failed: кут має бути гострим";
            beta = 90 - alpha;
            a = c * Math.sin(toRad(alpha));
            b = c * Math.cos(toRad(alpha));
        }
        else {
            console.log("failed: несумісна пара типів");
            return "failed";
        }

        console.log(`a = ${a}`);
        console.log(`b = ${b}`);
        console.log(`c = ${c}`);
        console.log(`alpha = ${alpha}`);
        console.log(`beta = ${beta}`);

        return "success";

    } catch (e) {
        return "failed";
    }
}
