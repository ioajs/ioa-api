import { createApp } from 'ioa';

console.time()

await createApp("./main");

console.timeEnd()
