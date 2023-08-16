# Blackjack-nestjs

## Description
A nestjs app cli to play blackjack (WIP pre alpha)

## Installation

```bash
$ yarn install
$ yarn build
```

## Running the app

```bash
$ node dist/main.js
```

## Test

## Usage
```
Usage: main [options] [command]

Options:
  -h, --help                             display help for command

Commands:
  new [options] <playersCount>           Start a new blackjack game with the desired number of players. After running this command the cli will generate a <gameId> and <playerName>, use this info to continue playing on the next
                                         commands: <hit>, <stay> and <result>
  result [options] <gameId>
  hit [options] <gameId,> <playerName>
  stay [options] <gameId,> <playerName>
  help [command]                         display help for command
```

## Test

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
