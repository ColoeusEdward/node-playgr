// run `node index.js` in the terminal
//展开对象与清空对象中的null , undefined

console.log(`Hello Node.js v${process.versions.node}!`);

const oldObject = {
  KeyA: 1,
  KeyB: {
    c: 2,
    d: 3,
    e: {
      f: {
        ss: { aa: 33 },
        sss: { aas: 33 }
      },
      ff: [2, null, 4]
    }
  }
};

function flattenObject(oldObject) {
  const newObject = {};

  flattenHelper(oldObject, newObject, '');

  return newObject;

  function flattenHelper(currentObject, newObject, previousKeyName) {
    for (let key in currentObject) {
      let value = currentObject[key];
      if (value === null || value === undefined) {
        newObject[previousKeyName + '.' + key] = value;
        continue;
      }

      if (value.constructor !== Object && value.constructor !== Array) {
        if (previousKeyName == null || previousKeyName == '') {
          newObject[key] = value;
        } else {
          if (key == null || key == '') {
            newObject[previousKeyName] = value;
          } else {
            newObject[previousKeyName + '.' + key] = value;
          }
        }
      } else {
        if (previousKeyName == null || previousKeyName == '') {
          flattenHelper(value, newObject, key);
        } else {
          flattenHelper(value, newObject, previousKeyName + '.' + key);
        }
      }
    }
  }
}

const result = flattenObject(oldObject);
console.log('result', cleanObjectValue(result));

function cleanObjectValue(obj) {
  var param = {};
  if (obj === null || obj === undefined || obj === '' || obj === 'null')
    return param;
  for (var key in obj) {
    if (obj[key] && obj[key].constructor === Object) {
      param[key] = cleanObjectValue(obj[key]);
    } else if (
      obj[key] !== null &&
      obj[key] !== undefined &&
      obj[key] !== '' &&
      obj[key] !== 'null'
    ) {
      param[key] = obj[key];
    }
  }
  return param;
}
