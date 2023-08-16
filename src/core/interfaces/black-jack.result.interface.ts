import { ICard } from './card.interface';
import { GameStatus } from '../enums/game-status.enum';
import { PlayerStatus } from '../enums/player-status.enum';

export interface IGameDeck {
  name: string,
  sum: number,
  status: PlayerStatus;
  cards: ICard[]
}

export interface IPlayerGameDeck {
  sum: number,
  keepPlaying: boolean;
  cards: ICard[],
}

export interface IDealerGameDeck {
  sum: number,
  hiddenCard: ICard;
  cards: ICard[],
}

export interface IBlackJackResult {
  id: string;
  status: GameStatus;
  winners: IGameDeck[];
  dealer: IGameDeck;
  players: IGameDeck[];
}
