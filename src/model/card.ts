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
        if (number < 0 || number > 11) {
            throw new Error('illegal card number')
        }
    }

    get key(): string {
        return `${this.color}_${this.number}`
    }

    get textColor(): string {
        switch (this.color) {
            case CardColor.black:
                return `white`
            case CardColor.white:
                return `black`
        }
    }

    get bgColor(): string {
        return `${this.color}`
    }

    get border(): string {
        return `solid 1px ${this.textColor}`
    }
}

export class UnknownCard {
    constructor(
        public readonly color: CardColor
    ) {}

    get textColor(): string {
        switch (this.color) {
            case CardColor.black:
                return `white`
            case CardColor.white:
                return `black`
        }
    }

    get bgColor(): string {
        return `${this.color}`
    }

    get border(): string {
        let lineColor: string
        switch (this.color) {
            case CardColor.black:
                lineColor = "white"
                break
            case CardColor.white:
                lineColor = "black"
                break
        }
        return `solid 1px ${this.textColor}`
    }
}


export class MyHand {
    private cards: Card[]
    constructor(cards: Card[]) {
        this.cards = cards
    }

    get sortedCards(): Card[] {
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

export class OtherHand {
    constructor(public readonly cards: Array<Card|UnknownCard>) {
    }
}
