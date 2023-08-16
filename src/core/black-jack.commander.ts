import {
  Command,
  CommandRunner,
  Option,
} from 'nest-commander';
import { LogService } from './log.service';
import { BlackJackService } from './black-jack.service';
import { BlackJackResult, GameDeck } from './black-jack.result';

const formatGameDeckForPrint = (gameDeck: GameDeck) => {
  return {
    ...gameDeck,
    cards: gameDeck?.cards?.map(card => `{ name: ${card.name}, type: ${card.type}, value: ${card.value}, visible: ${card.visible} },`)
  };
}

const formatGameDecksForPrint = (gameDeck: GameDeck[]) => {
  return gameDeck?.map(deck => formatGameDeckForPrint(deck));
}

const logGameResult = (logService: LogService, blackJackResult: BlackJackResult) => {
  logService.log({
    ...blackJackResult,
    winners: formatGameDecksForPrint(blackJackResult.winners),
    dealer: formatGameDeckForPrint(blackJackResult.dealer),
    players: formatGameDecksForPrint(blackJackResult.players),
  });
}
const hideCards = (blackJackResult: BlackJackResult) => {
  blackJackResult.dealer.cards = undefined;
  blackJackResult?.winners?.forEach(player => player.cards = undefined);
  blackJackResult?.players?.forEach(player => player.cards = undefined);

  return blackJackResult;
}

interface NewCommandOptions {
  showCards?: boolean;
}

@Command({ name: 'new', arguments: 'playersCount', description: 'Start a new blackjack game with the desired number of players. ' +
    'After running this command the cli will generate a <gameId> and <playerName>, ' +
    'use this info to continue playing on the next commands: <hit>, <stay> and <result>' })
export class BlackJackNewCommander extends CommandRunner {
  constructor(private readonly blackJackService: BlackJackService, private readonly logService: LogService) {
    super()
  }

  async run(
    passedParams: string[],
    options?: NewCommandOptions,
  ): Promise<void> {
    const playerNames: string[] = []
    for (let i=1; i <= Number.parseInt(passedParams[0]); i++) {
      playerNames.push(`p${i}`);
    }
    let blackJackResult = await this.blackJackService.new(playerNames);
    if (options.showCards === false) {
      blackJackResult = hideCards(blackJackResult);
    }

    logGameResult(this.logService, blackJackResult);
  }

  @Option({
    flags: '-n, --playersCount [number]',
    description: 'desired number of players to play',
  })
  parseNumber(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '--show-cards [boolean]',
    description: 'Show the current state of the game could be bloated due to the number of cards in the table, use this flag to hide the cards from the players and see only the sum of the cards.',
  })
  showCards(val: string): boolean {
    return JSON.parse(val);
  }
}

interface ResultCommandOptions {
  showCards?: boolean;
}

@Command({ name: 'result', arguments: '<gameId>' })
export class BlackJackResultCommander extends CommandRunner {
  constructor(private readonly blackJackService: BlackJackService, private readonly logService: LogService) {
    super()
  }
  async run(passedParams: string[], options?: ResultCommandOptions): Promise<void> {
    let blackJackResult = await this.blackJackService.get(passedParams[0]);
    blackJackResult = Object.assign({}, blackJackResult);
    if (options.showCards === false) {
      blackJackResult = hideCards(blackJackResult);
    }

    logGameResult(this.logService, blackJackResult);
  }

  @Option({
    flags: '--show-cards [boolean]',
    description: 'Show the current state of the game could be bloated due to the number of cards in the table, use this flag to hide the cards from the players and see only the sum of the cards.',
  })
  showCards(val: string): boolean {
    return JSON.parse(val);
  }
}

@Command({ name: 'hit', arguments: 'gameId, playerName' })
export class BlackJackPlayerHitCommander extends CommandRunner {
  constructor(private readonly blackJackService: BlackJackService, private readonly logService: LogService) {
    super()
  }
  async run(passedParams: string[], options?: ResultCommandOptions): Promise<void> {
    let blackJackResult = await this.blackJackService.playerHit(passedParams[0], passedParams[1]);
    blackJackResult = Object.assign({}, blackJackResult);
    if (options.showCards === false) {
      blackJackResult = hideCards(blackJackResult);
    }

    logGameResult(this.logService, blackJackResult);
  }

  @Option({
    flags: '--show-cards [boolean]',
    description: 'Show the current state of the game could be bloated due to the number of cards in the table, use this flag to hide the cards from the players and see only the sum of the cards.',
  })
  showCards(val: string): boolean {
    return JSON.parse(val);
  }
}

@Command({ name: 'stay', arguments: 'gameId, playerName' })
export class BlackJackPlayerStayCommander extends CommandRunner {
  constructor(private readonly blackJackService: BlackJackService, private readonly logService: LogService) {
    super()
  }

  async run(passedParams: string[], options?: ResultCommandOptions): Promise<void> {
    let blackJackResult = await this.blackJackService.playerStay(passedParams[0], passedParams[1]);
    blackJackResult = Object.assign({}, blackJackResult);
    if (options.showCards === false) {
      blackJackResult = hideCards(blackJackResult);
    }

    logGameResult(this.logService, blackJackResult);
  }

  @Option({
    flags: '--show-cards [boolean]',
    description: 'Show the current state of the game could be bloated due to the number of cards in the table, use this flag to hide the cards from the players and see only the sum of the cards.',
  })
  showCards(val: string): boolean {
    return JSON.parse(val);
  }
}
