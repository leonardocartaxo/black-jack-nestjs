import { Card } from './card';
import { GameDeck } from './black-jack.result';
import { GameStatus } from './enums/game-status.enum';

export class BlackJackEntity {
  public id: string;
  constructor(
    public remainingCards: Card[],
    public dealerDeck: GameDeck,
    public playerDecks: GameDeck[],
    public status: GameStatus = GameStatus.IN_PROGRESS,
    public winners: GameDeck[] = []) {}
}
