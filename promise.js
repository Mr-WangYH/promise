// 手写promise
class MyPromise {
  constructor(executor) {
    this.initValue();
    this.initBind();
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  initValue() {
    this.promiseState = 'pending'; // 状态
    this.promiseResult = null; // 结果
    this.onFulfilledCallbacks = []; // 成功回调
    this.onRejectedCallbacks = []; // 失败回调
  }

  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  resolve(value) {
    if (this.promiseState !== 'pending') return;
    this.promiseState = 'fulfilled';
    this.promiseResult = value;
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.promiseResult);
    }
  }

  reject(value) {
    if (this.promiseState !== 'pending') return;
    this.promiseState = 'rejected';
    this.promiseResult = value;
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.promiseResult);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (res) => res;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const returnPromise = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        const resolvePromise = (cb) => {
          try {
            const x = cb(this.promiseResult);
            if (x === returnPromise) {
              reject('不能返回自己');
            } else if (x instanceof MyPromise) {
              x.then(resolve, reject);
            } else {
              resolve(x);
            }
          } catch (error) {
            reject(error);
          }
        };
        if (this.promiseState === 'fulfilled') {
          resolvePromise(onFulfilled);
        } else if (this.promiseState === 'rejected') {
          resolvePromise(onRejected);
        } else if (this.promiseState === 'pending') {
          this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled));
          this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected));
        }
      }, 0);
    });
    return returnPromise;
  }
}

const pro = new MyPromise((resolve) => {
  resolve(123);
});
pro
  .then((res) => {
    console.log(res);
    return new MyPromise((resolve) => {
      resolve(999);
    });
  })
  .then((res) => {
    console.log(res);
  });

const pro2 = new Promise((resolve) => {
  resolve(123);
});
pro2
  .then((res) => {
    console.log(res);
    return new Promise((resolve) => {
      resolve(999);
    });
  })
  .then((res) => {
    console.log(res);
  });
