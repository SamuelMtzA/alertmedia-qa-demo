import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/api-helpers';

test.describe('Posts API - Alert/Notification Endpoints', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request);
  });

  test('GET /posts - should return all alerts', async () => {
    const startTime = Date.now();
    const response = await api.get('/posts');

    api.assertStatus(response, 200);
    api.assertResponseTime(startTime, 5000);

    const posts = response.body as unknown[];
    expect(posts.length).toBe(100);
  });

  test('GET /posts/1 - should return single alert with all fields', async () => {
    const response = await api.get('/posts/1');

    api.assertStatus(response, 200);
    api.assertBodyContains(response, 'userId');
    api.assertBodyContains(response, 'id');
    api.assertBodyContains(response, 'title');
    api.assertBodyContains(response, 'body');
  });

  test('GET /posts/1/comments - should return alert responses', async () => {
    const response = await api.get('/posts/1/comments');

    api.assertStatus(response, 200);

    const comments = response.body as unknown[];
    expect(comments.length).toBeGreaterThan(0);

    const comment = comments[0] as Record<string, unknown>;
    expect(comment).toHaveProperty('postId', 1);
    expect(comment).toHaveProperty('name');
    expect(comment).toHaveProperty('email');
    expect(comment).toHaveProperty('body');
  });

  test('POST /posts - should create alert with required fields', async () => {
    const alert = {
      title: 'Office Closure - Friday',
      body: 'All offices will be closed this Friday for maintenance.',
      userId: 1,
    };

    const response = await api.post('/posts', alert);

    api.assertStatus(response, 201);
    expect(response.body.title).toBe(alert.title);
    expect(response.body.body).toBe(alert.body);
    expect(response.body.userId).toBe(alert.userId);
    expect(response.body.id).toBeDefined();
  });

  test('POST /posts - should handle empty body gracefully', async () => {
    const response = await api.post('/posts', {});
    api.assertStatus(response, 201);
    expect(response.body.id).toBeDefined();
  });

  test('GET /posts/999 - should return 404 for non-existent alert', async () => {
    const response = await api.get('/posts/999');
    api.assertStatus(response, 404);
  });

  test('response headers should include correct content-type', async () => {
    const response = await api.get('/posts/1');

    api.assertStatus(response, 200);
    expect(response.headers['content-type']).toContain('application/json');
  });

  test('multiple sequential requests should maintain consistency', async () => {
    const response1 = await api.get('/posts/1');
    const response2 = await api.get('/posts/1');

    api.assertStatus(response1, 200);
    api.assertStatus(response2, 200);
    expect(response1.body).toEqual(response2.body);
  });
});
