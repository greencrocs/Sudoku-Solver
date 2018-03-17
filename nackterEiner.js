// First element of subgrid 1..9 starts at ...

	/*
	 * METHODE DES 'NACKTEN EINERS':	checkRow, checkColumn, checkSubgrid
	 *	Version 1.00
	 *	last update on 2018-03-07 
	 *
	 */
	 
	function convertxy2Subgrid(row, column) {
		// Input: x,y	
		// Output: subgrid number (1..9)
		var grid = 0;
		// wrong grid = row / 3  + ((column / 3) * 3) + 1;

		grid = parseInt(row / 3) * 3 + 1 + parseInt(column / 3);
		// console.log("DEBUG: convertxy2Subgrid(%d, %d) = %d", row, column, grid);
		
		return grid;	// return subgrid number where x,y lies
	}
	 
	 
	// Nackter Einer
	function checkRow( row, p ) {
		var col;
		var x;
		for (col=0; col<9; col++) {
			x=getPuzzleValue(row, col);
			if (x!==0) {
				p[x-1]=0;	// delete candidate
			}
		}
	}

	// Nackter Einer
	function checkColumn( col, p ) {
		var row;
		var x;
		for (row=0; row<9; row++) {
			x=getPuzzleValue(row, col);
			if (x!==0) {
				p[x-1]=0;	// delete candidate
			}
		}
	}

	// Nackter Einer
	function checkSubgrid( subgrid, p) {

		// First element of subgrid 1..9 starts at ...
    var table = [ 	
			[ 0, 0 ],	
			[ 0, 3 ],
			[ 0, 6 ],
			[ 3, 0 ],
			[ 3, 3 ],
			[ 3, 6 ],
			[ 6, 0 ],
			[ 6, 3 ],
			[ 6, 6 ]
	  ];
	
	var x, r, c;
	// console.log(subgrid);
	// console.log(subgrid -1);
	
	var row = table[subgrid -1][0];
	var col = table[subgrid -1][1];

	for (r=row; r<(row+3); r++) {
		for (c=col; c<(col+3); c++) {
			x=getPuzzleValue(r, c);
			if (x!==0) { 		
				p[x-1]=0;	// delete candidate
			}
		}			
	}
}

/*
function setPuzzleValue( row, col, x) {
		puzzle[row][col] = x;
		document.getElementById('puzzle').innerHTML = prepSudokuTable();
		sleep(500);
}

*/
	/*
	 *  SOLVE Sudoku Puzzle with method 'Nackter Einer'
	 */
function solveWithNackterEiner() {
		var r, c;
		// var row, col; stören die hier???
		var count;
		var idx;
		var i;			// Zeile
		var j;			// Spalte
		var q;
		var x;			// X

		var loop=0;

		var emptyFields;
		var presetFields;
		var continueSudoku = false;

		var possibleCandidates = 	[ 1, 2, 3, 4, 5, 6, 7 , 8, 9];			// array possibleCandidates contains all possible candidates 1..9 for a field		

		var subgrid;


		// MAIN LOOP

		emptyFields = getNumberEmptyFields();
		presetFields = 81 - emptyFields;

		// Solange Lösung nicht vollständig ist Schleife wiederholen

		do {

			console.log("Nackter Einer: loop=%d, empty Fields=%d\n", ++loop, getNumberEmptyFields());
			document.getElementById("logNackterEiner").innerHTML = "Nackter Einer: loop = " +  loop + ", empty cells = " + getNumberEmptyFields();	
			
			/*
			 * „Methode des nackten Einers“: Hierbei legt man zunächst ein Feld fest. 
			 * Für dieses werden alle Ziffern ausgeschlossen, die in derselben Gruppe (Zeile, Spalte oder Block) bereits stehen. 
			 * Wenn nur noch eine Ziffer möglich bleibt, ist sie die Lösung für dieses Feld. 
			 * (Nur eine Ziffer verbleibt für die betrachtete Position.) 
			 * Zweckmäßigerweise beginnt man in Spalten, Zeilen oder Blöcken mit den wenigsten leeren Feldern, 
			 * da es hier am wahrscheinlichsten ist, dass man alle Zahlen bis auf eine ausschließen kann.

			 */

			// Für jedes der 81 Felder ausgeben, welche Zahlen gesetzt werden können. Nur mit den unbelegten Felder machen (null)

			continueSudoku = false;

			for (i=0; i<9; i++) {								// Zeile i, row i
				for (j=0; j<9; j++) {							// Spalte j, column j
					if ( getPuzzleValue(i, j) === 0) {	// 0 = not occupied by any number 1..9

						// console.log("DEBUG: i=%d, j=%d, value=%d, check all possible values ...\n", i, j, getPuzzleValue(i, j));

						// check row i and columns j for values other than 0, if value != 0 is found, delete that value in array p
						// Ich bin in Zeile i, alle Werte != null werden in array p gestrichen bzw. auf null gesetzt


						// CHECK ROW i, i=fix, COLUMNS 0..8, eliminate candidates
						checkRow(i, possibleCandidates);

						// CHECK COLUMN j, j = fix, ROWS 0..8, eliminate candidates
						checkColumn(j, possibleCandidates);

						// CHECK SUBGRID
						subgrid = convertxy2Subgrid(i, j);		// Convert x,y to subgrid number
						// checkSubgrid(subgrid, possibleCandidates, i, j);	i??, j?? brauchen wir nicht !
						// console.log("DEBUG: subgrid=%d", subgrid);
						checkSubgrid(subgrid, possibleCandidates);	// Check subgrid, eliminate candidates

						// CHECK array possibleCandidates: falls nur noch 1 Zahl übrig bleibt (alles andere 0), ausgeben!!
						count = 0;
						idx = 0;
						for (r=0; r<9; r++) {
							if (possibleCandidates[r] !== 0) {
								count++;
								idx=r;
							}
						}

						// falls count genau 1 ist, ist nur noch eine mögliche Zahl übrig
						if ( count == 1 ) {
							console.log("solveWithNackterEiner: Zeile %d, Spalte %d, possibleCandidates[%d]=%d\n", i, j, idx, possibleCandidates[idx]);
							setPuzzleValue(i, j, possibleCandidates[idx]);	// setze Zahl 
							setSolutionMatrix(i, j, possibleCandidates[idx], NACKTER_EINER);
							solvedWithNackterEiner++;
							console.log("solvedWithNackterEiner: %d\n", solvedWithNackterEiner);
							document.getElementById("solvedWithNackterEiner").innerHTML = "Solved with Nackter Einer: " +  solvedWithNackterEiner;	
			
			
							// document.getElementById("nackterEiner").innerHTML = "Nackter Einer: " +  getNumberEmptyFields();	
							// showSudokuPuzzleCompact();
							continueSudoku = true;					// found correct number for puzzle at i,j so let's continue ...
						}
					}

					// RESET array p: array p wieder mit Kandidaten füllen 
					for (q=0; q<9; q++) {
						possibleCandidates[q] = q+1;
					}
				} 

			} // Main loop over all 81 fields


			if (isSolved() == true) {
				continueSudoku = false;
			}

		} while ( (emptyFields >  0) && (continueSudoku == true) ); 		// Ende Bedingung verbessen !!	// Ende Bedingung verbessen !!


		return getNumberEmptyFields();
	}

