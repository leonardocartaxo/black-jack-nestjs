import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { BlackJackEntity } from './black-jack.entity';

@Injectable()
export class BlackJackRepository {
  private static readonly DB_FILE_NAME = 'black-jack-db.json'
  private static readonly DB_FILE_PATH = `${path.join(__dirname, BlackJackRepository.DB_FILE_NAME)}`
  private games: { [id: string]: BlackJackEntity } = {};
  private lastId: number = 0;

  constructor() {
    // this.loadDBFile();
  }

  private async loadDBFile() {
    try {
      await fs.promises.access(BlackJackRepository.DB_FILE_PATH);
    } catch (e) {
      await fs.promises.writeFile(BlackJackRepository.DB_FILE_PATH, JSON.stringify(this.games, null, 2));
    }
    const buffer = await fs.promises.readFile(BlackJackRepository.DB_FILE_PATH);
    this.games = JSON.parse(buffer.toString());
    const keys = Object.keys(this.games);
    this.lastId = keys?.length ? Math.max(...keys?.map(key => Number.parseInt(key))) : 0
  }

  private async writeDBFile() {
    await fs.promises.writeFile(BlackJackRepository.DB_FILE_PATH, JSON.stringify(this.games, null, 2));
  }

  async save(blackJackEntity: BlackJackEntity): Promise<BlackJackEntity> {
    await this.loadDBFile();
    this.lastId++;
    blackJackEntity.id = this.lastId.toString();
    this.games[blackJackEntity.id] = blackJackEntity;
    await this.writeDBFile();

    return await this.get(blackJackEntity.id);
  }

  async update(id: string, blackJackEntity: BlackJackEntity): Promise<BlackJackEntity> {
    await this.loadDBFile();
    this.games[id] = blackJackEntity;
    await this.writeDBFile();

    return await this.get(blackJackEntity.id);
  }

  async get(id: string): Promise<BlackJackEntity>{
    await this.loadDBFile();

    return this.games[id];
  }
}
