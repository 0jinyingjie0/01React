# ES6-Set/Map

## Set()

JS中的数组在底层实际上是用对象模拟的，严格意义来说JS是没有数组的

而ES6新增的Set数据结构，类似数组，但是成员唯一，不能有重复的值，经常用set进行数组去重，然后再转成数组，提升开发效率

去重最简单的方法

```
let set = new Set([1,2,3,4,5,6,7]);
console.log([...set])
复制代码
let set = new Set([undefined, undefined, null, null, 5, '5', true, 1, NaN, NaN, {}, {}]);
console.log(set);
复制代码
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83237449b6d54975a2266a2bb5069403~tplv-k3u1fbpfcp-zoom-1.image)

可以看到两个相同的undefined、null、NaN都是会被去重的，ES6基本上已经修复了NaN的bug

常见的可以隐式转化的值不会被认为重复

传参必须要是具有迭代器的数据结构

```
let set = new Set([5,6]);
console.log(set);
复制代码
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f61824fe2714bf1bc5441916939660c~tplv-k3u1fbpfcp-zoom-1.image)

size相当于数组的length，指的是长度

### add 添加

添加没有对数据类型进行限制，对象也可

返回的是一个新的set实例，意味着可以链式调用

```
let set = new Set();
var x = {id: 1},
    y = {id: 2};

set.add(x).add(y);
console.log(set);
复制代码
```

### delete 删除

和对象的delete不同，set上的delete上需要点调用的，返回布尔值

```
set.delete(y);
复制代码
```

### clear 清空

要注意的是，如果先打印后清空，打印出来的是空，和对象不同

```
var obj = {a: 1, b: 2};
console.log(obj); //{a: 1, b: 2}
delete obj.a;
console.log(obj); //{b: 2}
复制代码
console.log(set); //空，尽管clear在后面
set.clear();
复制代码
```

说明这些操作是实时的，会影响操作之前的set

### has 是否包含

### 遍历方法：keys、values、entries、forEach

```
let set = new Set([1,2,3,4,5,6,7]);
console.log(set.keys());
复制代码
```

![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

具有迭代器对象，就可以用for of

set结构没有键名，虽然可以看到顺序，打印出来keys和values是一样的，打印entries键名和键值一样

```
for(let i of set.entries()){
	console.log(i);
}
复制代码
```

![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

```
for(let values of set){
	console.log(values);
}
复制代码
```

直接循环set也可以打印键值，底层调用的是values方法，所以循环一般这么调用就好了，不会用keys和values

### 拓展

内容翻倍

```
let set = new Set([1,2,3,4,5,6,7]);
let set1 = new Set([...set].map(value => value * 2));
复制代码
```

[...set]先用拓展运算符变成数组，然后该怎么处理就怎么处理

法2：

```
let set1 = new Set(Array.from(set, value => value * 2));
复制代码
```

映射出一个新的结构：set本身并没有这些map……方法，需要转一下

```
var arr = [1,2,3,4];
var arr1 = arr.map(parseInt); //[1, NaN, NaN, NaN]
console.log(arr1);
复制代码
```

parseInt可以传两个参数，第一个参数是要转换的值，第二个参数是转换的进制

map循环数组时前两个参数value，idx会自动作为parseInt的参数传进去

| value | idx  | parseInt                               |
| ----- | ---- | -------------------------------------- |
| 1     | 0    | 1以0进制数处理，结果是1                |
| 2     | 1    | 2以1进制数处理，转化为10进制，无法转化 |
| 3     | 2    | 无法转化                               |
| 4     | 3    | 无法转化                               |

用set类型，处理方式一模一样

```
let set1 = new Set([...set].map(parseInt)); //Set(2){1, NaN}
复制代码
```

------

并集、交集、差集：

```
let a = new Set([1,2,3]);
let b = new Set([4,2,3]);

let union = new Set([...a, ...b]);
let intersect = new Set([...a].filter(x => b.has(x)));
let difference = new Set([...a].filter(x => !b.has(x)))

console.log(union, intersect, difference); //Set(4){1, 2, 3, 4}; Set(2){2, 3}; Set(1){1}
复制代码
```

### set PK arr

```
let set = new Set();
let arr = new Array();
let obj = {'t': 1};
复制代码
```

增

```
set.add(obj);
arr.push({'t': 1});
复制代码
```

查

```
//let arr_exist = set.has({'t': 1}); //false
let arr_exist = set.has(obj);
let arr_exist = arr.find(item => item.t);
复制代码
```

改（一样）

```
set.forEach(item => item.t ? item.t = 2 : '');
arr.forEach(item => item.t ? item.t = 2 : '');
复制代码
```

删

```
set.forEach(item => item.t ? set.delete(item) : '');
let index = arr.findIndex(item => item.t);
arr.splice(index, 1);
复制代码
```

优势不是很明显，操作略简，值是唯一的，数据更安全

## Map()

类似对象，依旧是键值的存在，但是键值是一一对应的关系，而不是像对象，键名只能是字符串

```
var m = {};
var x = {id: 1},
	y = {id: 2};

m[x] = 'foo';
m[y] = 'bar';
console.log(m); //{[object Object]: "bar"}
复制代码
```

不能实现真正意义上的键值一一对应，键名会隐式转换成字符串，所以会出现覆盖的问题

map就不会出现这个问题

```
let m = new Map();
let x = {id: 1},
	y = {id: 2};

m.set(x, 'foo');
m.set(y, 'bar');
console.log(m); //返回map结构，所以可以进行链式调用 -- m.set(x, 'foo').set(y, 'bar');
复制代码
```

![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

参数同样是要具备iterator的数据类型，同时要有键值对，所以传入的双元的数组

```
let m = new Map([
	['name', 'zhangsan'], 
	['sex', 'male']
]);
console.log(m); //Map(2){"name" => "zhangsan", "sex" => "male"}
复制代码
```

模拟算法

```
var items = [
	['name', 'zhangsan'], 
	['sex', 'male']
];
let m = new Map();
items.forEach(([key, value]) => m.set(key, value));
复制代码
```

键名的问题：

```
m.set([5], 555);
console.log(map.get([5])); //undefined，引用值不一样，未指定指针
复制代码
```

这样才行

```
var arr = [5];
m.set(arr, 555);
console.log(map.get(arr));
复制代码
```

键名相同会覆盖

```
map.set(-0, 123);
console.log(map.get(+0)); //123
复制代码
```

map的处理方式和全等一样

```
console.log(+0 === -0); //true
console.log(Object.is(+0, -0)); //false
复制代码
```

true和'true'、undefined和null在Map里不一样；NaN和NaN一样

### 方法

map和set方法基本上一样，不同的就是存值（set）和取值（get），因为set没有键名，只需要add

map结构本质上遍历的是entries方法

```
for(let [key, value] of m){
    console.log(key, value);
}
console.log(m[Symbol.iterator] === m.entries)
复制代码
```

### map和对象/数组互转

map转换为数组也和set一样[...myMap]，数组转成map就直接传数组参数就可以了（必须要是二维数组）

map转成对象，键名要是字符串

```
const myMap = new Map();
myMap.set(true, 7)
	 .set('a', 'abc');
function strMapToObj(strMap){
	let obj = Object.create(null);
	for(let [key, val] of strMap.entries()){
		obj[key] = val;
	}
	return obj
}
console.log(strMapToObj(myMap));
复制代码
```

对象转成map

```
function objToStrMap(obj){
	let map = new Map();
	for(let key of Object.keys(obj)){
		map.set(key, obj[key]);
	}
	return map;
}
console.log(objToStrMap({true: 7, no: false}));
复制代码
```

### map PK array

```
let map = new Map();
let arr = new Array();
复制代码
```

增

```
map.set('t', 1);
arr.push({'t': 1});
复制代码
```

查

```
let map_exist = map.has('t');
let arr_exist = arr.find(item => item.t);
复制代码
```

改

```
map.set('t', 2);
arr.forEach(item => item.t ? item.t = 2 : '');
复制代码
```

删

```
map.delete('t');
let index = arr.findIndex(item => item.t);
arr.splice(index, 1);
复制代码
```

显然map更方便

### map set object

```
let item = {t: 1};
let map = new Map();
let set = new Set();
let obj = {};
复制代码
```

增

```
map.set('t', 1);
set.add(item);
obj['t'] = 1;
复制代码
```

查

```
console.log({
    map_exist: map.has('t'),
    set_exist: set.has(item),
    obj_exist: 't' in obj,
    obj_exist1: obj.hasOwnProperty('t');
});
复制代码
```

改

```
map.set('t', 2);
item.t = 2;
obj['t'] = 2;
复制代码
```

删

```
map.delete('t');
set.delete(item);
delete obj['t'];
复制代码
```

结论：优先使用map，对数据唯一性有要求的话用set

## WeakMap WeakSet

严格版的map和set，基本操作一样，但是不存在遍历方法，成员只能是对象，其他值不行

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ba0c6a65f134b899e45911721d64b8c~tplv-k3u1fbpfcp-zoom-1.image)

垃圾回收回收的是引用

```
var o1 = {
    o2: {
        x: 1
    }
}
var o3 = o1; //o3持有对o1的引用
o1 = 1; //o1被重新赋值
var o4 = o3.o2; //o4拿o2的引用，o2不被释放，引用次数累加
o3 = '123'; //o3被重新赋值，然后整个o3就没有了
o4 = null; //o4释放，所有引用都被释放了
复制代码
```

当引用被访问和修改的时候，没有手动释放，就会一直持有引用

WeakMap和WeakSet是弱引用，垃圾回收会不考虑他们的引用，不会被算入引用次数中，不可预测会被怎么回收，会随时消失，很不稳定，最好不要用。