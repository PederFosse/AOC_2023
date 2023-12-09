import type { Task } from '../task';

export class Day7 implements Task {
  solve(input: string): Record<string, unknown> {
    return {
      task1: this.task1(input),
      task2: this.task2(input),
    };
  }

  private task1(input: string) {
    const ranker = new Ranker();
    input
      .trim()
      .split('\n')
      .forEach((hand) => {
        ranker.addHand(new HandTask1(hand));
      });

    const ranked = ranker.getRankedCards();

    let sum = 0;
    ranked.forEach((hand, index) => {
      const rank = index + 1;
      sum += hand.bid * rank;
    });

    return sum;
  }

  private task2(input: string) {
    const ranker = new Ranker();
    input
      .trim()
      .split('\n')
      .forEach((hand) => {
        ranker.addHand(new HandTask2(hand));
      });

    const ranked = ranker.getRankedCards();

    let sum = 0;
    ranked.forEach((hand, index) => {
      const rank = index + 1;
      sum += hand.bid * rank;
    });

    return sum;
  }
}

class Ranker {
  hands: HandTask1[] = [];

  addHand(hand: HandTask1) {
    this.hands.push(hand);
  }

  getRankedCards() {
    return this.hands.sort((a, b) => {
      return a.compareTo(b);
    });
  }
}

interface Hand {
  cards: string;
  bid: number;
  type: { type: string; score: number };
  compareTo(hand: Hand): number;
}

class HandTask1 implements Hand {
  cards: string;
  bid: number;
  type: { type: string; score: number };

  constructor(input: string) {
    const [cards, bid] = input.split(' ');
    this.bid = Number(bid);
    this.cards = cards;

    const cardMap = new Map<string, number>();
    for (let i = 0; i < cards.length; i++) {
      cardMap.set(cards[i], (cardMap.get(cards[i]) || 0) + 1);
    }

    const values = Array.from(cardMap.values())
      .filter((val) => val !== 1)
      .sort((a, b) => b - a);
    switch (values.toString()) {
      case [5].toString():
        this.type = { type: 'Five of a kind', score: 7 };
        break;
      case [4].toString():
        this.type = { type: 'Four of a kind', score: 6 };
        break;
      case [3, 2].toString():
        this.type = { type: 'Full house', score: 5 };
        break;
      case [3].toString():
        this.type = { type: 'Three of a kind', score: 4 };
        break;
      case [2, 2].toString():
        this.type = { type: 'Two pair', score: 3 };
        break;
      case [2].toString():
        this.type = { type: 'One pair', score: 2 };
        break;
      default:
        this.type = { type: 'High card', score: 1 };
        break;
    }
  }

  compareTo(hand: HandTask1): number {
    if (this.type.score === hand.type.score) {
      let i = 0;
      while (this.cards[i] === hand.cards[i]) {
        i++;
      }
      return getCharScoreTask1(this.cards[i]) - getCharScoreTask1(hand.cards[i]);
    }
    return this.type.score - hand.type.score;
  }
}
class HandTask2 implements Hand {
  cards: string;
  bid: number;
  type: { type: string; score: number };

  constructor(input: string) {
    const [cards, bid] = input.split(' ');
    this.bid = Number(bid);
    this.cards = cards;

    const cardMap = new Map<string, number>();
    for (let i = 0; i < cards.length; i++) {
      cardMap.set(cards[i], (cardMap.get(cards[i]) || 0) + 1);
    }

    const jokers = cardMap.get('J');
    cardMap.delete('J');

    const values = Array.from(cardMap.values()).sort((a, b) => b - a);

    if (jokers === 5) {
      // this little fucker
      values.push(0);
    }

    values[0] += jokers || 0;

    switch (values.filter((v) => v !== 1).toString()) {
      case [5].toString():
        this.type = { type: 'Five of a kind', score: 7 };
        break;
      case [4].toString():
        this.type = { type: 'Four of a kind', score: 6 };
        break;
      case [3, 2].toString():
        this.type = { type: 'Full house', score: 5 };
        break;
      case [3].toString():
        this.type = { type: 'Three of a kind', score: 4 };
        break;
      case [2, 2].toString():
        this.type = { type: 'Two pair', score: 3 };
        break;
      case [2].toString():
        this.type = { type: 'One pair', score: 2 };
        break;
      default:
        this.type = { type: 'High card', score: 1 };
        break;
    }
  }

  compareTo(hand: HandTask1): number {
    if (this.type.score === hand.type.score) {
      let i = 0;
      while (this.cards[i] === hand.cards[i]) {
        i++;
      }
      return getCharScoreTask2(this.cards[i]) - getCharScoreTask2(hand.cards[i]);
    }
    return this.type.score - hand.type.score;
  }
}

function getCharScoreTask1(character: string): number {
  switch (character) {
    case 'A':
      return 13;
    case 'K':
      return 12;
    case 'Q':
      return 11;
    case 'J':
      return 10;
    case 'T':
      return 9;
    case '9':
      return 8;
    case '8':
      return 7;
    case '7':
      return 6;
    case '6':
      return 5;
    case '5':
      return 4;
    case '4':
      return 3;
    case '3':
      return 2;
    default:
      return 1;
  }
}

function getCharScoreTask2(character: string): number {
  switch (character) {
    case 'A':
      return 13;
    case 'K':
      return 12;
    case 'Q':
      return 11;
    case 'T':
      return 10;
    case '9':
      return 9;
    case '8':
      return 8;
    case '7':
      return 7;
    case '6':
      return 6;
    case '5':
      return 5;
    case '4':
      return 4;
    case '3':
      return 3;
    case '2':
      return 2;
    default:
      return 1;
  }
}
