// // Promise结合generator函数使用
// function fn(num) {
//   return new Promise( resolve => {
//     setTimeout(() => {
//       resolve(num * 2)
//     },1000)
//   })
// }

// function* generator() {
//   const num1 = yield fn(1)
//   console.log(num1);
//   const num2 = yield fn(num1)
//   console.log(num2);
//   const num3 = yield fn(num2)
//   console.log(num3);
//   return num3
// }

// // const gen = generator()   //生成一个迭代器

// // gen.next().value.then(res1 => {
// //   console.log(res1);  // 2
// //   gen.next(res1).value.then(res2 => {
// //     console.log(res2);  // 4
// //     gen.next(res2).value.then(res3 => {
// //       console.log(res3);  // 8
// //       console.log(gen.next(res3));  // { value: 8, done: true }
// //     })
// //   })
// // })


// // function generatorToAsync(generatorFn){
// //   return function() {
// //     return new Promise((resolve, reject) => {
// //       const gen = generatorFn()   //生成一个迭代器

// //       gen.next().value.then(res1 => {
// //         gen.next(res1).value.then(res2 => {
// //           gen.next(res2).value.then(res3 => {
// //             // console.log(gen.next(res3).value);  // { value: 8, done: true }
// //             resolve(gen.next(res3).value)
            
// //           })
// //         })
// //       })
// //     })
// //   }
// // }

// function generatorToAsync(generatorFn){
//   return function() {
//     const gen = generatorFn(this,arguments);   //生成一个迭代器
//     return new Promise((resolve, reject) => {
//       function go(key,arg){
//         let res;
//         try {
//           res = gen[key](arg)
//         } catch (error) {
//           reject(error)
//         }
//         const {value,done} = res;
//         if(done){
//           resolve(value)
//         }else {
//           // -- 这行代码就是精髓 --
//           // 将所有值promise化
//           // 比如 yield 1
//           // const a = Promise.resolve(1) a 是一个 promise
//           // const b = Promise.resolve(a) b 是一个 promise
//           // 可以做到统一 promise 输出
//           Promise.resolve(value).then(res => go('next',res),err => go('throw',err))
//         }
//       }
//       go('next')
//     })
//   }
// }

// const asyncFn = generatorToAsync(generator)
// const asyncRes = asyncFn()
// console.log(asyncRes);
// asyncRes.then(res => console.log(res));

// // ---------- async ---------- 
// // async function asyncFn() {
// //   const num1 = await fn(1)
// //   console.log(num1)
// //   const num2 = await fn(num1)
// //   console.log(num2)
// //   const num3 = await fn(num2)
// //   console.log(num3)
// //   return num3
// // }
// // const asyncRes = asyncFn()
// // console.log(asyncRes) 
// // asyncRes.then(res => console.log(res)) 


