import { CardName } from '../enums/card-name.enum';
import { CardType } from '../enums/card-type.enum';
import { CardValue } from '../enums/card-value.enum';

export interface ICard {
    name: CardName;
    type: CardType;
    value: CardValue;
    visible: boolean;
}
