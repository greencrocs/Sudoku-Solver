	/*
	 * METHODE DES 'VERSTECKTEN EINERS':	checkRow4Values, checkColumn4Values, checkSubgrid4Values
	 */
	// Methode des versteckten Einers: welche Zahlen 0..9 gibt es schon?
	function checkRow4Values( row, p ) {
		var col;
		var x;
		for (col=0; col<9; col++) {
			x=puzzle[row][col];
			if (x!==0) {	
				p[x-1]=x;	// set candidate
			}
		}
	}

	// Methode des versteckten Einers: welche Zahlen 0..9 gibt es schon?
	function checkColumn4Values( col, p ) {
		var row;
		var x;
		for (row=0; row<9; row++) {
			x=puzzle[row][col];
			if (x!==0) {
				p[x-1]=x;	// set candidate
			}
		}
	}

	// Methode des versteckten Einers: welche Zahlen 0..9 gibt es schon?
	function checkSubgrid4Values( subgrid, p ) {
		var x, r, c;

		var row = subgridXY[subgrid-1][0];
		var col = subgridXY[subgrid-1][1];

		for (r=row; r<(row+3); r++) {
			for (c=col; c<(col+3); c++) {
				x=puzzle[r][c];
				// System.out.printf("row=%d, col=%d, x=%d\n", row, col, x);
				if (x!==0) {
					p[x-1] = x;	// set candidate
				}
			}
		}
	}

	// Methode des versteckten Einers: welche Zahlen 0..9 gibt es schon?
	function checkSubgrid4ValuesVersteckterEiner( subgrid, p) {
		var r,c;
		var row, col;
		var x;

		row = subgridXY[subgrid-1][0];
		col = subgridXY[subgrid-1][1];

		for (r=row; r<(row+3); r++) {
			for (c=col; c<(col+3); c++) {
				x=puzzle[r][c];
				// System.out.printf("row=%d, col=%d, x=%d\n", row, col, x);
				if (x!==0) {
					// p[x-1] = x;	// set candidate
					p[r][c] = x;
				}
			}
		}
	}

	
	/*
	 *  SOLVE Sudoku Puzzle with method 'Versteckter Einer'
	 */
	function solveWithVersteckterEiner() {
		var r, c;
		var row, col, subgrid;
		var count;
		var idx;
		var i;			// Zeile
		var j;			// Spalte
		var x;			// X

		var loop=0;

		var emptyFields;
		var presetFields;
		var continueSudoku = false;

		var occupiedFields = [ -1, -1, -1, -1, -1, -1, -1, -1 -1, -1 ];	// occupied Fields 1..9 in row, column and block

		// MAIN LOOP

		emptyFields = getNumberEmptyFields();
		presetFields = 81 - emptyFields;

		// Solange Lösung nicht vollständig ist Schleife wiederholen

		do {

			// System.out.printf("Versteckter Einer: Loop=%d, empty Fields=%d\n", ++Loop, emptyFields);
			console.log("Versteckter Einer: loop=%d, empty Fields=%d\n", ++loop, getNumberEmptyFields());
			document.getElementById("logVersteckterEiner").innerHTML = "Versteckter Einer: loop = " +  loop + ", empty = " + getNumberEmptyFields();	
			

			/*
			 * „Methode des versteckten Einers“: 
			 * Bei dieser Methode betrachtet man eine Gruppe (Zeile, Spalte oder Block) und eine Ziffer, 
			 * die noch nicht in dieser Gruppe eingetragen ist. 
			 * Da jede Ziffer in einer Gruppe genau einmal vorkommt, muss sie in eines der freien Felder eingetragen werden. 
			 * Falls es nur noch ein freies Feld in dieser Gruppe gibt, in die die Ziffer eingetragen werden kann, 
			 * ohne dass sie in einer anderen Gruppe mehrfach vorkommt, wird sie in dieses Feld eingetragen.
			 * 
			 */

			continueSudoku = false;

			for (r=0; r<9; r++) {								// row r
				for (c=0; c<9; c++) {							// column c

					// init rowBlockedFields, columnBlockedFields, subgridBlockedFields
					// for (i=0; i<9; i++) rowBlockedFields[i]=columnBlockedFields[i]=0;
					// for (i=0; i<3; i++) 
					// 	for( j=0; j<3; j++)
					// 		subgridBlockedFields[i][j]=0;

					// init 
					for (i=0; i<9; i++) {
						occupiedFields[i]=-1;		// OK	
					}

					if ( getPuzzleValue(r, c) == 0) {		// value of puzzle at r, c is not set	(empty field)			// 0 = not occupied by any number 1..9


						// CHECK ROW r, COLUMNS 0..8, eliminate candidates
						checkRow4Values(r, occupiedFields);
						// System.out.printf("\npos row %d, col %d\n", r, c);
						// showArray(occupiedFields);

						// CHECK COLUMN c, ROWS 0..8, eliminate candidates
						checkColumn4Values(c, occupiedFields);
						// showArray(occupiedFields);

						// CHECK SUBGRID, BUT WHICH ONE???
						subgrid = convertxy2Subgrid(r, c);		// Convert r, c to subgrid number

						// checkSubgrid4ValuesVersteckterEiner(subgrid, subgridOccupiedFields);		// ???		// Check subgrid, eliminate candidates
						checkSubgrid4Values(subgrid, occupiedFields);
						// showArray(occupiedFields);document
						// showArray(occupiedFields);

						// CHECK occupiedFields: falls nur noch 1 Zahl übrig bleibt, diese merken
						count = 0;
						idx = 0;
						for (i=0; i<9; i++) {
							if (occupiedFields[i] == -1) {
								count++;
								idx=i;
							}
						}

						// falls count genau 1 ist, ist nur noch eine mögliche Zahl übrig
						if ( count == 1 ) {
							console.log("versteckterEiner: Zeile %d, Spalte %d, occupiedFields[%d]=%d, remaining value=%d\n", r, c, idx, occupiedFields[idx], idx+1);
							solvedWithVersteckterEiner++;
							document.getElementById("solvedWithVersteckterEiner").innerHTML = "Solved with Versteckter Einer: " +  solvedWithVersteckterEiner;	

								setPuzzleValue(r, c, idx+1);	// setze Zahl 
								setSolutionMatrix(r, c, idx+1, VERSTECKTER_EINER);
							// showSudokuPuzzleCompact();
							continueSudoku = true;					// found correct number for puzzle at i,j so let's continue ...
						} else {
							// System.out.printf("Mist! %d possible remaining values ...\n", count);
						}
					}


				} 

			} // Main loop over all 81 fields


			if (isSolved() == true) {
				continueSudoku = false;
			}

		} while ( (emptyFields >  0) && (continueSudoku == true) ); 		// Ende Bedingung verbessen !!	// Ende Bedingung verbessen !!


		return getNumberEmptyFields();
	}

