interface Job {
  fn: Function,
  resolve: (value: any) => any,
  reject: (value: any) => any,
  noErrors: Boolean
}

var queues: { [key: string | symbol]: Job[] } = {};

export function getQueue(name: string) {
  return async function apiQueue<Type extends (...args: any) => any>(fn: Type, noErrors = false): Promise<ReturnType<Type>> {
    if (!(name in queues)) throw `unknown queue ${name}`;
    return new Promise((resolve, reject) => {
      queues[name].push({ fn, resolve, reject, noErrors });
    })
  }
}

export function createQueue(name: string, interval: number) {
  if (name in queues) return getQueue(name);
  queues[name] = [];
  setInterval(handleQueue, interval, queues[name]);
  return getQueue(name);
}

async function handleQueue(jobs: Job[]) {
  var cur = jobs.shift();
  if (cur) {
    try {
      var res = cur.fn();
      if (res instanceof Promise) {
        res.then(
          cur.resolve,
          cur.noErrors ? cur.resolve : cur.reject
        );
      } else cur.resolve(res);
    } catch (e) {
      if (cur.noErrors) cur.resolve(e);
      else cur.reject(e);
    }
  }
}