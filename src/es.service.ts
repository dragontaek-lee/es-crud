import { Injectable } from '@nestjs/common';
import * as dayjs from "dayjs";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { esDataDummy } from "./es-data-dummy";

@Injectable()
export class EsService {
  constructor(
      private readonly elasticsearchService: ElasticsearchService,
  ) {
  }

  async createIndex(indexName: string) {
    const isExists = await this.elasticsearchService.indices.exists({ index: indexName });

    if (!isExists) {
      await this.elasticsearchService.indices.create({
        index: indexName,
        mappings: {
          properties: {
            userId: { type: 'keyword' },
            date: { type: 'date' },
            logType: { type: 'text' },
            lessonIndex: { type: 'text' },
            lectureIndex: { type: 'text' },
            businessType: { type: 'text' },
            ip: { type: 'text' },
            uri: { type: 'text' },
          }
        }
      });
    }
  }

  async findDocuments(
      userId: string,
      businessType: string,
  ) {
    const now = dayjs().format('YYYY-MM-DD');
    const indexName = `edu-train-log-${now}`

    return await this.elasticsearchService.search({
      index: indexName,
    })
  }

  async createDocuments() {
    const now = dayjs().format('YYYY-MM-DD');
    const indexName = `edu-train-log-${now}`

    await this.createIndex(indexName);

    await Promise.all([
      esDataDummy.map(async (v)=> {
        await this.elasticsearchService.index({
          index: indexName,
          document: {
            ...v,
            id: v.m_id,
            date: dayjs(v.date).format('YYYY-MM-DDTHH:mm:ss')
          }
        })
      })
    ]);
  }

  async bulkInsert() {
    const now = dayjs().format('YYYY-MM-DD');
    const indexName = `edu-train-log-${now}`

    // await this.createIndex(indexName);

    const convertedData = esDataDummy.map((v) => {
      return {
          id: v.m_id,
        ...v,
      }
    });

    const bulkResponse = await this.elasticsearchService.helpers.bulk({
      datasource: convertedData,
      onDocument (doc) {
        return {
          index: { _index: indexName, _id: doc.id }
        }
      }
    });

    console.log(bulkResponse);

    return { bulkResponse };
  };
}
