win_fields = [
    [1,2,3],
    [4,5,6],
    [7,8,9],
    [1,4,7],
    [2,5,8],
    [3,6,9],
    [1,5,9],
    [7,5,3]
];

map = ["","","","","","","","",""];
turn = "";
game_going = 0;
game_mode = "";
bot_side = "";
player_side = "";

function chooseGM(gm) {
    cleanMap();
    game_mode = gm;
    game_going = 1;
    turn = "X";
    switch(gm) {
        case "2p":
            game2p();
            break;
        case "1pIMB":
            game1pIntermediateBot("X","0");
            break;
    }
}

function cleanMap() {
    for (let i = 1; i < 10; i++){
        document.getElementById(`f${i}`).innerText = "";
    }
    map = ["","","","","","","","",""];
}

function game2p() {
    document.getElementById("turn").innerText = `Player ${turn}'s turn`;
    document.getElementById("gamemode").innerText = "Current mode: 2 Players";
    for (let i = 1; i < 10; i++){
        document.getElementById(`f${i}b`).onclick = function() { fillField(`${i}`); }
    }
}

function game1pIntermediateBot(bs,ps) {
    bot_side = bs;
    player_side = ps;
    document.getElementById("turn").innerText = `Player ${turn}'s turn`;
    document.getElementById("gamemode").innerText = "Current mode: 1 Player";
    for (let i = 1; i < 10; i++){
        document.getElementById(`f${i}b`).onclick = function() { fillFieldPlus(`${i}`); }
    }
    if (bot_side == "X") {
        botMove();
    }
}

function fillFieldPlus(Idn) {
    if (game_going == 1) {
        if(player_side == turn) {
            if (fillField(Idn)) {
                botMove();
                checkEnd();
            }
        }
    }
}

function fillField(Idn) {
    if (game_going == 1) {
        Id = `f${Idn}`;
        if (!document.getElementById(Id).innerText) {
            map[Idn-1] = turn;
            doTurn(Idn);
            checkEnd();
            return true;
        }
        else { return false; }
    }
}

function doTurn(Idn) {
    Id = `f${Idn}`;
    document.getElementById(Id).innerText = turn;
    if (turn == "X") { turn = "0"}
    else { turn = "X"; }
    document.getElementById("turn").innerText = `Player ${turn}'s turn`;
    return true;
}

function checkEnd() {
    w = checkWin();
    if (w) {
        endGame(w);
    }
}

function restart() {
    chooseGM(game_mode);
}

function checkWin() {
    for (let combination of win_fields) {
        field1 = map[combination[0]-1];
        field2 = map[combination[1]-1];
        field3 = map[combination[2]-1];
        console.debug(combination, field1,field2,field3);
        if (field1 == field2 && field2 == field3) {
            if (field1 == "X" || field1 == "0") {
                winner = field1;
                return winner;
            }
        }
    }
    if (!map.includes("")) {
        return "draw";
    }
    return;
}

function endGame(winner) {
    if (winner == "draw") {
        document.getElementById("turn").innerText = `Game Over! Draw!`;
        game_going = 0;
        turn = "";
    }
    else {
        document.getElementById("turn").innerText = `Game Over! ${winner} won!`;
        game_going = 0;
        turn = "";
    }
}

function botMove() {
    if (game_going == 1) {
        //trying to win
        for (let i = 0; i < 9; i++) {
            if (map[i] == "") {
                map[i] = bot_side;
                if (checkWin() == bot_side) {
                    doTurn(i+1);
                    return;
                }
                else {
                    map[i] = "";
                }
            }
        }

        //block player
        for (let i = 0; i < 9; i++) {
            if (map[i] == "") {
                map[i] = player_side;
                if (checkWin() == player_side) {
                    map[i] = bot_side;
                    doTurn(i+1);
                    return;
                }
                else {
                    map[i] = "";
                }
            }
        }

        //priority cells
        const priority = [4,0,2,6,8,1,3,5,7];
        for (let cell of priority) {
            if (map[cell] == "") {
                map[cell] = bot_side;
                doTurn(cell+1);
                return;
            }
        }
    }
}