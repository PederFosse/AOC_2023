import type { Task } from '../task';

export class Day4 implements Task {
  solve(input: string): Record<string, unknown> {
    return {
      task1: this.task1(input),
      task2: this.task2(input),
    };
  }

  private task1(input: string) {
    const lines = input.split('\n').filter((val) => val !== '');
    let totalScore = 0;
    lines.forEach((line) => {
      let currentScore: number | undefined;
      const [, numbers] = line.split(': ');
      const [winningNumbers, actualNumbers] = numbers.replaceAll('  ', ' ').split(' | ');
      const winners = winningNumbers.split(' ');

      actualNumbers.split(' ').forEach((num) => {
        if (winners.includes(num)) {
          currentScore ? (currentScore *= 2) : (currentScore = 1);
        }
      });

      totalScore += currentScore || 0;
    });
    return totalScore;
  }

  private task2(input: string) {
    const lines = input.split('\n').filter((val) => val !== '');
    const startingCards: Card[] = [];

    lines.forEach((line) => {
      startingCards.push(new Card(line));
    });

    const counter = new CardCounter(startingCards);
    counter.originalCards.forEach((card) => counter.playCard(card.number));
    return Array.from(counter.cardCount.values()).reduce((prev, cur) => prev + cur, 0);
  }
}

class CardCounter {
  originalCards: Map<number, Card>;
  cardCount = new Map<number, number>();

  constructor(cards: Card[]) {
    this.originalCards = new Map<number, Card>(cards.map((crd) => [crd.number, crd]));
  }

  getCount(game: number) {
    return this.cardCount.get(game) || 0;
  }

  getCard(game: number) {
    return this.originalCards.get(game);
  }

  playCard(game: number) {
    this.cardCount.set(game, this.getCount(game) + 1);

    const card = this.getCard(game);
    if (!card) {
      return; // game should end
    }

    const wins = card.wins;
    if (!wins) {
      return;
    }

    for (let i = 1; i <= wins; i++) {
      const currentCount = this.getCount(game);
      const cardToCopy = this.getCard(i + card.number);
      if (!cardToCopy) {
        return;
      }

      const cardCount = this.getCount(i + card.number);
      this.cardCount.set(i + card.number, cardCount + currentCount);
    }
  }
}

class Card {
  number: number;
  score?: number;
  wins: number = 0;

  winningNumbers: number[] = [];
  actualNumbers: number[] = [];

  constructor(line: string) {
    const [game, numbers] = line.split(': ');
    
    this.number = Number(game.replaceAll(/[a-zA-Z ]/g, ""));

    const [winningNumbers, actualNumbers] = numbers.replaceAll('  ', ' ').split(' | ');
    const winners = winningNumbers.split(' ');

    actualNumbers.split(' ').forEach((num) => {
      if (winners.includes(num)) {
        this.score ? (this.score *= 2) : (this.score = 1);
        this.wins++;
      }
    });
  }
}
