import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { TextStatus } from '../src/texts/types/textStatus';
import { Text, TextSchema } from '../src/texts/schemas/text.schema';
import mongoose from 'mongoose';

describe('Texts (e2e)', () => {
  let app: INestApplication;
  let textId = '';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      /*  .overrideProvider(TextsService)
      .useValue(textsService) */
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/texts').expect(200);
  });

  it('/ (Post)', async () => {
    const data = {
      content: {
        ar: 'السلام',
        fr: 'salut',
        en: 'hello',
      },
    };

    const res = await request(app.getHttpServer()).post('/texts').send(data);
    expect(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.content.en).toEqual('hello');
    expect(res.body.content.ar).toEqual('السلام');
    expect(res.body.content.fr).toEqual('salut');
    expect(res.body.status).toEqual(TextStatus.Draft);
  });

  it('/ (Post) Text status is Draft by default', async () => {
    const data = {
      content: {
        ar: 'السلام',
        fr: 'salut',
        en: 'hello',
      },
      status: TextStatus.Submitted,
    };

    const res = await request(app.getHttpServer()).post('/texts').send(data);
    expect(201);
    expect(res.body.status).toEqual(TextStatus.Draft);
  });

  it('/ (Put) Update Text', async () => {
    const data = {
      content: {
        ar: 'السلام',
        fr: 'salut',
        en: 'hello',
      },
    };

    const postRes = await request(app.getHttpServer())
      .post('/texts')
      .send(data);

    expect(201);

    textId = postRes.body._id;

    const putRes = await request(app.getHttpServer())
      .put(`/texts/${textId}`)
      .send({
        content: { ...data.content, en: 'hi' },
      });

    expect(200);
    expect(putRes.body.content.en).toEqual('hi');
  });

  it('/ (Get) count words in given text', async () => {
    const res = await request(app.getHttpServer()).get(
      `/texts/${textId}/count`,
    );

    expect(200);
    expect(res.body).toHaveProperty('arabicWords');
    expect(res.body).toHaveProperty('frenchWords');
    expect(res.body).toHaveProperty('englishWords');
    expect(res.body).toHaveProperty('totalWords');
  });

  it('/ (Get) count words in given text by language', async () => {
    const lang = 'en';
    const res = await request(app.getHttpServer()).get(
      `/texts/${textId}/count/${lang}`,
    );

    expect(200);
    expect(res.body).toHaveProperty(lang);
  });

  it('/ (Get) most occurrent word in text database', async () => {
    const res = await request(app.getHttpServer()).get('/texts/mostOccurent');

    expect(200);
    expect(res.body).toHaveProperty('word');
    expect(res.body).toHaveProperty('wordCount');
    expect(res.body).toHaveProperty('language');
  });

  it('/ (Put) submit text for review', async () => {
    const res = await request(app.getHttpServer()).put(
      `/texts/${textId}/submit`,
    );

    expect(200);
    expect(res.body.status).toEqual(TextStatus.Submitted);
  });

  it('/ (Put) submit text already submitted for review', async () => {
    const res = await request(app.getHttpServer()).put(
      `/texts/${textId}/submit`,
    );

    expect(400);
  });

  it('/ (Put) approve request after review', async () => {
    const res = await request(app.getHttpServer()).put(
      `/texts/${textId}/approve`,
    );

    expect(200);
    expect(res.body.status).toEqual(TextStatus.Approved);
  });

  it('/ (Put) reject request after submitted', async () => {
    let id = '';
    const data = {
      content: {
        ar: 'تجريب',
        fr: 'test',
        en: 'test',
      },
    };

    const res = await request(app.getHttpServer()).post('/texts').send(data);
    expect(201);
    id = res.body._id;
    textId = id;
    await request(app.getHttpServer()).put(`/texts/${id}/submit`);

    expect(200);

    const rejectRes = await request(app.getHttpServer()).put(
      `/texts/${id}/reject`,
    );

    expect(200);
    expect(rejectRes.body.status).toEqual(TextStatus.Rejected);
  });

  it('/ (Put) reject request after rejected or drafted throw exception', async () => {
    await request(app.getHttpServer()).put(`/texts/${textId}/reject`);

    expect(400);
  });

  it('/ (Get) fuzzy search', async () => {
    await request(app.getHttpServer()).get(`/texts/search?q=hello`);

    expect(200);
  });

  it('/ (Get) fuzzy search, query not found', async () => {
    const res = await request(app.getHttpServer()).get(`/texts/search?q=xxxxx`);

    expect(0).toEqual(res.body.result.length);
  });

  afterAll(async () => {
    await app.close();
  });
});
