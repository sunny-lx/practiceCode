/**
 *函数形参与实参；arguments
 */
function test(a, b) {
  console.log(a, arguments[0]);
  a = "123";
  console.log(a, arguments[0]);
  console.log(b, arguments[1]);
}
test(1, 2);
// 结果：1，1     123 123    2 2
// 解释：函数执行时，会把实参与形参统一

/**
 * 类型判断typeof
 */
let a = function () {
  console.log(11);
};
console.log(typeof a);
console.log(typeof []);
console.log(Array.isArray([1, 2]));
// 结果：
// function
// object
// true

/**
 * symbol
 */
let sym = Symbol("hah");
console.log(sym);
console.log(typeof sym);
let symObj = Object(sym);
console.log(symObj);
console.log(typeof symObj);
console.log(Symbol(1) == Symbol(1));
// 结果
// Symbol(hah)
// symbol
// Symbol {Symbol(hah), description: 'hah'}description: "hah"}
// object
// false

/**
 * 手写promise.all
 */
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
});
let p2 = new Promise((resolve, reject) => {
  reject(2);
});
let p3 = new Promise((resolve, reject) => {
  resolve(3);
});
let res = Promise.race([p1, p2, p3]);
console.log(res);
function all(promiseArr) {
  if (!Array.isArray(promiseArr)) throw new Error("你的传参不对哦");
  return new Promise((resolve, reject) => {
    // 记录传进来的promise成功的个数
    let count = 0;
    let len = promiseArr.length;
    let res = [];
    for (let i = 0; i < len; i++) {
      promiseArr[i].then(
        (value) => {
          res[i] = value;
          count++;
          if (count == len) {
            console.log(res);
            resolve(res);
          }
        },
        (reason) => {
          console.log("error");
          reject(reason);
        }
      );
    }
  });
}
console.log(all([p1, p2, p3]));

/**
 * 手写promise.race:接收promise对象的数组，将第一个promise改变状态的输出
 */
function race(promiseArr) {
  return new Promise((resolve, reject) => {
    for (let i = 0, len = promiseArr.length; i < len; i++) {
      promiseArr[i].then(
        (value) => {
          resolve(value);
        },
        (reason) => {
          reject(reason);
        }
      );
    }
  });
}
console.log(race([p1, p2, p3]));

/**
 * 手写实现apply,call,bind
 */
let obj1 = {
  name: "obj1",
  getName: function () {
    console.log("我是参数哦:", arguments);
    console.log(this);
    console.log(this.name);
  },
};
let obj2 = {
  name: "obj2",
  age: 18,
  sex: "female",
};
obj1.getName.apply(null, ["哈哈哈", "呵呵呵"]);
obj1.getName.apply(obj2, ["哈哈哈", "呵呵呵"]);
Function.prototype.myApply = function (obj, args) {
  if (obj === null || obj === undefined) {
    obj = window;
  } else {
    obj = Object(obj);
  }
  function isArrayLike(o) {
    if (!!o && "length" in o && o.length) {
      return true;
    }
    return false;
  }
  const key = Symbol();
  obj[key] = this;
  let res;
  if (args) {
    if (!Array.isArray(args) && !isArrayLike(args)) {
      throw new Error("第二个参数格式有误");
    } else {
      args = Array.from(args);
      res = obj[key](...args);
    }
  }
  delete obj[key];
  return res;
};
obj1.getName.myApply(obj2, ["哈哈哈", "呵呵呵"]);

obj1.getName.call(Function.prototype, "哈哈哈", "呵呵呵");
Function.prototype.myCall = function (obj, ...args) {
  if (obj === null || obj === undefined) {
    obj = window;
  } else {
    obj = Object(obj);
  }
  const key = Symbol();
  obj[key] = this;
  const res = obj[key](...args);
  delete obj[key];
  return res;
};
obj1.getName.myCall(obj2, "哈哈哈", "呵呵呵");

let newFunc1 = obj1.getName.bind(null, "哈哈哈", "呵呵呵");
newFunc1();
Function.prototype.myBind = function (obj, ...args) {
  if (this == Function.prototype) {
    return new TypeError();
  }
  let _this = this;
  return function F(...arg2) {
    if (this == F) {
      return new _this.obj(...args, ...arg2);
    } else {
      return _this.apply(obj, args.concat(arg2));
    }
  };
};
let newFunc2 = obj1.getName.myBind(obj2, "哈哈哈", "呵呵呵");
newFunc2("嘻嘻");

/**
 * 作用域链
 */
// 1.var
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000);
}
console.log(i);
// 2.let
for (let i = 0; i < 5; i++) {
  console.log(i);
  // 缓存参数
  setTimeout(
    function (i) {
      console.log("bind", i); // 依次输出：0 1 2 3 4
    }.bind(null, i),
    i * 1000
  );
}
console.log(i);

// 1.1
// var ab = [];
// for (var i = 0; i < 10; i++) {
//   // 作用域a
//   ab[i] = function () {
//     // 作用域b
//     console.log(i);
//   };
// }
// ab[6](); // 10
// 1.2
// var ab = [];
// { let k;
//     for (k = 0; k < 10; k++) {
//       let i = k; //注意这里，每次循环都会创建一个新的i变量
//       ab[i] = function () {
//         console.log(i);
//       };
//     }
// }
// ab[6](); // 6
/**
 * 使用了let而不是var，let的变量除了作用域是在for区块中，
 * 而且会为每次循环执行建立新的词法环境(LexicalEnvironment)，
 * 拷贝所有的变量名称与值到下个循环执行
 */

/**
 * 变量提升与函数提升
 */
function ab() {}
var ab;
console.log(typeof ab);
