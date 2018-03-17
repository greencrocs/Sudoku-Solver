	// Methodisches Suchen:	CHECK 3x3 subgrid for BLOCKED ROW

	function checkSubgrid4BlockedRow( subgrid, x, rowBlocked, subgridBlockedFields, blockedRows, blockedColumns) {
		// 3x3 subgrid
		// e.g., try to set 2, 3 field are already set (1, 8, 9), row 0 and 1 are blocked, col 2 is blocked, leaves only 2,2 for value 2
		// 0 0 0 
		// 0 9 0
		// 8 0 1
		// 
		var r, c;
		var i, j;
		var count = 0;
		var row = subgridXY[subgrid-1][0];		// subgrid starts with row, col
		var col = subgridXY[subgrid-1][1];
		var y;
		var dupX, dupY;
		if (debug == true)
			console.log("DEBUG: checkSubgrid4BlockedRow, subgrid=%d, x=%d, rowBlocked=%d\n", subgrid, x, rowBlocked);

		// fill subgrid with values from puzzle; fields containing -1 are already blocked
		// now check if we can block rows and columns with rowBlocked, colBlocked
		// rowBlocked and colBlocked may be out of scope of subgrid, so check!


		// FIRST: rowBlocked, only applicable for the 3 rows of subgrid
		
		if ((rowBlocked >= row) && (rowBlocked < (row + 3))) {
			subgridBlockedFields[rowBlocked - row][0] = -1;
			subgridBlockedFields[rowBlocked - row][1] = -1;
			subgridBlockedFields[rowBlocked - row][2] = -1;
		}

		// SECOND: check for  blocked fields, all subgrid fields containing values != 0 are blocked

		// checkSubgrid4BlockedFields not already blocked by blockedRow and blockedColumn
		for (r=row; r<(row+3); r++) {
			for (c=col; c<(col+3); c++) {
				// System.out.printf("%2d %2d\n",  i, c-col);
				y = puzzle[r][c];	                          // y can be 1..9 or 0
				// System.out.printf("y=%d\n", y);
				if ((y!==0) && (subgridBlockedFields[r-row][c-col] != -1)) {
					subgridBlockedFields[r-row][c-col] = -1;	//mark this field as blocked in subgridBlockedFields
				}
			}
		}

		// Was noch fehlt: falls nur noch eine 0 übrig bleibt, wird hier die Zahl x eingetragen
		// If only 1 field in subgridBlockedFields remains (8 fields contain -1, 9th field = 0)
		//	then remaining field can be set to x
		c=0;
		count=0;
		for (i=0; i<3; i++) {
			for (j=0; j<3; j++) {
				if (subgridBlockedFields[i][j] === 0) {
					count++;
					r=i;		// row merken, 0 <= i < 3
					c=j;		// col merken, 0 <= j < 3
				}
			}
		}
		// Falls nur noch 1 der 9 Felder auf 0 steht, kann x eingesetzt werden
		if (count==1) {
			console.log("checkSubgrid4BlockedRow: Wert %d kann in %d,%d eingetragen werden\n", x, row+r, col+c);
			solvedWithMethodicalSearch++;
			console.log("solvedWithMethodicalSearch: %d\n", solvedWithMethodicalSearch);
			document.getElementById("solvedWithMethodicalSearch").innerHTML = "Solved with Methodical Search: " +  solvedWithMethodicalSearch;	
			


			// ACHTUNG: jetzt müssen auch Zeile und Spalte gesperrt werden !
			// Zeile row+r und Spalte col+c für x sperren, d.h., array blockedRows[r] = row+r, array blockedColumn[c]=col+c

			dupX = check4DuplicateValueInRow(x, row+r);
			dupY = check4DuplicateValueInColumn(x, col+c);

			if ( dupX != -1 ) {
				console.log("DUPLICATE value %d in row %d\n", x, dupX);
			}
			if ( dupY != -1 ) {
				console.log("DUPLICATE value %d in col %d\n", x, dupY);
			}

			if ( (dupX == -1) && (dupY == -1)) {
				blockedRows[row+r]=row+r;
				blockedColumns[col+c]=col+c;
			}

			// puzzle[row+r][col+c] = x;
			setPuzzleValue(row+r, col+c, x);
			setSolutionMatrix(row+r, col+c, x, METHODICAL_SEARCH);
      
			// document.getElementById("methodicalSearch").innerHTML = "Methodical Search: " +  getNumberEmptyFields();	
			
			// blockedRows[r]=row+r;
			// blockedColumns[c]=col+c;
		}

	}
	
	
// Methodisches Suchen:	CHECK 3x3 subgrid for BLOCKED COLUMN
function checkSubgrid4BlockedColumn( subgrid, x, colBlocked, subgridBlockedFields, blockedRows, blockedColumns ) {
		// 3x3 subgrid
		// e.g., try to set 2, 3 field are already set (1, 8, 9), row 0 and 1 are blocked, col 2 is blocked, leaves only 2,2 for value 2
		// 0 0 0 	-1 -1 -1
		// 0 9 0	-1 -1 -1
		// 8 0 1	-1	0 -1
		// 
		var r, c;
		var i, j;
		var count = 0;
		var row = subgridXY[subgrid-1][0];		// subgrid starts with row, col
		var col = subgridXY[subgrid-1][1];
		var y;
		var dupX, dupY;
		
		if (debug == true)
			console.log("DEBUG: checkSubgrid4BlockedColumn, subgrid=%d, x=%d, colBlocked=%d\n", subgrid, x, colBlocked);

		// System.out.printf("checkSubgrid4BlockedColumn, subgrid=%d, x=%d, colBlocked=%d\n", subgrid, x, colBlocked);

		// FIRST: colBlocked, only applicable for the 3 columns of subgrid
		
		if ((colBlocked >= col) && (colBlocked < (col+3))) {
			subgridBlockedFields[0][colBlocked - col] = -1;
			subgridBlockedFields[1][colBlocked - col] = -1;
			subgridBlockedFields[2][colBlocked - col] = -1;
		}


		// THEN: check for  blocked fields 

		// checkSubgrid4BlockedFields not already blocked by blockedRow and blockedColumn
		for (r=row; r<(row+3); r++) {
			for (c=col; c<(col+3); c++) {
				// System.out.printf("%2d %2d\n",  i, c-col);
				y = puzzle[r][c];	        // y can be 1..9 or 0
				// System.out.printf("x=%d\n", x);
				if ((y!==0) && (subgridBlockedFields[r-row][c-col] != -1)) {
					subgridBlockedFields[r-row][c-col] = -1;	// mark this field in subgridBlockedFields as blocked
				}
			}
		}
		// Was noch fehlt: falls nur noch eine 0 übrig bleibt, wird hier die Zahl x eingetragen
		c=0;
		count=0;
		for (i=0; i<3; i++) {
			for (j=0; j<3; j++) {
				if (subgridBlockedFields[i][j] === 0) {
					count++;
					r=i;					// row und column merken
					c=j;
				}
			}
		}
		// Falls nur noch 1 der 9 Felder auf 0 steht, kann x eingesetzt werden

		// Falls nur noch 1 der 9 Felder auf 0 steht, kann x eingesetzt werden
		if (count==1) {
			console.log("checkSubgrid4BlockedColumn: Wert %d kann in row %d, col %d eingetragen werden\n", x, row+r, col+c);
			solvedWithMethodicalSearch++;
			console.log("solvedWithMethodicalSearch: %d\n", solvedWithMethodicalSearch);
			document.getElementById("solvedWithMethodicalSearch").innerHTML = "Solved with Methodical Search: " +  solvedWithMethodicalSearch;	

			// ACHTUNG: jetzt müssen auch Zeile und Spalte gesperrt werden !
			// Zeile row+r und Spalte col+c für x sperren, d.h., array blockedRows[r] = row+r, array blockedColumn[c]=col+c

			dupX = check4DuplicateValueInRow(x, row+r);
			dupY = check4DuplicateValueInColumn(x, col+c);

			if ( dupX != -1 ) {
				console.log("ERROR in SUBGRID %d, DUPLICATE value %d in row %d\n", subgrid, x, dupX);
			}
			if ( dupY != -1 ) {
				console.log("ERROR SUBGRID %d, DUPLICATE value %d in col %d\n", subgrid, x, dupY);
			}

			if ( (dupX == -1) && (dupY == -1)) {
				blockedRows[row+r]=row+r;
				blockedColumns[col+c]=col+c;
			}
			// puzzle[row+r][col+c] = x;
			setPuzzleValue(row+r, col+c, x);
			setSolutionMatrix(row+r, col+c, x, METHODICAL_SEARCH);
			// document.getElementById("methodicalSearch").innerHTML = "Methodical Search: " +  getNumberEmptyFields();			// blockedRows[row+rr]=row+r;
			// blockedColumns[col+cc]=col+c;
		}
	}



/*
 *  SOLVE Sudoku Puzzle with 'Methodical Search'
 */
function SolveWithMethodicalSearch() {
	var i;			// Zeile
	var j;			// Spalte
	var x;			// X

	var emptyFields;
	var presetFields;
	var continueSudoku = false;
	var loop = 0;

		var rowBlocked;
		var columnBlocked;
		var blockedRows = 	 [ -1, -1, -1, -1, -1, -1, -1, -1, -1 ];
		var blockedColumns = [ -1, -1, -1, -1, -1, -1, -1, -1, -1 ];

		var subgrid;
		var subgridBlockedFields = [ 	
				[0, 0, 0], 
				[0, 0, 0], 
				[0, 0, 0], 
				[0, 0, 0]
		];

		// MAIN LOOP

		emptyFields = getNumberEmptyFields();
		presetFields = 81 - emptyFields;

		do {

			console.log("Methodical Search: loop=%d, empty Fields=%d\n", ++loop, emptyFields);
			document.getElementById("logMethodicalSearch").innerHTML = "Methodical Search: loop = " +  loop + ", empty = " + getNumberEmptyFields();	
			

			for (x=1; x<=9; x++) {
				if (debug == true)
					console.log("DEBUG: Find blocked rows & columns for value %d, store in arrays blockedRows, blockedColumns\n", x);

				for (i=0; i<9; i++) blockedRows[i]=-1;		// initialize array blockedRows	 with -1
				for (i=0; i<9; i++) blockedColumns[i]=-1;	// initialize array blockedColumns with -1

				check4blockedRowsColumns(x, blockedRows, blockedColumns);	

				// console.log("Blocked rows   : "); 
				// showArray(blockedRows);
				// console.log("Blocked columns: "); 
				// showArray(blockedColumns);
				// System.out.println();

				// Jedes Subgrid auf diese Zahl x prüfen mit checkSubgrid4BlockedRows, checkSubgrid4BlockedColums

				for (subgrid=1; subgrid<=9; subgrid++) {

					// init 3x3 subgridBlockedFields with 0 for each new subgrid to check
					for (i=0; i<3; i++) {
						for (j=0; j<3; j++) {
							subgridBlockedFields[i][j]=0;
						}
					}	

					// TBD: checkSubgrid4Value
					
					if ( checkSubgrid4Value(subgrid, x) == true) { 
						// console.log("Subgrid %d contains value %d, SKIP subgrid!\n", subgrid, x);

						// ABER: wenn ein Subgrid den Wert x enthält, muss dann blockedRows und blockedColumns erweitert werden, oder sind sie schon für x gesperrt?

						// console.log("DEBUG START: Wert %d in subgrid gefunden\n", x, subgrid);
						// puzzle.showSubgrid(subgrid);
						// puzzle.showArray(subgridBlockedFields[0]);
						// puzzle.showArray(subgridBlockedFields[1]);
						// puzzle.showArray(subgridBlockedFields[2]);
						// console.log("DEBUG END");

						continue;   // skip this subgrid
					}


					// CHECK BLOCKED ROWS in subgrid
					for (i=0; i<blockedRows.length; i++) {
						if (blockedRows[i] != -1) {
							rowBlocked=i;
							checkSubgrid4BlockedRow(subgrid, x, rowBlocked, subgridBlockedFields, blockedRows, blockedColumns);
						}
					}

					// BLOCKED COLUMNS
					for (j=0; j<blockedColumns.length; j++) {
						if (blockedColumns[j] != -1) {
							columnBlocked=j;
							// TBD: checkSubgrid4BlockedColumn
							checkSubgrid4BlockedColumn(subgrid, x, columnBlocked, subgridBlockedFields, blockedRows, blockedColumns);
						}
					}

					// showSubgrid(subgrid);
					// showArray(subgridBlockedFields[0]);
					// showArray(subgridBlockedFields[1]);
					// showArray(subgridBlockedFields[2]);
				}
			}

			if (getNumberEmptyFields() < emptyFields) {	  // at least 1 new field was solved so let's continue
				emptyFields = getNumberEmptyFields();
				continueSudoku = true;
			} else {
				continueSudoku = false;
			}
			if (isSolved() == true) {
				continueSudoku = false;
			}

		} while ( (emptyFields >  0) && (continueSudoku === true) );	

		return getNumberEmptyFields();
}