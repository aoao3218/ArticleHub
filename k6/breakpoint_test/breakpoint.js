import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  executor: 'ramping-arrival-rate', //Assure load increase if the system slows
  stages: [
    { duration: '15m', target: 100 }, // just slowly ramp-up to a HUGE load
  ],
};

export default () => {
  const urlRes = http.get(
    'https://emmalinstudio.com/api/article/64aa5ee1ca911954f048b645/0703/842d851c-b2be-4414-ad21-e9d75588b560?number=8'
  );
  sleep(1);
  check(urlRes, {
    'Status is 200': (r) => {
      if (r.status !== 200) {
        fail(`Unexpected status code: ${r.status}`);
      }
      return true;
    },
    // 'Response time is less than 500ms': (r) => {
    //   if (r.timings.duration >= 500) {
    //     fail(`Response time exceeded 500ms: ${r.timings.duration}ms`);
    //   }
    //   return true;
    // },
  });
};
