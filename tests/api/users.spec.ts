import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/api-helpers';

test.describe('Users API - CRUD Operations', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request);
  });

  test('GET /users - should return list of users', async () => {
    const startTime = Date.now();
    const response = await api.get('/users');

    api.assertStatus(response, 200);
    api.assertResponseTime(startTime, 5000);

    const users = response.body as unknown[];
    expect(users.length).toBe(10);
  });

  test('GET /users/1 - should return single user with full profile', async () => {
    const response = await api.get('/users/1');

    api.assertStatus(response, 200);
    api.assertBodyContains(response, 'id');
    api.assertBodyContains(response, 'name');
    api.assertBodyContains(response, 'email');
    api.assertBodyContains(response, 'phone');
    api.assertBodyContains(response, 'company');

    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe('Leanne Graham');
  });

  test('GET /users/1/posts - should return user posts (alerts)', async () => {
    const response = await api.get('/users/1/posts');

    api.assertStatus(response, 200);

    const posts = response.body as unknown[];
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty('userId', 1);
  });

  test('POST /posts - should create a new alert/notification', async () => {
    const startTime = Date.now();
    const newAlert = {
      title: 'Severe Weather Alert',
      body: 'Tornado warning in effect for Austin, TX area. Seek shelter immediately.',
      userId: 1,
    };

    const response = await api.post('/posts', newAlert);

    api.assertStatus(response, 201);
    api.assertBodyContains(response, 'id');
    api.assertResponseTime(startTime, 5000);

    expect(response.body.title).toBe(newAlert.title);
    expect(response.body.body).toBe(newAlert.body);
    expect(response.body.userId).toBe(1);
  });

  test('PUT /posts/1 - should update an existing alert', async () => {
    const updatedAlert = {
      id: 1,
      title: 'UPDATED: Severe Weather Alert - All Clear',
      body: 'The tornado warning has been lifted for all areas.',
      userId: 1,
    };

    const response = await api.put('/posts/1', updatedAlert);

    api.assertStatus(response, 200);
    expect(response.body.title).toBe(updatedAlert.title);
  });

  test('PATCH /posts/1 - should partially update an alert', async () => {
    const response = await api.put('/posts/1', { title: 'Priority Update: IT Maintenance' });

    api.assertStatus(response, 200);
    expect(response.body.title).toBe('Priority Update: IT Maintenance');
  });

  test('DELETE /posts/1 - should delete an alert', async () => {
    const response = await api.delete('/posts/1');
    api.assertStatus(response, 200);
  });

  test('GET /posts - should support filtering by userId', async () => {
    const response = await api.get('/posts', { userId: '1' });

    api.assertStatus(response, 200);

    const posts = response.body as unknown[];
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach((post: unknown) => {
      expect((post as Record<string, unknown>).userId).toBe(1);
    });
  });
});
