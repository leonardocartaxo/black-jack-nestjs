import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
  Question,
  QuestionSet,
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

@QuestionSet({ name: 'root' })
export class RootQuestions {
  @Question({
    message: 'Enter your command. type "help" for help',
    name: 'root'
  })
  parseTask(val: string) {
    return val;
  }
}

@Command({
  name: 'my-exec',
  arguments: '[task]',
  options: { isDefault: true }
})
export class BlackJackDefaultCommander extends CommandRunner {
  constructor(
    private readonly blackJackService: BlackJackService,
    private readonly logService: LogService,
    private readonly inquirer: InquirerService
  ) {
    super()
  }

  async run(inputs: string[], options: Record<string, string>): Promise<void> {
    let task = inputs[0];
    if (!task) {
      const inquirer = this.inquirer.inquirer;
      const helpCommand = 'help';
      const helpDescription = 'new-game ';
      const rootQuestions = [{ name: 'root', message: 'Enter your command. type "help" for help' }];
      const answers = await inquirer.prompt(rootQuestions);
      if (Object.values(answers).includes(helpCommand)) {
        console.log(answers);
      } else {

      }
      console.log(answers);
    }
  }
  @Option({
    flags: '-s, --shell <shell>',
    description: 'A different shell to spawn than the default'
  })
  parseShell(val: string) {
    return val;
  }
}

@Command({ name: 'new', arguments: 'playersCount' })
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
    description: 'A basic number parser',
  })
  parseNumber(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '--show-cards [boolean]',
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
  })
  showCards(val: string): boolean {
    return JSON.parse(val);
  }
}
