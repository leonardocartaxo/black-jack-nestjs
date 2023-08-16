import { Injectable } from '@nestjs/common';
import { BlackJackRepository } from './black-jack.repository';
import { CardsUtil } from './util/cards.util';
import { BlackJackResult, GameDeck } from './black-jack.result';
import { BlackJackTable } from './black-jack-table';

@Injectable()
export class BlackJackService {
  constructor(private readonly blackJackRepository: BlackJackRepository) {}

  async new(playerNames: string[]): Promise<BlackJackResult> {
    const allCards = CardsUtil.shuffle(CardsUtil.generate());
    const dealerDeck = new GameDeck('Dealer');
    const playerDecks = playerNames.map(playerName => new GameDeck(playerName));
    const blackJackTable = new BlackJackTable(allCards, dealerDeck, playerDecks);

    await this.blackJackRepository.save(blackJackTable.blackJackEntity);

    return await this.get(blackJackTable.blackJackEntity.id);
  }

  async get(id: string): Promise<BlackJackResult> {
    const blackJackEntity = await this.blackJackRepository.get(id);

    return {
      id: blackJackEntity.id,
      status: blackJackEntity.status,
      winners: blackJackEntity.winners,
      dealer: {...blackJackEntity.dealerDeck, sum: undefined, cards: blackJackEntity.dealerDeck?.cards?.filter(card => card.visible)},
      players: blackJackEntity.playerDecks,
    }
  }

  async playerHit(id: string, playerName: string): Promise<BlackJackResult> {
    let blackJackEntity = await this.blackJackRepository.get(id);
    const blackJackTable = new BlackJackTable(blackJackEntity);
    blackJackTable.playerHit(playerName);
    blackJackEntity = await this.blackJackRepository.update(id, blackJackEntity);

    return await this.get(blackJackEntity.id);
  }

  async playerStay(id: string, playerName: string): Promise<BlackJackResult> {
    let blackJackEntity = await this.blackJackRepository.get(id);
    const blackJackTable = new BlackJackTable(blackJackEntity);
    blackJackTable.playerStay(playerName);
    blackJackEntity = await this.blackJackRepository.update(id, blackJackEntity);

    return await this.get(blackJackEntity.id);
  }
}
