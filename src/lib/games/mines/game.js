export function Game(options = {}) {
	const size = options.size ?? 10;
	const mineCount = options.mineCount ?? 10;
	let table = initTable();
	let started = false; 
	let gameLost = false;

	function newTile(value) {
		return {
			value,
			revealed: false,
			isMine: false,
			isFlag: false
		};
	}

    function neighbours(i, j) {
        return [
            i > 0 && j > 0 && [i - 1, j - 1],
            j > 0 && [i, j - 1],
            i < size - 1 && j > 0 && [i + 1, j - 1],
            i > 0 && [i - 1, j],
            i < size - 1 && [i + 1, j],
            i > 0 && j < size - 1 && [i - 1, j + 1],
            j < size - 1 && [i, j + 1],
            i < size - 1 && j < size - 1 && [i + 1, j + 1]
        ].filter(Boolean);
    }

	function updateNumbers() {
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (table[i][j].isMine) {
					neighbours(i, j).map(([ii, jj]) => {
						table[ii][jj].value++;
					});
				}
			}
		}
	}

	function canPlaceMine(i, j) {
		if (table[i][j].isMine) return false;
		// if(adjacentToFirstPoint(table[i][j])) return false
		return true;
	}

	function placeMine(i, j) {
		if (canPlaceMine(i, j)) {
			if (table[i][j].isMine) return false;
			table[i][j].isMine = true;
			return true;
		}
	}

	function initTable() {
		let table = [];
		for (let i = 0; i < size; i++) {
			table[i] = [];
			for (let j = 0; j < size; j++) {
				table[i][j] = newTile(0);
			}
		}
		return table;
	}


	function reset() {
		table = initTable();
		started = false;
		gameLost = false
	}

	function initMines(x, y) {
		started = true;

		let insertedMines = 0;
		while (insertedMines < mineCount) {
			let i, j;

			do {
				i = Math.floor(Math.random() * size);
				j = Math.floor(Math.random() * size);
			} while (Math.abs(i - x) <= 1 && Math.abs(j - y) <= 1);

			if (placeMine(i, j)) {
				insertedMines++;
			}
		}
		updateNumbers();
	}

    function revealAllMines() {
        for(let i=0; i<size; i++) {
            for(let j=0; j<size; j++) {
                if(table[i][j].isMine) {
                    table[i][j].revealed = true;
                }
            }
        }

    }

	function reveal(i, j) {
		if (table[i][j].revealed) return;
        if(table[i][j].isFlag) return;
		if (table[i][j].isMine) {
			gameLost = true
			revealAllMines();
		}
		table[i][j].revealed = true;

		if (table[i][j].value === 0) {
            neighbours(i, j).map(([ii, jj]) => {
                reveal(ii, jj)
            })
		}
	}

	function isWon() {
		for(let i=0; i<size; i++) {
            for(let j=0; j<size; j++) {
				if(!table[i][j].isMine && !table[i][j].revealed) {
                    return false
                }
            }
        }
		return true
	}

    function isLost() {
        return gameLost;
    }

	return {
		reset() {},
		getData() {
			return {table, isWon: isWon(), isLost: isLost()};
		},
		open(i, j) {
			if(gameLost) return;
			if (!started) initMines(i, j);

			reveal(i, j);
			if (table[i][j].isMine) {
				console.log('Game Over');
			}
            console.log("isWon: ", isWon())
		},
		flag(i, j) {
            if(!started) return;
			if (table[i][j].isFlag) {
				table[i][j].isFlag = false;
				return;
			}

			if (!table[i][j].revealed) table[i][j].isFlag = true;
		},
		reset
	};
}
