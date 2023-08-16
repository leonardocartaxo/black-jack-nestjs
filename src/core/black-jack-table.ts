import { Card } from './card';
import { BlackJackResult, GameDeck } from './black-jack.result';
import { GameStatus } from './enums/game-status.enum';
import { PlayerStatus } from './enums/player-status.enum';
import { CardValue } from './enums/card-value.enum';
import { BlackJackEntity } from './black-jack.entity';

export class BlackJackTable {
  public blackJackEntity: BlackJackEntity;

  constructor(blackJackEntity: BlackJackEntity);
  constructor(remainingCards: Card[], dealerDeck: GameDeck, playerDecks: GameDeck[]);
  public constructor(...args: any[]) {
    if (args.length < 1 || args.length === 2 || args.length > 3) {
      throw new Error('Invalid Constructor');
    } else if (args.length === 1) {
      this.blackJackEntity = args[0];
    } else if (args.length === 3) {
      this.blackJackEntity = new BlackJackEntity(args[0], args[1], args[2]);
      const hiddenCard = this.blackJackEntity.remainingCards.pop();
      hiddenCard.visible = false;
      this.blackJackEntity.dealerDeck.cards.push(hiddenCard);
      this.blackJackEntity.dealerDeck.cards.push(this.blackJackEntity.remainingCards.pop());
      this.blackJackEntity.dealerDeck.sum = BlackJackTable.sumCards(this.blackJackEntity.dealerDeck.cards);

      this.blackJackEntity.playerDecks?.forEach(player => {
        for(let i = 0; i < 2; i++) {
          player.cards.push(this.blackJackEntity.remainingCards.pop());
        }
        player.sum = BlackJackTable.sumCards(player.cards);
      })
    }
    this.check();
  }

  private static sumCards(deck: Card[]) {
    let cardsSum = deck?.reduce((acc, card) => acc + card?.value, 0);
    let aceCount = deck?.filter(card => card.value === CardValue.A)?.length ?? 0;

    while(cardsSum > 21 && aceCount > 0) {
      cardsSum -= 10;
      aceCount--;
    }

    return cardsSum;
  }

  private hit() {
    return this.blackJackEntity.remainingCards.pop();
  }

  private check() {
    this.blackJackEntity.playerDecks?.forEach(playerDeck => {
      if (playerDeck.sum === 21) {
        playerDeck.status = PlayerStatus.WINNER;
        this.blackJackEntity.status = GameStatus.FINISHED;
        this.blackJackEntity.winners.push(playerDeck);
        this.blackJackEntity.dealerDeck.status = PlayerStatus.LOOSER;
        this.blackJackEntity.playerDecks
          ?.filter(player => player.status === PlayerStatus.PLAYING)
          ?.forEach(player => {
            player.status = PlayerStatus.LOOSER
          });
      } else if (playerDeck.sum > 21) {
        playerDeck.status = PlayerStatus.BURST;
      }
    });

    if (
      this.blackJackEntity.status === GameStatus.IN_PROGRESS &&
      this.blackJackEntity.playerDecks.every(player => player.status !== PlayerStatus.PLAYING)
    ) {
      this.blackJackEntity.status = GameStatus.FINISHED;
      this.blackJackEntity.dealerDeck.status = PlayerStatus.STOPPED;

      while(this.blackJackEntity.dealerDeck.sum < 17) {
        this.blackJackEntity.dealerDeck.cards.push(this.hit());
        this.blackJackEntity.dealerDeck.sum = BlackJackTable.sumCards(this.blackJackEntity.dealerDeck.cards);
      }

      if (this.blackJackEntity.dealerDeck.sum > 21) {
        this.blackJackEntity.dealerDeck.status = PlayerStatus.BURST;
      }

      const allGames = this.blackJackEntity.playerDecks?.filter(player => player.status !== PlayerStatus.BURST);
      if(this.blackJackEntity.dealerDeck.status !== PlayerStatus.BURST) {
        allGames.push(this.blackJackEntity.dealerDeck)
      }

      const maxSum = Math.max(
        ...allGames
          ?.filter(player => player.sum <= 21)
          ?.map(player => player.sum)
      );
      this.blackJackEntity.winners = allGames.filter(game => game.sum === maxSum);
      this.blackJackEntity.winners.forEach(winner => {
        winner.status = PlayerStatus.WINNER
      });
    }
  }

  playerHit(playerName: string): BlackJackResult {
    const playerDeck = this.blackJackEntity.playerDecks.find(player => player.name === playerName);
    if (playerDeck.status === PlayerStatus.PLAYING) {
      playerDeck.cards.push(this.hit());
      playerDeck.sum = BlackJackTable.sumCards(playerDeck.cards);
      this.check();
    }

    return this.getResult();
  }

  playerStay(playerName: string): BlackJackResult {
    const playerDeck = this.blackJackEntity.playerDecks.find(player => player.name === playerName);
    playerDeck.status = PlayerStatus.STOPPED;

    this.check();

    return this.getResult();
  }

  getResult(): BlackJackResult{
    return {
      id: this.blackJackEntity.id,
      winners: this.blackJackEntity.winners,
      status: this.blackJackEntity.status,
      dealer: {
        ...this.blackJackEntity.dealerDeck,
        sum: this.blackJackEntity.status === GameStatus.FINISHED ? this.blackJackEntity.dealerDeck.sum : undefined,
        cards: this.blackJackEntity.status === GameStatus.FINISHED
          ? this.blackJackEntity.dealerDeck.cards
          : this.blackJackEntity.dealerDeck?.cards?.filter(card => card.visible)},
      players: this.blackJackEntity.playerDecks,
    }
  }
}
