/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'string') {
    if (/^[0-9]+$/.test(time)) {
      // support "1548221490638"
      time = parseInt(time);
    } else {
      // support safari
      // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
      time = time.replace(new RegExp(/-/gm), '/');
    }
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
  ).join('&');
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  );
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * 数组去重
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + '';
  const randomNum = parseInt((1 + Math.random()) * 65536) + '';
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

/**
 * 对象转formdata格式旧方法
 * @param {string} 数据对象
 */
export function objToFormDataOld(data) {
  //如果data已经是FormData,直接返回
  if (isFormData(data)) {
    console.log('isfd');
    return data;
  }

  let formData = new FormData();
  let obj = data.isSetNull ? data : cleanObjectValue(data); //如果data中必须带有null, 跳过清除null属性

  // console.log(obj);
  for (var i in obj) {
    if (Array.isArray(obj[i])) {
      obj[i].map((item, index) => {
        if (isString(item)) {
          formData.append(`${i}[${index}]`, item);
        } else {
          for (var k in item) {
            formData.append(`${i}[${index}][${k}]`, item[k]);
          }
        }
      });
    } else if (obj[i] && typeof obj[i] == 'object' && !obj[i].length) {
      //处理嵌套对象,例如:
      // let exm = {
      //   form1: {
      //     '0': {
      //       a: 0,
      //       b: 0
      //     }
      //   }
      for (var e in obj[i]) {
        // console.log(obj[i][e]);
        if (obj[i][e] && !obj[i][e].length && typeof obj[i][e] == 'object') {
          for (var ei in obj[i][e]) {
            // console.log('第三层', ei, obj[i][e], obj[i][e][ei]);
            formData.append(`${i}[${e}][${ei}]`, obj[i][e][ei]);
          }
        } else {
          formData.append(`${i}[${e}]`, obj[i][e]);
        }
      }
    } else {
      formData.append(i, obj[i]);
    }
  }
  return formData;
}

/**
 * 对象转formdata格式新方法
 * @param {string} 数据对象
 */
export function objToFormData(data) {
  //如果data已经是FormData,直接返回
  if (isFormData(data)) {
    console.log('isFormData');
    return data;
  }

  let formData = new FormData();
  let ndata = flattenObject(data);
  let obj = ndata.isSetNull ? ndata : cleanObjectValue(ndata); //如果data中必须带有null, 跳过清除null属性
  for (var key in obj) {
    let list = key.split('.');
    let keyStr = '';
    list.forEach((e, i) => {
      if (i == 0) {
        keyStr += e;
      } else {
        keyStr += `[${e}]`;
      }
    });
    formData.append(keyStr, obj[key]);
  }

  return formData;
}

/**
 * 把对象摊平
 * @param {oldObject} 对象
 */
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

/**
 * 封装promiseAll
 * @param {List} 需要同时执行的方法列表
 */
export function ajaxPromiseAll(requestList) {
  return new Promise((resolve, reject) => {
    return Promise.all(requestList)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 处理对象参数值，排除对象参数值为”“、null、undefined,'null'，并返回一个新对象
 * @param {obj} 对象
 **/
function cleanObjectValue(obj) {
  var param = {};
  if (obj === null || obj === undefined || obj === '' || obj === 'null')
    return param;
  for (var key in obj) {
    if (dataType(obj[key]) === 'Object') {
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

/**
 *  判断传入参数的类型，以字符串的形式返回
 *  @param {obj} 数据
 **/
function dataType(obj) {
  if (obj === null) return 'Null';
  if (obj === undefined) return 'Undefined';
  return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * 判断对象是否为FormData
 * @param {v} 对象
 */
export function isFormData(v) {
  return Object.prototype.toString.call(v) === '[object FormData]';
}
/**
 * 判断对象是否为String
 * @param {v} 对象
 */
export function isString(s) {
  return String(s) === s;
}

/**
 * dialogForm组件表单验证
 * @param {string} 表单组件ref名称
 * @param {object} 当前页面对象
 */
export async function formValidate(refName, page) {
  let ok = false;
  try {
    ok = await page.$refs[refName].$refs.elForm.validate();
  } catch (e) {
    return false;
  }
  return ok;
}
