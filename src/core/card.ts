import { ICard } from './interfaces/card.interface';
import { CardName } from './enums/card-name.enum';
import { CardType } from './enums/card-type.enum';
import { CardValue } from './enums/card-value.enum';

export class Card implements ICard {
    name: CardName;
    type: CardType;
    value: CardValue;
    visible: boolean;
    constructor(name: CardName, value: CardValue, type: CardType, visible = true) {
        this.name = name;
        this.type = type;
        this.value = value;
        this.visible = visible;
    }
}
