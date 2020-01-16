namespace doc_07 {
    // 定义函数
    interface Add {
        (x: number, y: number): number;
    }
    const add: Add = (x, y) => x + y;
    function subtract(x: number, y: number) {
        return x - y;
    }

    // 无返回值
    function fn(): void {
        console.log('1');
    }

    // 可选参数
    function multiply(x: number, y: number, z?: number) {
        return x * y * (z || 1);
    }

    multiply(1, 2);
    multiply(1, 2, 3);

    // 默认参数
    function divide(x: number, y: number = 10) {
        return x / y;
    }

    // 剩余参数
    function plus(...rest: Array<number>) {
        return rest.reduce((sum, cur) => sum + cur, 0);
    }
    console.log(plus(1, 2, 3));

    // 重载

    function assign(all: number): number
    function assign(a: number, b: number): number
    function assign(a: number, b: number, c: number, d: number): number
    function assign(a: number, b?: number, c?: number, d?: number) {
        return a + (b || 0) + (c || 0) + (d || 0);
    }

    assign(1);
    assign(1, 2);
    // assign(1, 2, 3);
    assign(1, 2, 3, 4);

    // this 参数
    interface Card {
        suit: string;
        card: number;
    }
    interface Deck {
        suits: string[];
        cards: number[];
        createCardPicker(this: Deck): () => Card;
    }
    const deck:Deck = {
        suits: ["hearts", "spades", "clubs", "diamonds"],
        cards: Array(52),
        createCardPicker: function(this: Deck) {
            return () => {
                let pickedCard = Math.floor(Math.random() * 52);
                let pickedSuit = Math.floor(pickedCard / 13);
    
                return {suit: this.suits[pickedSuit], card: pickedCard % 13};
            }
        }
    }
    /* const createCardPicker = deck.createCardPicker;
    const cardPicker = createCardPicker();
    const pickedCard = cardPicker(); */

    const cardPicker = deck.createCardPicker();
    const pickedCard = cardPicker();

    // 回调中的this
    interface UIElement {
        addClickListener(onClick: (this:void, e:Event) => void):void;
    }

    const uiElement:UIElement = {
        addClickListener() {},
    }

    class Handler {
        info:string = 'info';
        onClick(e:Event) {
            this.info = e.type;
        }
    }
    const handler = new Handler();
    uiElement.addClickListener(handler.onClick)


}