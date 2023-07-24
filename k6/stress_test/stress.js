import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Key configurations for Stress in this section
  stages: [
    { duration: '10s', target: 200 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
    { duration: '30s', target: 200 }, // stay at higher 200 users for 10 minutes
    { duration: '5s', target: 0 }, // ramp-down to 0 users
  ],
};

export default () => {
  const urlRes = http.get(
    'https://emmalinstudio.com/api/article/64a4bdf76ae24e507f01efdf/main/945ecedf-1e6a-4ccb-9a78-04b96bdf6ba8?number=4'
  );
  // console.log(urlRes.body);
  sleep(1);
  check(urlRes, {
    'Status is 200': (r) => r.status === 200,
    // 'Response time is less than 500ms': (r) => r.timings.duration < 500,
  });
};
