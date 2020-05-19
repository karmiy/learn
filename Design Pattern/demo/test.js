const players = [];

class Player {
    constructor(name, teamColor) {
        this.name = name;
        this.state = 'alive';
        this.teamColor = teamColor;
    }
    win() {
        console.log(`${this.name} won`);
    }
    lose() {
        console.log(`${this.name} lost`);
    }
    die() {
        this.state = 'dead';
        // 给中介者发送消息，该玩家死亡
        playerDirector.reciveMessage('playerDead', this);
    }
    remove() {
        // 给中介者发送消息，移除该玩家
        playerDirector.reciveMessage('removePlayer', this);
    }
    changeTeam(color) {
        // 给中介者发送消息，该玩家换队
        playerDirector.reciveMessage('changeTeam', this, color);
    }
}

const playerFactory = function(name, teamColor) {
    const newPlayer = new Player(name, teamColor);
    playerDirector.reciveMessage('addPlayer', newPlayer);
    return newPlayer;
}

const playerDirector = (function() {
    const players = {}; // 所有玩家，key 为 teamColor
    const operations = {}; // 中介者可以执行的操作
    
    // 新增玩家
    operations.addPlayer = function(player) {
        const teamColor = player.teamColor;
        // 还未成立队伍则立即创建
        players[teamColor] = players[teamColor] || [];
        players[teamColor].push(player);
    }

    // 移除玩家
    operations.removePlayer = function(player) {
        const teamColor = player.teamColor;
        const teamPlayers = players[teamColor] || []; // 对应队伍
        teamPlayers.splice(teamPlayers.indexOf(player), 1);
    }

    // 玩家换队
    operations.changeTeam = function(player, teamColor) {
        operations.removePlayer(player);
        player.teamColor = teamColor;
        operations.addPlayer(player);
    }

    // 玩家死亡
    operations.playerDead = function(player) {
        const teamColor = player.teamColor,
            teamPlayers = players[teamColor];
        
        const all_dead = teamPlayers.every(player => player.state === 'dead');
        if(all_dead) {
            // 本队玩家全部 lose
            teamPlayers.forEach(player => player.lose());
            
            // 其他队伍全部玩家 win
            for(let color in players) {
                if(color !== teamColor) {
                    const teamPlayers = players[color];
                    teamPlayers.forEach(player => player.win());
                }
            }
        }
    }

    const reciveMessage = function(message, ...args) {
        operations[message].apply(this, args);
    }
    return {
        reciveMessage,
    }
}());

const player1 = playerFactory('皮蛋', 'red'),
    player2 = playerFactory('小乖', 'red'),
    player3 = playerFactory('宝宝', 'red'),
    player4 = playerFactory('小强', 'red');

// 蓝队
const player5 = playerFactory('黑妞', 'blue'),
    player6 = playerFactory('葱头', 'blue'),
    player7 = playerFactory('胖墩', 'blue'),
    player8 = playerFactory('海盗', 'blue');