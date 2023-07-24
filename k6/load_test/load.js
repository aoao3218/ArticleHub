import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 200 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
    { duration: '2m', target: 200 }, // stay at 100 users for 10 minutes
    { duration: '30s', target: 0 }, // ramp-down to 0 users
  ],
};

export default () => {
  const urlRes = http.get(
    'https://emmalinstudio.com/api/article/64b4e5678f2ad07adf4e573b/branch1/6f269900-d7e6-4ba9-b80e-3bc52802723f?number=3'
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
