import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const apiDuration = new Trend('api_duration');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const options = {
  scenarios: {
    smoke_test: {
      executor: 'constant-vus',
      vus: 5,
      duration: '30s',
      tags: { test_type: 'smoke' },
      exec: 'smokeTest',
    },
    average_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 20 },
        { duration: '30s', target: 0 },
      ],
      tags: { test_type: 'average' },
      exec: 'averageLoadTest',
    },
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 0 },
      ],
      tags: { test_type: 'stress' },
      exec: 'stressTest',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<3000'],
    errors: ['rate<0.01'],
  },
};

export function smokeTest() {
  const responses = http.batch([
    ['GET', `${BASE_URL}/posts`],
    ['GET', `${BASE_URL}/posts/1`],
    ['GET', `${BASE_URL}/users`],
  ]);

  responses.forEach((res) => {
    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 2000ms': (r) => r.timings.duration < 2000,
    });
    errorRate.add(!success);
    apiDuration.add(res.timings.duration);
  });

  sleep(1);
}

export function averageLoadTest() {
  const getPosts = http.get(`${BASE_URL}/posts`);
  check(getPosts, {
    'GET /posts - status 200': (r) => r.status === 200,
    'GET /posts - has data': (r) => {
      const body = r.json();
      return Array.isArray(body) && body.length > 0;
    },
    'GET /posts - response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  sleep(2);

  const getSinglePost = http.get(`${BASE_URL}/posts/1`);
  check(getSinglePost, {
    'GET /posts/1 - status 200': (r) => r.status === 200,
    'GET /posts/1 - has id': (r) => {
      const body = r.json();
      return (
        typeof body === 'object' &&
        body !== null &&
        'id' in body &&
        (body as { id: number }).id === 1
      );
    },
  });

  sleep(1);

  const getUsers = http.get(`${BASE_URL}/users`);
  check(getUsers, {
    'GET /users - status 200': (r) => r.status === 200,
    'GET /users - has data': (r) => {
      const body = r.json();
      return Array.isArray(body) && body.length > 0;
    },
  });

  sleep(2);
}

export function stressTest() {
  const getPosts = http.get(`${BASE_URL}/posts`);
  const success = check(getPosts, {
    'GET /posts - status 200': (r) => r.status === 200,
    'GET /posts - response time < 3000ms': (r) => r.timings.duration < 3000,
  });
  errorRate.add(!success);

  sleep(0.5);

  const postPayload = JSON.stringify({
    title: 'Performance Test Alert',
    body: 'Testing API performance under load',
    userId: 1,
  });

  const headers = { 'Content-Type': 'application/json' };
  const createPost = http.post(`${BASE_URL}/posts`, postPayload, { headers });
  const postSuccess = check(createPost, {
    'POST /posts - status 201': (r) => r.status === 201,
    'POST /posts - has id': (r) => {
      const body = r.json() as { id?: number };
      return body.id !== undefined;
    },
  });
  errorRate.add(!postSuccess);

  sleep(0.5);

  const filteredPosts = http.get(`${BASE_URL}/posts?userId=1`);
  const filterSuccess = check(filteredPosts, {
    'GET /posts?userId=1 - status 200': (r) => r.status === 200,
    'GET /posts?userId=1 - filtered correctly': (r) => {
      const posts = r.json();
      return posts.every((p: { userId: number }) => p.userId === 1);
    },
  });
  errorRate.add(!filterSuccess);

  sleep(1);
}
