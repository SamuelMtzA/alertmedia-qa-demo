import { test, expect } from '@playwright/test';
import { alertPayloads } from '../fixtures/test-data';
import * as allure from 'allure-js-commons';

interface Post {
  id?: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

test.describe('Users API - CRUD Operations', () => {
  test('GET /users - should return list of users', async ({ request }) => {
    await allure.epic('API Testing');
    await allure.feature('Users');
    await allure.story('Get All Users');

    await allure.step('Send GET request to /users', async () => {
      const response = await request.get('/users');
      expect(response.status()).toBe(200);

      const users: User[] = await response.json();
      expect(users.length).toBe(10);
    });
  });

  test('GET /users/1 - should return single user', async ({ request }) => {
    await allure.epic('API Testing');
    await allure.feature('Users');
    await allure.story('Get Single User');

    const response = await request.get('/users/1');
    expect(response.status()).toBe(200);

    const user: User = await response.json();
    expect(user.id).toBe(1);
    expect(user.name).toBe('Leanne Graham');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('phone');
  });

  test('GET /users/1/posts - should return user posts', async ({ request }) => {
    await allure.epic('API Testing');
    await allure.feature('Users');
    await allure.story('Get User Posts');

    const response = await request.get('/users/1/posts');
    expect(response.status()).toBe(200);

    const posts: Post[] = await response.json();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].userId).toBe(1);
  });

  test('POST /posts - should create a new post', async ({ request }) => {
    await allure.epic('API Testing');
    await allure.feature('Posts');
    await allure.story('Create Post');
    await allure.severity('critical');

    await allure.step('Send POST request with new post data', async () => {
      const response = await request.post('/posts', { data: alertPayloads.severeWeather });
      expect(response.status()).toBe(201);

      const created: Post = await response.json();
      expect(created.title).toBe(alertPayloads.severeWeather.title);
      expect(created.body).toBe(alertPayloads.severeWeather.body);
      expect(created.id).toBeDefined();
    });
  });

  test('PUT /posts/1 - should update existing post', async ({ request }) => {
    await allure.epic('API Testing');
    await allure.feature('Posts');
    await allure.story('Update Post');

    const updatedPost: Post = {
      id: 1,
      title: 'UPDATED: Severe Weather Alert - All Clear',
      body: 'The tornado warning has been lifted.',
      userId: 1,
    };

    const response = await request.put('/posts/1', { data: updatedPost });
    expect(response.status()).toBe(200);

    const updated: Post = await response.json();
    expect(updated.title).toBe(updatedPost.title);
  });

  test('DELETE /posts/1 - should delete post', async ({ request }) => {
    await allure.epic('API Testing');
    await allure.feature('Posts');
    await allure.story('Delete Post');

    const response = await request.delete('/posts/1');
    expect(response.status()).toBe(200);
  });

  test('GET /posts - should support filtering by userId', async ({ request }) => {
    await allure.epic('API Testing');
    await allure.feature('Posts');
    await allure.story('Filter Posts');

    const response = await request.get('/posts?userId=1');
    expect(response.status()).toBe(200);

    const posts: Post[] = await response.json();
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach((post: Post) => {
      expect(post.userId).toBe(1);
    });
  });
});

test.describe('Posts API - Alert/Notification Endpoints', () => {
  test('GET /posts - should return all posts', async ({ request }) => {
    await allure.epic('API Testing');
    await allure.feature('Posts');
    await allure.story('Get All Posts');

    const response = await request.get('/posts');
    expect(response.status()).toBe(200);

    const posts: Post[] = await response.json();
    expect(posts.length).toBe(100);
  });

  test('GET /posts/1 - should return single post with all fields', async ({ request }) => {
    await allure.epic('API Testing');
    await allure.feature('Posts');
    await allure.story('Get Single Post');

    const response = await request.get('/posts/1');
    expect(response.status()).toBe(200);

    const post: Post = await response.json();
    expect(post).toHaveProperty('userId');
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
  });

  test('GET /posts/1/comments - should return post comments', async ({ request }) => {
    await allure.epic('API Testing');
    await allure.feature('Posts');
    await allure.story('Get Post Comments');

    const response = await request.get('/posts/1/comments');
    expect(response.status()).toBe(200);

    const comments = await response.json();
    expect(comments.length).toBeGreaterThan(0);
    expect(comments[0].postId).toBe(1);
  });

  test('GET /posts/999 - should return 404 for non-existent post', async ({ request }) => {
    await allure.epic('API Testing');
    await allure.feature('Posts');
    await allure.story('Non-existent Post');
    await allure.severity('normal');

    const response = await request.get('/posts/999');
    expect(response.status()).toBe(404);
  });

  test('response headers should include correct content-type', async ({ request }) => {
    await allure.epic('API Testing');
    await allure.feature('Posts');
    await allure.story('Response Headers');

    const response = await request.get('/posts/1');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
  });
});
