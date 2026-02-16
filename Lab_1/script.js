console.log("Інструкція: triangle(значення1, 'тип1', значення2, 'тип2')");
console.log("Типи: 'leg', 'hypotenuse', 'adjacent angle', 'opposite angle', 'angle'");

console.log("\nВАЖЛИВО: Деякі комбінації типів є НЕСУМІСНИМИ:");
console.log("- Не можна вводити дві гіпотенузи.");
console.log("- Не можна вводити два кути (без хоча б однієї сторони трикутник не розв'язати).");
console.log("- Не можна вводити гіпотенузу та прилеглий/протилежний кут (використовуйте тип 'angle').");

function triangle(val1, type1, val2, type2) {
    // 1. Перевірка на додатні значення
    if (val1 <= 0 || val2 <= 0) {
        console.log("Zero or negative input");
        return "Zero or negative input";
    }

    const toRad = (deg) => deg * (Math.PI / 180);
    const toDeg = (rad) => rad * (180 / Math.PI);

    let a, b, c, alpha, beta;
    const types = [type1, type2];
    const vals = [val1, val2];

    const getVal = (type) => vals[types.indexOf(type)];
    const has = (type) => types.includes(type);

    try {
        // 2. Вибір сценарію залежно від типів
        if (has('leg') && has('hypotenuse')) {
            a = getVal('leg');
            c = getVal('hypotenuse');
            if (a >= c) {
                console.log("Катет не може бути більшим за гіпотенузу");
                return "failed";
            }
            // Використовуємо запобіжник для Math.sqrt
            let diff = c * c - a * a;
            b = Math.sqrt(diff < 0 ? 0 : diff);
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
        else if (has('leg') && has('adjacent angle')) {
            b = getVal('leg');
            beta = getVal('adjacent angle');
            if (beta >= 90) return "failed";
            
            // Прямі обчислення від вхідного кута beta для мінімізації похибки
            alpha = 90 - beta;
            c = b / Math.cos(toRad(beta));
            a = b * Math.tan(toRad(beta)); 
        }
        else if (has('leg') && has('opposite angle')) {
            a = getVal('leg');
            alpha = getVal('opposite angle');
            if (alpha >= 90) return "failed";
            
            beta = 90 - alpha;
            // Прямі обчислення від вхідного кута alpha
            c = a / Math.sin(toRad(alpha));
            b = a / Math.tan(toRad(alpha));
        }
        else if (has('hypotenuse') && has('angle')) {
            c = getVal('hypotenuse');
            alpha = getVal('angle');
            if (alpha >= 90) return "failed";
            
            beta = 90 - alpha;
            a = c * Math.sin(toRad(alpha));
            b = c * Math.cos(toRad(alpha));
        }
        else {
            console.log("failed: несумісна пара типів");
            return "failed";
        }

        // 3. Перевірка на граничні значення (якщо результат Infinity або NaN)
        if (!isFinite(a) || !isFinite(b) || !isFinite(c) || a <= 0 || b <= 0) {
            return "failed";
        }

        // 4. Форматований вивід (округлення до 8 знаків прибирає шум плаваючої коми)
        console.log(`a = ${+a.toFixed(8)}`);
        console.log(`b = ${+b.toFixed(8)}`);
        console.log(`c = ${+c.toFixed(8)}`);
        console.log(`alpha = ${+alpha.toFixed(8)}`);
        console.log(`beta = ${+beta.toFixed(8)}`);

        return "success";

    } catch (e) {
        return "failed";
    }
}
