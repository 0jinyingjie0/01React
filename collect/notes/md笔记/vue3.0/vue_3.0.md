# 一、前言

大家都知道，现在Vue3的各个版本已经陆续发布了，并且有很多的团队已经着手各个库的开发与Vue2向Vue3的升级，我们当然也不能落后，所以赶紧将你手中的Vue2升级到Vue3，跟着本文一起学习新的API吧

升级的方法可以点击本文开头的文章，在上一篇文章中有个**保姆级别的教程**告诉大家如何升级

# 二、正文

Vue2每次都把整个Vue导入，例如Vue2的 `main.js` 文件中的代码

```javascript
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
复制代码
```

但很明显我们的项目中不可能用到Vue所有的API，因此很多模块其实是没有用的

那么在Vue3中，对外暴露了很多的API供开发者使用，我们可以根据自己的需求，将所需要的API从Vue中导入。例如 `main.js` 中的代码

```javascript
import { createApp } from 'vue';
import App from './App.vue'

createApp(App).mount('#app')
复制代码
```

利用了 `import` 和 `export` 的导入导出语法，实现了按需打包模块的功能，项目打包后的文件体积明显小了很多

这也是我们本文需要对 `Vue3 API` 进行详细了解的原因

## （1）setup

`setup` 函数也是 `Compsition API` 的入口函数，我们的变量、方法都是在该函数里定义的，来看一下使用方法

```html
<template>
  <div id="app">
      <p>{{ number }}</p>
      <button @click="add">增加</button>
  </div>
</template>

<script>
// 1. 从 vue 中引入 ref 函数
import {ref} from 'vue'
export default {
  name: 'App',
  setup() {
      // 2. 用 ref 函数包装一个响应式变量 number
      let number = ref(0)

      // 3. 设定一个方法
      function add() {
          // number是被ref函数包装过了的，其值保存在.value中
          number.value ++
      }

      // 4. 将 number 和 add 返回出去，供template中使用
      return {number, add}
  }
  
}
</script>
复制代码
```

上述代码中用到了 `ref` 函数，下面会详细讲解，在这里你只需要理解它的作用是包装一个响应式的数据即可，并且你可以将 `ref` 函数包装过的变量看作是Vue2 `data` 中的变量

这样就简单实现了一个点击按钮数字加1的功能

------

在Vue2中，我们访问 `data` 或 `props` 中的变量，都是通过类似 `this.number` 这样的形式去获取的，但要特别注意的是，在setup中，`this` 指向的是 `undefined`，也就是说不能再向Vue2一样通过 `this` 去获取变量了

那么到底该如何获取到 `props` 中的数据呢？

其实 `setup` 函数还有两个参数，分别是 `props` 、`context`，前者存储着定义当前组件允许外界传递过来的参数名称以及对应的值；后者是一个上下文对象，能从中访问到 `attr` 、`emit` 、`slots`

其中 `emit` 就是我们熟悉的Vue2中与父组件通信的方法，可以直接拿来调用

## （2）生命周期

Vue2中有 `beforeCreate` 、`created` 、`beforeMount` 、`mounted` 、`beforeUpdate` 等生命周期函数

而在Vue3中，这些生命周期部分有所变化，并且调用的方式也有所改变，下面放上一张变化图来简单了解一下

| Vue2          | Vue3            |
| ------------- | --------------- |
| beforeCreate  | setup           |
| created       | setup           |
| beforeMount   | onBeforeMount   |
| mounted       | onMounted       |
| beforeUpdate  | onBeforeUpdate  |
| updated       | onUpdated       |
| beforeDestory | onBeforeUnmount |
| destoryed     | unMounted       |

Vue3的这些生命周期调用也很简单，同样是先从 `vue` 中导入，再进行直接调用

```html
<template>
  <div id="app"></div>
</template>

<script>
// 1. 从 vue 中引入 多个生命周期函数
import {onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, unMounted} from 'vue'
export default {
  name: 'App',
  setup() {
      onBeforeMount(() => {
          // 在挂载前执行某些代码
      })

      onMounted(() => {
          // 在挂载后执行某些代码
      })

      onBeforeUpdate(() => {
          // 在更新前前执行某些代码
      })

      onUpdated(() => {
          // 在更新后执行某些代码
      })

      onBeforeUnmount(() => {
          // 在组件销毁前执行某些代码
      })

      unMounted(() => {
          // 在组件销毁后执行某些代码
      })

      return {}
  }
  
}
</script>
复制代码
```

要特别说明一下的就是，`setup` 函数代替了 `beforeCreate` 和 `created` 两个生命周期函数，因此我们可以认为它的执行时间在`beforeCreate` 和 `created` 之间

## （3）reactive

`reactive` 方法是用来创建一个响应式的数据对象，该API也很好地解决了Vue2通过 `defineProperty` 实现数据响应式的缺陷

用法很简单，只需将数据作为参数传入即可，代码如下

```html
<template>
  <div id="app">
  	<!-- 4. 访问响应式数据对象中的 count  -->
  	{{ state.count }}
  </div>
</template>

<script>
// 1. 从 vue 中导入 reactive 
import {reactive} from 'vue'
export default {
  name: 'App',
  setup() {
      // 2. 创建响应式的数据对象
      const state = reactive({count: 3})

      // 3. 将响应式数据对象state return 出去，供template使用
      return {state}
  }
}
</script>
复制代码
```

## （4）ref

在介绍 `setup` 函数时，我们使用了 `ref` 函数包装了一个响应式的数据对象，这里表面上看上去跟 `reactive` 好像功能一模一样啊，确实差不多，因为 `ref` 就是通过 `reactive` 包装了一个对象 ，然后是将值传给该对象中的 `value` 属性，这也就解释了为什么每次访问时我们都需要加上 `.value`

我们可以简单地把 `ref(obj)` 理解为这个样子 `reactive({value: obj})`

这里我们写一段代码来具体看一下

```html
<script>
import {ref, reactive} from 'vue'
export default {
  name: 'App',
  setup() {
      const obj = {count: 3}
      const state1 = ref(obj)
      const state2 = reactive(obj)

      console.log(state1)
      console.log(state2)
  }
  
}
</script>
复制代码
```

来看一下打印结果

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

> **注意：** 这里指的 `.value` 是在 `setup` 函数中访问 `ref` 包装后的对象时才需要加的，在 `template` 模板中访问时是不需要的，因为在编译时，会自动识别其是否为 `ref` 包装过的

那么我们到底该如何选择 `ref` 和 `reactive` 呢？

**建议：**

1. 基本类型值（`String` 、`Nmuber` 、`Boolean` 等）或单值对象（类似像 `{count: 3}` 这样只有一个属性值的对象）使用 `ref`
2. 引用类型值（`Object` 、`Array`）使用 `reactive`

## （5）toRef

`toRef` 是将某个对象中的某个值转化为响应式数据，其接收两个参数，第一个参数为 `obj` 对象；第二个参数为对象中的属性名

代码如下：

```html
<script>
// 1. 导入 toRef
import {toRef} from 'vue'
export default {
    setup() {
        const obj = {count: 3}
        // 2. 将 obj 对象中属性count的值转化为响应式数据
        const state = toRef(obj, 'count')

        // 3. 将toRef包装过的数据对象返回供template使用
        return {state}
    }
}
</script>
复制代码
```

但其实表面上看上去 `toRef` 这个API好像非常的没用，因为这个功能也可以用 `ref` 实现，代码如下

```html
<script>
// 1. 导入 ref
import {ref} from 'vue'
export default {
    setup() {
        const obj = {count: 3}
        // 2. 将 obj 对象中属性count的值转化为响应式数据
        const state = ref(obj.count)

        // 3. 将ref包装过的数据对象返回供template使用
        return {state}
    }
}
</script>
复制代码
```

乍一看好像还真是，其实这两者是有区别的，我们可以通过一个案例来比较一下，代码如下

```html
<template>
    <p>{{ state1 }}</p>
    <button @click="add1">增加</button>

	<p>{{ state2 }}</p>
    <button @click="add2">增加</button>
</template>

<script>
import {ref, toRef} from 'vue'
export default {
    setup() {
        const obj = {count: 3}
        const state1 = ref(obj.count)
        const state2 = toRef(obj, 'count')

        function add1() {
            state1.value ++
            console.log('原始值：', obj);
            console.log('响应式数据对象：', state1);
        }

        function add2() {
            state2.value ++
            console.log('原始值：', obj);
            console.log('响应式数据对象：', state2);
        }

        return {state1, state2, add1, add2}
    }
}
</script>
复制代码
```

我们分别用 `ref` 和 `toRef` 将 `obj` 中的 `count` 转化为响应式，并声明了两个方法分别使 `count` 值增加，每次增加后打印一下原始值 `obj` 和被包装过的响应式数据对象，同时还要看看视图的变化

**ref：**

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 可以看到，在对响应式数据的值进行 `+1` 操作后，视图改变了，原始值未改变，响应式数据对象的值也改变了，这说明 `ref` 是对原数据的一个**拷贝**，不会影响到原始值，同时响应式数据对象值改变后会同步更新视图

**toRef：**

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 可以看到，在对响应式数据的值进行 `+1` 操作后，视图未发生改变，原始值改变了，响应式数据对象的值也改变了，这说明 `toRef` 是对原数据的一个**引用**，会影响到原始值，但是响应式数据对象值改变后会不会更新视图

**总结：**

1. `ref` 是对传入数据的拷贝；`toRef` 是对传入数据的引用
2. `ref` 的值改变会更新视图；`toRef` 的值改变不会更新视图

## （6）toRefs

了解完 `toRef` 后，就很好理解 `toRefs` 了，其作用就是将传入的对象里所有的属性的值都转化为响应式数据对象，该函数支持一个参数，即 `obj` 对象

我们来看一下它的基本使用

```html
<script>
// 1. 导入 toRefs
import {toRefs} from 'vue'
export default {
    setup() {
        const obj = {
            name: '前端印象',
            age: 22,
            gender: 0
        }
        // 2. 将 obj 对象中属性count的值转化为响应式数据
        const state = toRefs(obj)

        // 3. 打印查看一下
        console.log(state)
    }
}
</script>
复制代码
```

打印结果如下：

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 返回的是一个对象，对象里包含了每一个包装过后的响应式数据对象

## （7）shallowReactive

听这个API的名称就知道，这是一个渐层的 `reactive`，难道意思就是原本的 `reactive` 是深层的呗，没错，这是一个用于性能优化的API

其实将 `obj` 作为参数传递给 `reactive` 生成响应式数据对象时，若 `obj` 的层级不止一层，那么会将每一层都用 `Proxy` 包装一次，我们来验证一下

```html
<script>
import {reactive} from 'vue'
export default {
    setup() {
        const obj = {
            a: 1,
            first: {
                b: 2,
                second: {
                    c: 3
                }
            }
        }

        const state = reactive(obj)

        console.log(state)
        console.log(state.first)
        console.log(state.first.second)
    }
}
</script>
复制代码
```

来看一下打印结果：

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 设想一下如果一个对象层级比较深，那么每一层都用 `Proxy` 包装后，对于性能是非常不友好的

接下来我们再来看看 `shallowReactive`

```html
<script>
import {shallowReactive} from 'vue'
export default {
    setup() {
        const obj = {
            a: 1,
            first: {
                b: 2,
                second: {
                    c: 3
                }
            }
        }

        const state = shallowReactive(obj)

        console.log(state)
        console.log(state.first)
        console.log(state.first.second)
    }
}
</script>
复制代码
```

来看一下打印结果：

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 结果非常的明了了，只有第一层被 `Proxy` 处理了，也就是说只有修改第一层的值时，才会响应式更新，代码如下：

```html
<template>
	<p>{{ state.a }}</p>
	<p>{{ state.first.b }}</p>
	<p>{{ state.first.second.c }}</p>
	<button @click="change1">改变1</button>
	<button @click="change2">改变2</button>
</template>
<script>
import {shallowReactive} from 'vue'
export default {
    setup() {
        const obj = {
            a: 1,
            first: {
                b: 2,
                second: {
                    c: 3
                }
            }
        }

        const state = shallowReactive(obj)

        function change1() {
            state.a = 7
        }

        function change2() {
            state.first.b = 8
            state.first.second.c = 9
            console.log(state);
        }

        return {state}
    }
}
</script>
复制代码
```

来看一下具体过程：

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 首先我们点击了第二个按钮，改变了第二层的 `b` 和第三层的 `c`，虽然值发生了改变，但是视图却没有进行更新；

当我们点击了第一个按钮，改变了第一层的 `a` 时，整个视图进行了更新；

由此可说明，`shallowReactive` 监听了第一层属性的值，一旦发生改变，则更新视图

## （8）shallowRef

这是一个浅层的 `ref`，与 `shallowReactive` 一样是拿来做性能优化的

`shallowReactive` 是监听对象第一层的数据变化用于驱动视图更新，那么 `shallowRef` 则是监听 `.value` 的值的变化来更新视图的

我们来看一下具体代码

```html
<template>
	<p>{{ state.a }}</p>
	<p>{{ state.first.b }}</p>
	<p>{{ state.first.second.c }}</p>
	<button @click="change1">改变1</button>
	<button @click="change2">改变2</button>
</template>

<script>
import {shallowRef} from 'vue'
export default {
    setup() {
        const obj = {
            a: 1,
            first: {
                b: 2,
                second: {
                    c: 3
                }
            }
        }

        const state = shallowRef(obj)
        console.log(state);

        function change1() {
            // 直接将state.value重新赋值
            state.value = {
                a: 7,
                first: {
                    b: 8,
                    second: {
                        c: 9
                    }
                }
            }
        }

        function change2() {
            state.value.first.b = 8
            state.value.first.second.c = 9
            console.log(state);
        }

        return {state, change1, change2}
    }
}
</script>
复制代码
```

首先看一下被 `shallowRef` 包装过后是怎样的结构

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 然后再来看看改变其值会有什么变化

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 我们先点击了第二个按钮，发现数据确实被改变了，但是视图并没随之更新；

于是点击了第二个按钮，即将整个 `.value` 重新赋值了，视图就立马更新了

这么一看，未免也太过麻烦了，改个数据还要重新赋值，不要担心，此时我们可以用到另一个API，叫做 `triggerRef` ，调用它就可以立马更新视图，其接收一个参数 `state` ，即需要更新的 `ref` 对象

我们来使用一下

```html
<template>
	<p>{{ state.a }}</p>
	<p>{{ state.first.b }}</p>
	<p>{{ state.first.second.c }}</p>
	<button @click="change">改变</button>
</template>

<script>
import {shallowRef, triggerRef} from 'vue'
export default {
    setup() {
        const obj = {
            a: 1,
            first: {
                b: 2,
                second: {
                    c: 3
                }
            }
        }

        const state = shallowRef(obj)
        console.log(state);

        function change() {
            state.value.first.b = 8
            state.value.first.second.c = 9
            // 修改值后立即驱动视图更新
            triggerRef(state)
            console.log(state);
        }

        return {state, change}
    }
}
</script>
复制代码
```

我们来看一下具体过程

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 可以看到，我们没有给 `.value` 重新赋值，只是在修改值后，调用了 `triggerRef` 就实现了视图的更新

## （9）toRaw

`toRaw` 方法是用于获取 `ref` 或 `reactive` 对象的原始数据的

先来看一段代码

```html
<template>
	<p>{{ state.name }}</p>
	<p>{{ state.age }}</p>
	<button @click="change">改变</button>
</template>

<script>
import {reactive} from 'vue'
export default {
    setup() {
        const obj = {
            name: '前端印象',
            age: 22
        }

        const state = reactive(obj)	

        function change() {
            state.age = 90
            console.log(obj); // 打印原始数据obj
            console.log(state);  // 打印 reactive对象
        }

        return {state, change}
    }
}
</script>
复制代码
```

来看看具体过程

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 我们改变了 `reactive` 对象中的数据，于是看到原始数据 `obj` 和被 `reactive` 包装过的对象的值都发生了变化，由此我们可以看出，这两者是一个引用关系

那么此时我们就想了，那如果直接改变原始数据 `obj` 的值，会怎么样呢？答案是： `reactive` 的值也会跟着改变，但是视图不会更新

由此可见，当我们想修改数据，但不想让视图更新时，可以选择直接修改原始数据上的值，因此需要先获取到原始数据，我们可以使用 Vue3 提供的 `toRaw` 方法

`toRaw` 接收一个参数，即 `ref` 对象或 `reactive` 对象

```html
<script>
import {reactive, toRaw} from 'vue'
export default {
    setup() {
        const obj = {
            name: '前端印象',
            age: 22
        }

        const state = reactive(obj)	
        const raw = toRaw(state)

        console.log(obj === raw)   // true
    }
}
</script>
复制代码
```

上述代码就证明了 `toRaw` 方法从 `reactive` 对象中获取到的是原始数据，因此我们就可以很方便的通过修改原始数据的值而不更新视图来做一些性能优化了

> **注意：** 补充一句，当 `toRaw` 方法接收的参数是 `ref` 对象时，需要加上 `.value` 才能获取到原始数据对象

## （10）markRaw

`markRaw` 方法可以将原始数据标记为非响应式的，即使用 `ref` 或 `reactive` 将其包装，仍无法实现数据响应式，其接收一个参数，即原始数据，并返回被标记后的数据

我们来看一下代码

```html
<template>
	<p>{{ state.name }}</p>
	<p>{{ state.age }}</p>
	<button @click="change">改变</button>
</template>

<script>
import {reactive, markRaw} from 'vue'
export default {
    setup() {
        const obj = {
            name: '前端印象',
            age: 22
        }
        // 通过markRaw标记原始数据obj, 使其数据更新不再被追踪
        const raw = markRaw(obj)   
        // 试图用reactive包装raw, 使其变成响应式数据
        const state = reactive(raw)	

        function change() {
            state.age = 90
            console.log(state);
        }

        return {state, change}
    }
}
</script>
复制代码
```

我们来看一下在被 `markRaw` 方法处理过后的数据是否还能被 `reactive` 包装成响应式数据

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 从图中可以看到，即使我们修改了值也不会更新视图了，即没有实现数据响应式

## （11）provide && inject

与 Vue2中的 `provide` 和 `inject` 作用相同，只不过在Vue3中需要手动从 `vue` 中导入

这里简单说明一下这两个方法的作用：

- **provide** ：向子组件以及子孙组件传递数据。接收两个参数，第一个参数是 `key`，即数据的名称；第二个参数为 `value`，即数据的值
- **inject** ：接收父组件或祖先组件传递过来的数据。接收一个参数 `key`，即父组件或祖先组件传递的数据名称

假设这有三个组件，分别是 `A.vue` 、`B.vue` 、`C.vue`，其中 `B.vue` 是 `A.vue` 的子组件，`C.vue` 是 `B.vue` 的子组件

```html
// A.vue
<script>
import {provide} from 'vue'
export default {
    setup() {
        const obj= {
            name: '前端印象',
            age: 22
        }

        // 向子组件以及子孙组件传递名为info的数据
        provide('info', obj)
    }
}
</script>

// B.vue
<script>
import {inject} from 'vue'
export default {
    setup() {	
        // 接收A.vue传递过来的数据
        inject('info')  // {name: '前端印象', age: 22}
    }
}
</script>

// C.vue
<script>
import {inject} from 'vue'
export default {
    setup() {	
        // 接收A.vue传递过来的数据
        inject('info')  // {name: '前端印象', age: 22}
    }
}
</script>
复制代码
```

## （12）watch && watchEffect

`watch` 和 `watchEffect` 都是用来监视某项数据变化从而执行指定的操作的，但用法上还是有所区别

**watch**：watch( source, cb, [options] )

参数说明：

- source：可以是表达式或函数，用于指定监听的依赖对象
- cb：依赖对象变化后执行的回调函数
- options：可参数，可以配置的属性有 immediate（立即触发回调函数）、deep（深度监听）

当监听 `ref` 类型时：

```html
<script>
import {ref, watch} from 'vue'
export default {
    setup() {	
        const state = ref(0)

        watch(state, (newValue, oldValue) => {
            console.log(`原值为${oldValue}`)
            console.log(`新值为${newValue}`)
            /* 1秒后打印结果：
                            原值为0
                            新值为1
            */
        })

        // 1秒后将state值+1
        setTimeout(() => {
            state.value ++
        }, 1000)
    }
}
</script>
复制代码
```

当监听 `reactive` 类型时：

```html
<script>
import {reactive, watch} from 'vue'
export default {
    setup() {	
        const state = reactive({count: 0})

        watch(() => state.count, (newValue, oldValue) => {
            console.log(`原值为${oldValue}`)
            console.log(`新值为${newValue}`)
            /* 1秒后打印结果：
                            原值为0
                            新值为1
            */
        })

        // 1秒后将state.count的值+1
        setTimeout(() => {
            state.count ++
        }, 1000)
    }
}
</script>
复制代码
```

当同时监听多个值时：

```html
<script>
import {reactive, watch} from 'vue'
export default {
    setup() {	
        const state = reactive({ count: 0, name: 'zs' })

        watch(
            [() => state.count, () => state.name], 
            ([newCount, newName], [oldvCount, oldvName]) => {
                console.log(oldvCount) // 旧的 count 值
                console.log(newCount) // 新的 count 值
                console.log(oldName) // 旧的 name 值
                console.log(newvName) // 新的 name 值
            }
        )

        setTimeout(() => {
          state.count ++
          state.name = 'ls'
        }, 1000)
    }
}
</script>
复制代码
```

因为 `watch` 方法的第一个参数我们已经指定了监听的对象，因此当组件初始化时，不会执行第二个参数中的回调函数，若我们想让其初始化时就先执行一遍，可以在第三个参数对象中设置 `immediate: true`

```
watch` 方法默认是渐层的监听我们指定的数据，例如如果监听的数据有多层嵌套，深层的数据变化不会触发监听的回调，若我们想要其对深层数据也进行监听，可以在第三个参数对象中设置 `deep: true
```

> **补充：** watch方法会返回一个stop方法，若想要停止监听，便可直接执行该stop函数

------

接下来再来聊聊 `watchEffect`，它与 `watch` 的区别主要有以下几点：

1. 不需要手动传入依赖
2. 每次初始化时会执行一次回调函数来自动获取依赖
3. 无法获取到原值，只能得到变化后的值

来看一下该方法如何使用：

```html
<script>
import {reactive, watchEffect} from 'vue'
export default {
    setup() {	
        const state = reactive({ count: 0, name: 'zs' })

        watchEffect(() => {
            console.log(state.count)
            console.log(state.name)
            /*  初始化时打印：
                            0
                            zs

                1秒后打印：
                            1
                            ls
            */
        })

        setTimeout(() => {
          state.count ++
          state.name = 'ls'
        }, 1000)
    }
}
</script>
复制代码
```

从上述代码中可以看出，我们并没有像 `watch` 方法一样先给其传入一个依赖，而是直接指定了一个回调函数

当组件初始化时，将该回调函数执行一次，自动获取到需要检测的数据是 `state.count` 和 `state.name`

根据以上特征，我们可以自行选择使用哪一个监听器

## （13）getCurrentInstance

我们都知道在Vue2的任何一个组件中想要获取当前组件的实例可以通过 `this` 来得到，而在Vue3中我们大量的代码都在 `setup` 函数中运行，并且在该函数中 `this` 指向的是 `undefined`，那么该如何获取到当前组件的实例呢？

这时可以用到另一个方法，即 `getCurrentInstance`

```html
<template>
	<p>{{ num }}</p>
</template>
<script>
import {ref, getCurrentInstance} from 'vue'
export default {
    setup() {	
        const num = ref(3)
        const instance = getCurrentInstance()
        console.log(instance)

        return {num}
    }
}
</script>
复制代码
```

我们来看一下其打印结果

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 因为 `instance` 包含的内容太多，所以没截完整，但是主要的内容都在图上了，我们重点来看一下 `ctx` 和 `proxy`，因为这两个才是我们想要的 `this` 的内容

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) ![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 可以看到 `ctx` 和 `proxy` 的内容十分类似，只是后者相对于前者外部包装了一层 `proxy`，由此可说明 `proxy` 是响应式的

## （14）useStore

在Vue2中使用 Vuex，我们都是通过 `this.$store` 来与获取到Vuex实例，但上一部分说了原本Vue2中的 `this` 的获取方式不一样了，并且我们在Vue3的 `getCurrentInstance().ctx` 中也没有发现 `$store` 这个属性，那么如何获取到Vuex实例呢？这就要通过 `vuex` 中的一个方法了，即 `useStore`

```js
// store 文件夹下的 index.js
import Vuex from 'vuex'

const store = Vuex.createStore({
    state: {
        name: '前端印象',
        age: 22
    },
    mutations: {
        ……
    },
    ……
})

// example.vue
<script>
// 从 vuex 中导入 useStore 方法
import {useStore} from 'vuex'
export default {
    setup() {	
        // 获取 vuex 实例
        const store = useStore()

        console.log(store)
    }
}
</script>
复制代码
```

我们来看一下打印结果

![在这里插入图片描述](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>) 然后接下来就可以像之前一样正常使用 `vuex` 了

## （15）获取标签元素

最后再补充一个 `ref` 另外的作用，那就是可以获取到标签元素或组件

在Vue2中，我们获取元素都是通过给元素一个 `ref` 属性，然后通过 `this.$refs.xx` 来访问的，但这在Vue3中已经不再适用了

接下来看看Vue3中是如何获取元素的吧

```html
<template>
  <div>
    <div ref="el">div元素</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  setup() {
      // 创建一个DOM引用，名称必须与元素的ref属性名相同
      const el = ref(null)

      // 在挂载后才能通过 el 获取到目标元素
      onMounted(() => {
        el.value.innerHTML = '内容被修改'
      })

      // 把创建的引用 return 出去
      return {el}
  }
}
</script>
复制代码
```

获取元素的操作一共分为以下几个步骤：

1. 先给目标元素的 `ref` 属性设置一个值，假设为 `el`
2. 然后在 `setup` 函数中调用 `ref` 函数，值为 `null`，并赋值给变量 `el`，这里要注意，该变量名必须与我们给元素设置的 `ref` 属性名相同
3. 把对元素的引用变量 `el` 返回（return）出去

> **补充**：设置的元素引用变量只有在组件挂载后才能访问到，因此在挂载前对元素进行操作都是无效的

当然如果我们引用的是一个组件元素，那么获得的将是该组件的实例对象，这里就不做过多的演示了


