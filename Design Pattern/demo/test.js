const players = [];

class Player {
    constructor(name, teamColor) {
        this.name = name;
        this.partners = []; // 队友
        this.enemies = []; // 敌人
        this.state = 'live';
        this.teamColor = teamColor;
    }
    win() {
        console.log(`${this.name}won`);
    }
    lose() {
        console.log(`${this.name}lost`);
    }
    die() {
        this.lose();
        this.enemy.win();
    }
}

const player1 = new Player('蓝妹妹');
const player2 = new Player('小乖');

player1.enemy = player2;
player2.enemy = player1;

player1.die();