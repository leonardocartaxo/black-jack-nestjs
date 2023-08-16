import { CardType } from '../enums/card-type.enum';
import { CardName } from '../enums/card-name.enum';
import { Card } from '../card';
import { CardValue } from '../enums/card-value.enum';

export class CardsUtil {
  static generate() {
    return Object.keys(CardType).map(type => {
      return Object.keys(CardName).filter((v) => isNaN(Number(v))).map(name => new Card(CardName[name], CardValue[name], CardType[type]))
    }).flat();
  }

  static shuffle(deck: Card[]) {
    let currentIndex = deck.length;
    let randomIndex: number;

    while (currentIndex != 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [deck[currentIndex], deck[randomIndex]] = [
        deck[randomIndex], deck[currentIndex]];
    }

    return deck;
  }
}