interface Job {
  fn: Function,
  resolve: Function,
  reject: Function,
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
    cur.fn().then(
      cur.resolve,
      !cur.noErrors ? cur.reject : (err: any) => cur!.resolve(err)
    );
  }
}