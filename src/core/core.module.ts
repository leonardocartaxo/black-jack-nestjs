import { Module } from '@nestjs/common';
import { BlackJackService } from './black-jack.service';
import { BlackJackRepository } from './black-jack.repository';
import {
  BlackJackNewCommander,
  BlackJackPlayerHitCommander,
  BlackJackPlayerStayCommander,
  BlackJackResultCommander
} from './black-jack.commander';
import { LogService } from './log.service';

@Module({
  providers: [
    LogService,
    BlackJackService,
    BlackJackRepository,
    BlackJackNewCommander,
    BlackJackResultCommander,
    BlackJackPlayerHitCommander,
    BlackJackPlayerStayCommander,
  ]
})
export class CoreModule {}
