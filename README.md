# Blackjack-nestjs

## Description
A nestjs app CLI to play blackjack (WIP pre alpha)

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
