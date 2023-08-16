import { GameDeck } from '../black-jack.result';
import { CardType } from '../enums/card-type.enum';
import { CardName } from '../enums/card-name.enum';
import { GameStatus } from '../enums/game-status.enum';
import { PlayerStatus } from '../enums/player-status.enum';
import { BlackJackTable } from '../black-jack-table';
import { CardsUtil } from '../util/cards.util';

describe('BlackJackTable', () => {
  it('Check first round', () => {
    const p1Name = 'Ana';
    const p2Name = 'Bob';
    const bj = new BlackJackTable(CardsUtil.shuffle(allCards),  new GameDeck('dealer'), [new GameDeck(p1Name), new GameDeck(p2Name)]);
    let gameResult = bj.getResult();

    expect(gameResult.status).toEqual(GameStatus.IN_PROGRESS);
    expect(gameResult.dealer.status).toEqual(PlayerStatus.PLAYING);
    expect(gameResult.players[0].status).toEqual(PlayerStatus.PLAYING);
    expect(gameResult.players[1].status).toEqual(PlayerStatus.PLAYING);
    expect(gameResult.players[0].cards.length).toEqual(2);
    expect(gameResult.players[1].cards.length).toEqual(2);
    // should not show the hidden card
    expect(gameResult.dealer.cards.length).toEqual(1);
    // should not sum dealer cards the cards
    expect(gameResult.dealer.sum).toEqual(undefined);
  });

  it('Player one wins and player two burts', () => {
    const p1Name = 'Ana';
    const p2Name = 'Bob';
    const cards = [
      { name: CardName.SIX, type: CardType.CLUBS, value: 6, visible: true },
      { name: CardName.TWO, type: CardType.DIAMONDS, value: 2, visible: true },
      { name: CardName.NINE, type: CardType.HEARTS, value: 9, visible: true },
      { name: CardName.FOUR, type: CardType.HEARTS, value: 4, visible: true },
      { name: CardName.FOUR, type: CardType.CLUBS, value: 4, visible: true },
      { name: CardName.THREE, type: CardType.CLUBS, value: 3, visible: true },
      { name: CardName.FIVE, type: CardType.CLUBS, value: 5, visible: true },
      { name: CardName.FOUR, type: CardType.DIAMONDS, value: 4, visible: true },
      { name: CardName.THREE, type: CardType.DIAMONDS, value: 3, visible: true },
      { name: CardName.THREE, type: CardType.SPADES, value: 3, visible: true },
      { name: CardName.TWO, type: CardType.HEARTS, value: 2, visible: true },
      { name: CardName.FOUR, type: CardType.SPADES, value: 4, visible: true },
    ];
    const bj = new BlackJackTable(cards,  new GameDeck('dealer'), [new GameDeck(p1Name), new GameDeck(p2Name)]);
    let gameResult = bj.getResult();

    bj.playerHit(p1Name);
    bj.playerHit(p2Name);
    bj.playerHit(p1Name);
    bj.playerHit(p2Name);
    bj.playerHit(p1Name);
    bj.playerHit(p1Name);

    expect(bj.getResult().status).toEqual(GameStatus.FINISHED);
    expect(bj.getResult().players[0].status).toEqual(PlayerStatus.WINNER);
    expect(bj.getResult().players[1].status).toEqual(PlayerStatus.BURST);
    expect(bj.getResult().dealer.status).toEqual(PlayerStatus.LOOSER);
    expect(bj.getResult().winners).toEqual([gameResult.players[0]]);
  });

  it('Dealer wins by sum and player 2 burts', () => {
    const p1Name = 'Ana';
    const p2Name = 'Bob';
    const cards = [
      { name: CardName.EIGHT, type: CardType.DIAMONDS, value: 8, visible: true },
      { name: CardName.SIX, type: CardType.CLUBS, value: 6, visible: true },
      { name: CardName.TWO, type: CardType.DIAMONDS, value: 2, visible: true },
      { name: CardName.NINE, type: CardType.HEARTS, value: 9, visible: true },
      { name: CardName.FOUR, type: CardType.HEARTS, value: 4, visible: true },
      { name: CardName.FOUR, type: CardType.CLUBS, value: 4, visible: true },
      { name: CardName.THREE, type: CardType.CLUBS, value: 3, visible: true },
      { name: CardName.FIVE, type: CardType.CLUBS, value: 5, visible: true },
      { name: CardName.FOUR, type: CardType.DIAMONDS, value: 4, visible: true },
      { name: CardName.THREE, type: CardType.DIAMONDS, value: 3, visible: true },
      { name: CardName.THREE, type: CardType.SPADES, value: 3, visible: true },
      { name: CardName.TWO, type: CardType.HEARTS, value: 2, visible: true },
      { name: CardName.FOUR, type: CardType.SPADES, value: 4, visible: true },
    ];
    const bj = new BlackJackTable(cards,  new GameDeck('dealer'), [new GameDeck(p1Name), new GameDeck(p2Name)]);

    bj.playerHit(p1Name);
    bj.playerHit(p2Name);
    bj.playerHit(p1Name);
    bj.playerHit(p2Name);
    bj.playerHit(p1Name);
    bj.playerStay(p1Name);

    expect(bj.getResult().status).toEqual(GameStatus.FINISHED);
    expect(bj.getResult().players[0].status).toEqual(PlayerStatus.STOPPED);
    expect(bj.getResult().players[1].status).toEqual(PlayerStatus.BURST);
    expect(bj.getResult().dealer.status).toEqual(PlayerStatus.WINNER);
  });

  it('Dealer wins by sum', () => {
    const p1Name = 'Ana';
    const p2Name = 'Bob';
    const cards = [
      { name: CardName.TWO, type: CardType.DIAMONDS, value: 2, visible: true },
      { name: CardName.NINE, type: CardType.HEARTS, value: 9, visible: true },
      { name: CardName.FOUR, type: CardType.HEARTS, value: 4, visible: true },
      { name: CardName.FOUR, type: CardType.CLUBS, value: 4, visible: true },
      { name: CardName.THREE, type: CardType.CLUBS, value: 3, visible: true },
      { name: CardName.FIVE, type: CardType.CLUBS, value: 5, visible: true },
      { name: CardName.FOUR, type: CardType.DIAMONDS, value: 4, visible: true },
      { name: CardName.THREE, type: CardType.DIAMONDS, value: 3, visible: true },
      { name: CardName.THREE, type: CardType.SPADES, value: 3, visible: true },
      { name: CardName.TWO, type: CardType.HEARTS, value: 2, visible: true },
      { name: CardName.FOUR, type: CardType.SPADES, value: 4, visible: true },
    ];
    const bj = new BlackJackTable(cards,  new GameDeck('dealer'), [new GameDeck(p1Name), new GameDeck(p2Name)]);

    bj.playerHit(p1Name);
    bj.playerHit(p2Name);
    bj.playerHit(p1Name);
    bj.playerStay(p2Name);
    bj.playerStay(p1Name);

    expect(bj.getResult().status).toEqual(GameStatus.FINISHED);
    expect(bj.getResult().players[0].status).toEqual(PlayerStatus.STOPPED);
    expect(bj.getResult().players[1].status).toEqual(PlayerStatus.STOPPED);
    expect(bj.getResult().dealer.status).toEqual(PlayerStatus.WINNER);
  });

  it('Player 2 wins', () => {
    const cards = [
      { name: CardName.FOUR, type: CardType.HEARTS, value: 4, visible: true },
      { name: CardName.SEVEN, type: CardType.CLUBS, value: 7, visible: true },
      { name: CardName.FOUR, type: CardType.HEARTS, value: 4, visible: true },
      { name: CardName.TEN, type: CardType.HEARTS, value: 10, visible: true },
      { name: CardName.FIVE, type: CardType.HEARTS, value: 5, visible: true },
      { name: CardName.TWO, type: CardType.CLUBS, value: 2, visible: true },
      { name: CardName.SEVEN, type: CardType.HEARTS, value: 7, visible: true },
      { name: CardName.TWO, type: CardType.DIAMONDS, value: 2, visible: true },
      { name: CardName.SIX, type: CardType.CLUBS, value: 6, visible: true },
      { name: CardName.TWO, type: CardType.HEARTS, value: 2, visible: true },
      { name: CardName.FOUR, type: CardType.SPADES, value: 4, visible: true },
    ];
    const p1Name = 'Ana';
    const p2Name = 'Bob';
    const bj = new BlackJackTable(cards,  new GameDeck('Dealer'), [new GameDeck(p1Name), new GameDeck(p2Name)]);
    let gameResult = bj.getResult();

    expect(gameResult.status).toEqual(GameStatus.IN_PROGRESS);
    expect(gameResult.dealer.status).toEqual(PlayerStatus.PLAYING);
    expect(gameResult.players[0].status).toEqual(PlayerStatus.PLAYING);
    expect(gameResult.players[1].status).toEqual(PlayerStatus.PLAYING);
    expect(gameResult.players[0].cards.length).toEqual(2);
    expect(gameResult.players[1].cards.length).toEqual(2);
    // should not show the hidden card
    expect(gameResult.dealer.cards.length).toEqual(1);
    // should not sum the cards
    expect(gameResult.dealer.sum).toEqual(undefined);

    bj.playerHit(p1Name);
    bj.playerHit(p2Name);
    bj.playerHit(p1Name);
    bj.playerStay(p2Name);
    bj.playerStay(p1Name);

    expect(bj.getResult().status).toEqual(GameStatus.FINISHED);
    expect(bj.getResult().players[0].status).toEqual(PlayerStatus.STOPPED);
    expect(bj.getResult().players[1].status).toEqual(PlayerStatus.WINNER);
    expect(bj.getResult().dealer.status).toEqual(PlayerStatus.STOPPED);
  });

  const allCards = [
    { name: CardName.SIX, type: CardType.DIAMONDS, value: 6, visible: true },
    { name: CardName.Q,type: CardType.CLUBS,value: 10, visible: true },
    { name: CardName.TEN, type: CardType.SPADES, value: 10, visible: true },
    { name: CardName.EIGHT, type: CardType.SPADES, value: 8, visible: true },
    { name: CardName.THREE, type: CardType.HEARTS, value: 3, visible: true },
    { name: CardName.SIX,type: CardType.SPADES,value: 6, visible: true },
    { name: CardName.NINE, type: CardType.SPADES, value: 9, visible: true },
    { name: CardName.J, type: CardType.CLUBS, value: 10, visible: true },
    { name: CardName.SEVEN, type: CardType.CLUBS, value: 7, visible: true },
    { name: CardName.A, type: CardType.CLUBS, value: 11, visible: true },
    { name: CardName.Q, type: CardType.HEARTS, value: 10, visible: true },
    { name: CardName.K, type: CardType.DIAMONDS, value: 10, visible: true },
    { name: CardName.EIGHT, type: CardType.HEARTS, value: 8, visible: true },
    { name: CardName.NINE, type: CardType.CLUBS, value: 9, visible: true },
    { name: CardName.TWO, type: CardType.CLUBS, value: 2, visible: true },
    { name: CardName.SEVEN, type: CardType.DIAMONDS, value: 7, visible: true },
    { name: CardName.Q, type: CardType.DIAMONDS, value: 10, visible: true },
    { name: CardName.TWO, type: CardType.SPADES, value: 2, visible: true },
    { name: CardName.A, type: CardType.HEARTS, value: 11, visible: true },
    { name: CardName.TEN, type: CardType.DIAMONDS, value: 10, visible: true },
    { name: CardName.J, type: CardType.SPADES, value: 10, visible: true },
    { name: CardName.J, type: CardType.DIAMONDS, value: 10, visible: true },
    { name: CardName.A, type: CardType.DIAMONDS, value: 11, visible: true },
    { name: CardName.Q, type: CardType.SPADES, value: 10, visible: true },
    { name: CardName.SEVEN, type: CardType.SPADES, value: 7, visible: true },
    { name: CardName.K, type: CardType.SPADES, value: 10, visible: true },
    { name: CardName.TEN, type: CardType.CLUBS, value: 10, visible: true },
    { name: CardName.NINE, type: CardType.DIAMONDS, value: 9, visible: true },
    { name: CardName.SEVEN, type: CardType.HEARTS, value: 7, visible: true },
    { name: CardName.TEN, type: CardType.HEARTS, value: 10, visible: true },
    { name: CardName.A, type: CardType.SPADES, value: 11, visible: true },
    { name: CardName.FIVE, type: CardType.HEARTS, value: 5, visible: true },
    { name: CardName.K, type: CardType.CLUBS, value: 10, visible: true },
    { name: CardName.J, type: CardType.HEARTS, value: 10, visible: true },
    { name: CardName.FIVE, type: CardType.DIAMONDS, value: 5, visible: true },
    { name: CardName.SIX, type: CardType.HEARTS, value: 6, visible: true },
    { name: CardName.FIVE, type: CardType.SPADES, value: 5, visible: true },
    { name: CardName.K, type: CardType.HEARTS, value: 10, visible: true },
    { name: CardName.EIGHT, type: CardType.CLUBS, value: 8, visible: true },
    { name: CardName.EIGHT, type: CardType.DIAMONDS, value: 8, visible: true },
    { name: CardName.SIX, type: CardType.CLUBS, value: 6, visible: true },
    { name: CardName.TWO, type: CardType.DIAMONDS, value: 2, visible: true },
    { name: CardName.NINE, type: CardType.HEARTS, value: 9, visible: true },
    { name: CardName.FOUR, type: CardType.HEARTS, value: 4, visible: true },
    { name: CardName.FOUR, type: CardType.CLUBS, value: 4, visible: true },
    { name: CardName.THREE, type: CardType.CLUBS, value: 3, visible: true },
    { name: CardName.FIVE, type: CardType.CLUBS, value: 5, visible: true },
    { name: CardName.FOUR, type: CardType.DIAMONDS, value: 4, visible: true },
    { name: CardName.THREE, type: CardType.DIAMONDS, value: 3, visible: true },
    { name: CardName.THREE, type: CardType.SPADES, value: 3, visible: true },
    { name: CardName.TWO, type: CardType.HEARTS, value: 2, visible: true },
    { name: CardName.FOUR, type: CardType.SPADES, value: 4, visible: true }
  ];
});
