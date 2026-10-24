import 'reflect-metadata';
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createApp } from '../src/app';
import { seedProfile } from '../prisma/seed';

let app: INestApplication;
let base: string;
const prisma = new PrismaClient();

before(async () => {
  const database = new URL(process.env.DATABASE_URL ?? '');
  assert.equal(database.pathname, '/card_test', 'Tests require the separate card_test database');
  await seedProfile(prisma);
  app = await createApp();
  await app.listen(0, '127.0.0.1');
  base = await app.getUrl();
});

after(async () => {
  await app?.close();
  await prisma.$disconnect();
});

async function query(document: string) {
  const response = await fetch(base + '/graphql', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: document }),
  });
  return { status: response.status, body: await response.json() };
}

test('returns the profile with nested, ordered professional data', async () => {
  const { body } = await query(`{ profile {
    name description links { label url } skills { name }
    experience { company position startDate endDate achievements }
    projects { name description url stack }
  } }`);
  assert.equal(body.errors, undefined);
  assert.equal(body.data.profile.name, 'Демид Кондратов');
  assert.equal(body.data.profile.skills[0].name, 'Python');
  assert.equal(body.data.profile.experience[0].company, 'MAXCAPITAL');
  assert.equal(body.data.profile.experience[0].startDate, '2023-02');
  assert.equal(body.data.profile.experience[0].endDate, '2026-03');
  assert.equal(body.data.profile.projects.length, 4);
  assert.match(body.data.profile.projects[0].url, /^https:\/\/github.com\//);
  assert.equal(body.data.profile.projects[1].url, null);
});

test('seeding twice preserves the profile identity and does not duplicate relations', async () => {
  const beforeSeed = await prisma.profile.findUniqueOrThrow({ where: { slug: 'demid' } });
  await seedProfile(prisma);
  await seedProfile(prisma);
  const afterSeed = await prisma.profile.findUniqueOrThrow({
    where: { slug: 'demid' }, include: { skills: true, experience: true, projects: true, links: true },
  });
  assert.equal(afterSeed.id, beforeSeed.id);
  assert.equal(afterSeed.skills.length, 9);
  assert.equal(afterSeed.projects.length, 4);
  assert.equal(afterSeed.experience.length, 1);
  assert.equal(afterSeed.links.length, 1);
});

test('rejects fields and writes outside the public schema', async () => {
  const privateField = await query('{ profile { phone } }');
  assert.ok(privateField.body.errors?.length);
  const mutation = await query('mutation { deleteProfile }');
  assert.ok(mutation.body.errors?.length);
});

test('serves Apollo Sandbox', async () => {
  const response = await fetch(base + '/graphql', { headers: { accept: 'text/html' } });
  assert.equal(response.status, 200);
  assert.match(await response.text(), /embeddable-sandbox|Apollo Sandbox/);
});

test('readiness checks the database', async () => {
  const response = await fetch(base + '/health');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('missing profile produces a controlled error without exposing database details', async () => {
  await prisma.profile.delete({ where: { slug: 'demid' } });
  try {
    const { body } = await query('{ profile { name } }');
    assert.equal(body.data, null);
    assert.equal(body.errors[0].message, 'Profile not found');
    assert.equal(body.errors[0].extensions.stacktrace, undefined);
    assert.ok(!JSON.stringify(body).includes(process.env.DATABASE_URL!));
  } finally {
    await seedProfile(prisma);
  }
});
