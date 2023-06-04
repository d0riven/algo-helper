import {text} from "stream/consumers";

export enum CardColor {
    black = 'black',
    white = 'white',
}

export class Card {
    constructor(
        public readonly number: number,
        public readonly color: CardColor
    ) {
        if (number > 12 || number < 0) {
            throw new Error('illegal card number')
        }
    }

    get key(): string {
        return `${this.color}_${this.number}`
    }

    get textColor(): string {
        return `${this.color}`
    }

    get bgColor(): string {
        switch (this.color) {
            case CardColor.black:
                return `white`
            case CardColor.white:
                return `black`
        }
    }

    get border(): string {
        return `solid 1px ${this.textColor}`
    }
}

export class MyHand {
    private cards: Card[]
    constructor(cards: Card[]) {
        this.cards = cards
    }

    get sortedCard(): Card[] {
        return this.cards.concat().sort((a, b) => {
            if (a.number < b.number) {
                return -1
            }
            if (a.number > b.number) {
                return 1
            }
            // 数値の大きさが同じなら、黒を先に並べる
            if (a.color == CardColor.black) {
                return -1
            }
            return 1
        })
    }
}

