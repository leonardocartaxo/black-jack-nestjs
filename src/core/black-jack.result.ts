import {
  IBlackJackResult,
  IDealerGameDeck,
  IGameDeck,
  IPlayerGameDeck
} from './interfaces/black-jack.result.interface';
import { ICard } from './interfaces/card.interface';
import { GameStatus } from './enums/game-status.enum';
import { PlayerStatus } from './enums/player-status.enum';
import { Card } from './card';

export class BlackJackResult implements IBlackJackResult{
  id: string;
  status: GameStatus;
  winners: GameDeck[];
  dealer: GameDeck;
  players: GameDeck[];
}

export class GameDeck implements IGameDeck {
  name: string;
  status: PlayerStatus = PlayerStatus.PLAYING;
  sum: number = 0;
  cards: Card[] = [];

  constructor(name: string) {
    this.name = name;
  }
}

export class PlayerGameDeck implements IPlayerGameDeck {
  sum: number = 0;
  keepPlaying: boolean = true;
  cards: ICard[] = [];
}

export class DealerGameDeck implements IDealerGameDeck {
  sum: number = 0;
  cards: ICard[] = [];
  hiddenCard: ICard;
}
