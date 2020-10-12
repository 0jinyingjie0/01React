// 在class内只能写构造器 静态方法和属性 实例方法
class Animal {
    // 构造器
    constructor(name,age){
        this.name=name,
        this.age=age 
    }

    // 静态属性
    // 在class内部通过static修饰的就是静态属性
    static info='eee'

    // 实例方法,挂在到了原型对象上
    submit(){
        console.log('submit');
    }

    // 静态方法
    static show(){
        console.log('show');
    }
}

const A1=new Animal('小明',23)