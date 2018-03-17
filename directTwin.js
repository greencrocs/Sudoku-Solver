/**
 * Solve with 'Direct Twin' method
 * 
 * 
 * 
 */
function SolveWithDirectTwin() {
	var c, col;		// column	
	var r, row;		// row
	var b, block;	// block (AKA subgrid)
	var s, subgrid;
	var x;			// value in puzzle

	var i, j, k, f;

	var emptyFields;
	var presetFields;

	var rowTwin = false;
	var columnTwin = false;
	var blockTwin = false;

	var continueSudoku = false;
	var loop = 0;

	var count;
	var idx;
	var countCheckRow4Twins = 0;

	var possibleCandidates = 	[ 1, 2, 3, 4, 5, 6, 7 , 8, 9 ];		// array possibleCandidates contains all possible candidates 1..9 for 1 field	

	
	
	
	var candidateCount = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];	// no. of twins in a row

	var twin1 = 0;
	var twin2 = 0;
	var twin3 = 0;
	var twin4 = 0;
	var idxTwin1 = 0;
	var idxTwin2 = 0;
	var idxTwin3 = 0;
	var idxTwin4 = 0;
	
	
	/**
	 * Create a 9 x 9 x 9 3D Array
	 * See what happens ...
	 */
	var candidates = new Array();		// 9x9x9				// array candidates contains all possible candidates 1..9 for all fields							
	var iMax = 9;
	var jMax = 9;
	var kMax = 9;
	console.log("Build 3D-array candidates");
	for (i = 0; i < iMax; i++) {
		candidates[i] = new Array();
		for (j = 0; j < jMax; j++) {
			candidates[i][j] = new Array();
			for (k = 0; k < kMax; k++ ) {
				candidates[i][j][k] = 0;
			}
		}
	}
	
	// MAIN LOOP

	emptyFields = getNumberEmptyFields();
	presetFields = 81 - emptyFields;

	// Find ALL possible candidates for each field in puzzle
	findAllCandidates( candidates );
	showSudokuCandidatesGrid(candidates);
	// showCandidates(candidates);

	do {

		console.log("Direct Twin (Double Twin): loop=%d, empty Fields=%d\n", ++loop, emptyFields);
		document.getElementById("logDirectTwin").innerHTML = "Direct Twin: loop = " +  loop + ", empty = " + getNumberEmptyFields();	
	
		/*
		 * Die direkte Twin-Methode: 
		 * Wenn in zwei Feldern einer Einheit (Zeile, Spalte, Block) nur noch dieselben zwei Kandidaten stehen, 
		 * das heißt wenn die Kandidatenmengen dieser Felder keine anderen Ziffern mehr enthalten, 
		 * dann muss in jedem der beiden Felder eine dieser beiden Ziffern stehen; 
		 * man weiß nur noch nicht, welche Zahl in welches Feld gehört. 
		 * Keine dieser Ziffern kann somit noch in einem anderen Feld der betroffenen Einheiten vorkommen: 
		 * 
		 * TBD: Liegt der Doppelzwilling in einer Zeile, sind die beiden Ziffern als Kandidaten in den Restfeldern der Zeile zu tilgen 
		 * 
		 * und analog gilt dies für die Spalte oder den Block. Mitunter können zwei Einheiten zugleich bereinigt werden, 
		 * Zeile und Block (siehe Bild: Logikmuster A Beispiel grün) oder Spalte und Block.
		 */

		continueSudoku = false;

		// Check all rows, columns & blocks for twins

		// Check all rows for twins/double twins
		for (row = 0; row < 9; row++) {
			countCandidatesRow(candidates, row, candidateCount);
			checkRow4Twins(row, candidates, candidateCount, twin1, twin2, twin3, twin4, idxTwin1, idxTwin3 );
			countCheckRow4Twins++;

		}

		// Check all columns for twins
		for (col = 0; col < 9; col++) {
			countCandidatesColumn(candidates, col, candidateCount);
			checkColumn4Twins(col, candidates, candidateCount, twin1, twin2, twin3, twin4, idxTwin1, idxTwin3 );

		}

		// check all blocks for twins
		for (block = 1; block <= 9; block++) {
			countCandidatesBlock(candidates, block, candidateCount);
			checkBlock4Twins(block, candidates, candidateCount );
		}


		/*

			 !!!!!! Ein stückchen Code gehört in checkBlock4Twins !!!!!!


			// subgrid: auch hier die twins löschen, falls die twins innerhalb eines blocks liegen
			if (convertxy2Subgrid(idxTwin1, c) == convertxy2Subgrid(idxTwin3, c)) {



				System.out.printf("Double Twins found in same subgrid %d, delete twins as candidates for remaining 7 fields in subgrid!\n", convertxy2Subgrid(idxTwin1, c));
				// TBD

				// removeTwinCandidatesInBlock(candidates, block, twin1, twin2, idxTwin1, idxTwin3);

				subgrid=convertxy2Subgrid(idxTwin1, c);		// Note: idxTwin1 and idxTwin2 are row numbers!
				showSubgrid(subgrid);	

				row = subgridXY[subgrid-1][0];
				col = subgridXY[subgrid-1][1];

				for (i=row; i<(row+3); i++) {
					for (j=col; j<(col+3); j++) {
						if ( getPuzzleValue(i,j)==0) {
							if ( ! ( ((i==idxTwin1) || (i==idxTwin3) ) && (j==c)) )  {		// ob das soooo stimmt???
								candidates[i][j][twin1-1]=0;		// remove twin1, 
								candidates[i][j][twin3-1]=0;		// remove twin3 from candidates in subgrid, but not where we found the twins or field value is already set
							}
						}
					}
				}
			}

		 */


		if (getNumberEmptyFields() < emptyFields) {		// at least 1 new field was solved so let's continue
			emptyFields = getNumberEmptyFields();
			continueSudoku = true;
		} else {
			continueSudoku = false;
		}
		if (isSolved() == true) {
			continueSudoku = false;
		}

	} while ( (emptyFields >  0) && (continueSudoku == true) );	


	console.log("DEBUG: countCheckRow4Twins=%d\n", countCheckRow4Twins); 

	// Update ALL possible candidates for each field in puzzle
	updateAllCandidates(candidates);	
	showSudokuCandidatesGrid(candidates);
	showSudokuPuzzleCompact();
	
	return getNumberEmptyFields();
}


function checkRow4Twins( row, candidates, candidateCount, twin1, twin2, twin3, twin4, idxTwin1, idxTwin3) {
	
	// Check for twins in row. If we find double twins they need to match, otherwise ....????

	var col;
	var rowTwins = 0;		// no. of twins found in row
	var i;
	var foundTwin1 = false;
	var foundTwin2 = false;

	// windown.log("DEBUG: checkRow4Twins" );

	for (col = 0; col < 9; col++) {
		if (candidateCount[col] == 2) {			// candidate[f] enthält die Anzahl verbliebener Kandidaten in Feld col der Zeile r
			rowTwins++;
			// System.out.printf("Found twin candidate#%d in row %d: ", rowTwins, row);
			for (i = 0; i < 9; i++) {
				if (candidates[row][col][i] !=0 ) {						
					// System.out.printf("%2d ", candidates[row][col][i]);		

					if (twin1 == 0) { 
						twin1 = candidates[row][col][i];
						continue;							// continue oder break?
					}
					if ( (twin1 != 0) && (twin2 == 0) ) { 
						twin2 = candidates[row][col][i];
						idxTwin1 = col;						// idxTwin1 = column in row  where twin1&twin2 candidates were found
						foundTwin1 = true;
						continue;
					}
					if ( (twin2 != 0) && (twin3 == 0) ) {
						twin3 = candidates[row][col][i];
						if (twin3 != twin1) {				// Found double twin but twins do not match :-(
							twin3 = 0;
							rowTwins--;
							continue;
						}
						continue;
					}
					if ( (twin3 != 0) && (twin4 == 0) ) {
						twin4 = candidates[row][col][i];
						if (twin4 != twin2) {
							twin4 = twin3 = 0;
							rowTwins--;
							continue;
						}
						idxTwin3 = col;
						foundTwin2 = true;
						continue;
					}
				}
			}
			// System.out.println();
		}
	}

	// Check if the twins are double Twins (e.g. 4,8,4,8), if so, remove twins from remaining fields in row, column & block

	// Do we really have double twins now?
	var count;
	var idx;
	var x;

	if ( (foundTwin1 == true) && (foundTwin2 == true) ) {
		; // System.out.printf("Found 2 Twins for row %d: %d,%d,%d,%d (but are they *double* twins?)\n", row, twin1, twin2, twin3, twin4);

		if ( (twin1 == twin3) && (twin2 == twin4) ) {
			console.log("Found *Double* Twin for row %d: %2d,%2d,%2d,%2d\n", row, twin1, twin2, twin3, twin4);

			// TBD: subgrid: auch hier die twins löschen, falls die twins innerhalb eines blocks liegen
			if (convertxy2Subgrid(row, idxTwin1) == convertxy2Subgrid(row, idxTwin3)) {

				console.log("checkRow4Twins: *double* Twins found in same subgrid %d, delete twins as candidates for remaining 7 fields in subgrid!\n", convertxy2Subgrid(row, idxTwin1));

				// TESTEN !!
				removeTwinCandidatesInBlock(candidates, convertxy2Subgrid(row, idxTwin1), twin1, twin2, row, idxTwin1, row, idxTwin3);

				check4NackterEinerInBlock( candidates, convertxy2Subgrid(row, idxTwin1));

			}

			// Liegt der Doppelzwilling in einer Zeile, sind die beiden Ziffern als Kandidaten in den Restfeldern der Zeile zu tilgen,
			// aber NICHT für die beiden Feldern mit den Zwillingen als Kandidaten!!!
			
			removeTwinCandidatesInRow(candidates, row, twin1, twin2, idxTwin1, idxTwin3);

			check4NackterEinerInRow( candidates, row ); 


		}
	}
}




function checkColumn4Twins( col, candidates, candidateCount, twin1, twin2, twin3, twin4, idxTwin1, idxTwin3) {
	
	// Check for twins in col. If we find double twins they need to match, otherwise ....????

	var row;
	var colTwins=0;		// no. of twins found in row
	var i;
	var foundTwin1 = false;
	var foundTwin2 = false;

	// HashMap <Integer, Integer> mapTwins = new HashMap<>(); // Ausprobieren !!!

	// System.out.println("DEBUG: checkColumn4Twins" );

	for (row = 0; row < 9; row++) {
		if (candidateCount[row] == 2) {			// candidate[f] enthält die Anzahl verbliebener Kandidaten in Feld col der Zeile r
			colTwins++;
			
			console.log("Found twin candidate#%d in col %d: ", colTwins, col);
			
			for (i = 0; i < 9; i++) {
				if (candidates[row][col][i] !=0 ) {						
					console.log("%2d \r", candidates[row][col][i]);	
					if (twin1 == 0) { 
						twin1 = candidates[row][col][i];
						continue;							// continue oder break?
					}
					if ( (twin1 != 0) && (twin2 == 0) ) { 
						twin2 = candidates[row][col][i];
						idxTwin1 = row;						// idxTwin1 = column in row  where twin1&twin2 candidates were found
						foundTwin1 = true;
						continue;
					}
					if ( (twin2 != 0) && (twin3 == 0) ) {
						twin3 = candidates[row][col][i];
						if (twin3 != twin1) {				// Found double twin but twins do not match :-(
							twin3 = 0;
							colTwins--;
							continue;
						}
						continue;
					}
					if ( (twin3 != 0) && (twin4 == 0) ) {
						twin4 = candidates[row][col][i];
						if (twin4 != twin2) {
							twin4 = twin3 = 0;
							colTwins--;
							continue;
						}
						idxTwin3 = row;
						foundTwin2 = true;
						continue;
					}
				}
			}
			// System.out.println();
		}
	}


	// Check if the twins are double Twins (e.g. 4,8,4,8), if so, remove twins from remaining fields in row, column & block

	// Do we really have double twins now?

	if ( (foundTwin1 == true) && (foundTwin2 == true) ) {
		console.log("Found 2 Twins for col %d: %d,%d,%d,%d (but are they *double* twins?)\n", col, twin1, twin2, twin3, twin4);

		if ( (twin1 == twin3) && (twin2 == twin4) ) {
			console.log("checkColumn4Twins: found *double* Twin in col %d: %2d,%2d,%2d,%2d\n", col, twin1, twin2, twin3, twin4);

			// TBD: subgrid: auch hier die twins löschen, falls die twins innerhalb eines blocks liegen
			if (convertxy2Subgrid(idxTwin1, col) == convertxy2Subgrid(idxTwin3, col)) {

				console.log("checkColumn4Twins: found *double* Twins in same subgrid %d, delete twins as candidates for remaining 7 fields in subgrid!\n", convertxy2Subgrid(idxTwin1, col));

				// TESTEN !!
				removeTwinCandidatesInBlock(candidates, convertxy2Subgrid(idxTwin1, col), twin1, twin2, idxTwin1, col, idxTwin3, col);

				check4NackterEinerInBlock( candidates, convertxy2Subgrid(idxTwin1, col));
			}

			removeTwinCandidatesInColumn(candidates, col, twin1, twin2, idxTwin1, idxTwin3);

			check4NackterEinerInColumn( candidates, col );
		}						
	}
}


/* BIS HIER ! */

// public void checkBlock4Twins( int row, int[][][] candidates, int[]candidateCount, int twin1, int twin2, int twin3, int twin4, int idxTwin1, int idxTwin3) {

function checkBlock4Twins(  block, candidates, candidateCount) {
	
	// Check for twins in block. If we find double twins they need to match, otherwise ....????

	 var twin1, twin2, twin3, twin4;
	 var rowIdxTwin1, rowIdxTwin2;
	 var colIdxTwin1, colIdxTwin2;
	 var r, row;
	 var c, col;

	 var blockTwins = 0;		// no. of twins found in row
	 var i, k;
	 var foundTwin1 = false;
	 var foundTwin2 = false;

	row = subgridXY[block-1][0];
	col = subgridXY[block-1][1];

	// System.out.println("DEBUG: checkBlock4Twins" );

	k = 0;
	twin1 = twin2 = twin3 = twin4 = 0;
	colIdxTwin1 = colIdxTwin2 = 0;
	rowIdxTwin1 = rowIdxTwin2 = 0;

	for (r = row; r < (row+3); r++) {
		for (c = col; c < (col+3); c++) {
			if (candidateCount[k] == 2) {			// candidate[f] enthält die Anzahl verbliebener Kandidaten in Feld col der Zeile r
				blockTwins++;
				// System.out.printf("Found twin candidate#%d in Block %d: ", blockTwins, block);
				for (i = 0; i < 9; i++) {
					if (candidates[r][c][i] !=0 ) {						
						// System.out.printf("%2d ", candidates[r][c][i]);		

						if (twin1 == 0) { 
							twin1 = candidates[r][c][i];
							continue;							// continue oder break?
						}
						if ( (twin1 != 0) && (twin2 == 0) ) { 
							twin2 = candidates[r][c][i];
							rowIdxTwin1 = r;
							colIdxTwin1 = c;	
							foundTwin1 = true;
							continue;
						}
						if ( (twin2 != 0) && (twin3 == 0) ) {
							twin3 = candidates[r][c][i];
							if (twin3 != twin1) {				// Found double twin but twins do not match :-(
								twin3 = 0;
								blockTwins--;
								continue;
							}
							continue;
						}
						if ( (twin3 != 0) && (twin4 == 0) ) {
							twin4=candidates[r][c][i];
							if (twin4 != twin2) {
								twin4 = twin3 = 0;
								blockTwins--;
								continue;
							}
							rowIdxTwin2 = r;
							colIdxTwin2 = c;
							foundTwin2 = true;
							continue;
						}
					}
				}
				// System.out.println();
				k++;	//CHECK CHECK CHECK
			}
			//k++;		// 0..8		WRONG????
		}

	}


	// Check if the twins are double Twins (e.g. 4,8,4,8), if so, remove twins from remaining fields in block

	// Do we really have double twins now?

	if ( (foundTwin1 == true) && (foundTwin2 == true) ) {
		console.log("Found 2 Twins for block %d: %d,%d,%d,%d (but are they *double* twins?)\n", block, twin1, twin2, twin3, twin4);

		if ( (twin1 == twin3) && (twin2 == twin4) ) {
			console.log("checkBlock4Twins: found *double* Twin in BLOCK %d: %2d,%2d,%2d,%2d\n", block, twin1, twin2, twin3, twin4);

			removeTwinCandidatesInBlock(candidates, block, twin1, twin2, rowIdxTwin1, colIdxTwin1, rowIdxTwin2, colIdxTwin2);

			check4NackterEinerInBlock( candidates, block );
		}						
	}
}



// Twin-Methode:	Count the number of possible candidates for each field in a row, 2 remaining candidates means we've got a twin

function countCandidatesRow(candidates, row, candidateCount) {

	var i;
	var col;

	// Count the number of possible candidates for each field, 2 remaining candidates means we've got a twin
	for (col = 0; col < 9; col++) {	
		candidateCount[ col ] = 0;
		if (getPuzzleValue(row, col) == 0) {			
			for (i = 0; i < 9; i++) {
				if (candidates[row][col][i] !=0 ) {			
					candidateCount[ col ]++;
				}
			}
		}
	}
	// System.out.printf("Candidate count for row %d: ", row);
	// showArray(candidateCount);
}

/*
 * Twin-Methode:	Count the number of possible candidates for each field in a column, 2 remaining candidates means we've got a twin
 */
function countCandidatesColumn( candidates, col, candidateCount) {

	var i;
	var row;

	// Count the number of possible candidates for each field, 2 remaining candidates means we've got a twin
	for (row = 0; row < 9; row++) {	
		candidateCount[row] = 0;
		if (getPuzzleValue(row, col) == 0) {		// empty puzzle field r,c			
			for (i = 0; i < 9; i++) {
				if (candidates[row][col][i] !=0 ) {			
					candidateCount[row]++;
				}
			}
		}
	}
	// System.out.printf("Candidate count for col %d: ", col);
	// showArray(candidateCount);
}


// Twin-Methode:	Count the number of possible candidates for each field in a block, 2 remaining candidates means we've got a twin
function countCandidatesBlock(candidates, block, candidateCount) {
	//TBD: not really tested yet

	var i;
	var c, col;
	var r, row;

	row = subgridXY[block-1][0];
	col = subgridXY[block-1][1];

	// Count the number of possible candidates for each field, 2 remaining candidates means we've got a twin
	var idx = 0;
	for (r = row; r < (row + 3); r++) {
		for (c = col; c < (col + 3); c++) {
			candidateCount[idx] = 0;
			if (getPuzzleValue(r, c) == 0) {	// empty puzzle field r,c		
				for (i = 0; i < 9; i++) {
					if (candidates[r][c][i] !=0 ) {			
						candidateCount[idx]++;
					}
				}
			}
			idx++;				// CHECK!?
		}

		// System.out.printf("Candidate count for block %d: ", block);
		// showArray(candidateCount);
	}
}


// Twin-Methode: streiche die Twins in Zeile r
// Achtung: NICHT gestrichen werden die twins dort, wo sie als twin candidates gefunden wurden

function removeTwinCandidatesInRow( candidates, row, twin1, twin2, idxTwin1, idxTwin3) {

	var col;
	for (col = 0; col < 9; col++) {
		if ( (col != idxTwin1) && (col != idxTwin3) ) {
			candidates[row][col][twin1-1] = 0;
			candidates[row][col][twin2-1] = 0;
		}
	}
}

// Twin-Methode: streiche die Twins in Spalte c
// Achtung: NICHT gestrichen werden die twins dort, wo sie als twin candidates gefunden wurden
function removeTwinCandidatesInColumn( candidates, col, twin1, twin2, idxTwin1, idxTwin3) {

	var row;
	for (row = 0; row < 9; row++) {
		if ( (row != idxTwin1) && (row != idxTwin3) ) {
			candidates[row][col][twin1-1] = 0;
			candidates[row][col][twin2-1]  =0;
		}
	}
}


// Twin-Methode: streiche die Twins in Block b
// Achtung: NICHT gestrichen werden die twins dort, wo sie als twin candidates gefunden wurden

function removeTwinCandidatesInBlock( candidates, block, twin1, twin2, rowIdxTwin1, colIdxTwin1, rowIdxTwin2, colIdxTwin2) {

	var r, row;
	var c, col;

	row = subgridXY[block-1][0];
	col = subgridXY[block-1][1];

	for ( r =row; r < (row + 3); r++) {
		for (c = col; c < (col + 3); c++) {
			// ! Only remove twin1 and twin2 from max. 7 of 9 fields in block
			if ( ! (((r==rowIdxTwin1) && (c==colIdxTwin1)) || ((r==rowIdxTwin1) && (c==colIdxTwin1))) ) {
				candidates[r][c][twin1-1] = 0;
				candidates[r][c][twin2-1] = 0;
			}
		}
	}

}

// Twin-Methode: streiche 1 Kandidaten in Spalte c
function removeCandidateInColumn( candidates, col, x) {

	var row;
	for (row = 0; row < 9; row++) {
		candidates[row][col][x-1] = 0;
	}
}

// Twin-Methode: streiche 1 Kandidaten in Zeile r
function removeCandidateInRow( candidates, row, x) {

	var col;
	for (col = 0; col < 9; col++) {
		candidates[row][col][x-1] = 0;
	}
}

// Twin-Methode: streiche 1 Kandidaten in Block block
function removeCandidateInBlock( candidates, block, x) {
	var r, row;
	var c, col;
	row = subgridXY[block-1][0];
	col = subgridXY[block-1][1];
	
	// Das hatten wir doch schon mal: for (r = row; r < (row + 3); row++) {
	for (r = row; r < (row + 3); r++) {
		for (c = col; c <(col + 3); c++) {
			candidates[r][c][x-1] = 0;
		}
	}
}


// Twin-Methode: sucht nach einem 'nacktem Einer' und - falls gefunden - setzt den verbliebenen Wert ein und streicht den Kandidatem in allen Einheitem
function check4NackterEinerInRow(candidates, row) {
	var rc = false;
	var col;
	var block;
	var count;
	var i;
	var idx;
	var x;

	console.log("DEBUG: check4NackterEinerInRow: %d", row );

	for (col = 0; col < 9; col++) {
		count = 0;
		idx = 0;
		for (i = 0; i < 9; i++) {
			if (candidates[row][col][i] != 0) {
				count++;
				idx=i;
			}
		}

		// falls count genau 1 ist, ist nur noch eine mögliche Zahl übrig
		// If count is 1 only 1 possible candidate remains 
		if ( count == 1 ) {
			x = candidates[row][col][idx];
			console.log("'NACKTER EINER'! ROW %d, column %d, candidates[%d][%d][%d]=%d\n", row, col, row, col, idx, x);
			
			solvedWithDirectTwin++;
			console.log("solvedWithDirectTwin: %d\n", solvedWithDirectTwin);
			document.getElementById("solvedWithDirectTwin").innerHTML = "Solved with Direct Twin: " +  solvedWithDirectTwin;	
			
			
			setPuzzleValue(row, col, x);
			setSolutionMatrix(row, col, x, DIRECT_TWIN);			
			showSudokuPuzzleCompact();
			removeCandidateInColumn(candidates, col, x);
			removeCandidateInRow(candidates, row, x);
			
			block = convertxy2Subgrid(row, col);
			removeCandidateInBlock(candidates, block, x);
			rc = true;

		}
	}
	return rc;
}

// Twin-Methode: sucht nach einem 'nacktem Einer' in einer Spalte und - falls gefunden - setzt den verbliebenen Wert ein und streicht den Kandidatem in allen Einheitem
function check4NackterEinerInColumn( candidates, col) {

	var rc = false;
	var row;
	var block;
	var count;
	var i;
	var idx;
	var x;

	console.log("DEBUG: check4NackterEinerInColumn: %d", col );

	for (row = 0; row < 9; row++) {
		count = 0;
		idx = 0;
		for (i = 0; i < 9; i++) {
			if (candidates[row][col][i] != 0) {
				count++;
				idx=i;
			}
		}

		// falls count genau 1 ist, ist nur noch eine mögliche Zahl übrig
		// If count is 1 only 1 possible candidate remains 
		if ( count == 1 ) {
			x = candidates[row][col][idx];
			console.log("'NACKTER EINER'! Row %d, COLUMN %d, candidates[%d][%d][%d]=%d\n", row, col, row, col, idx, x);
			setPuzzleValue(row, col, x);
			setSolutionMatrix(row, col, x, DIRECT_TWIN);			
			showSudokuPuzzleCompact();

			removeCandidateInColumn(candidates, col, x);
			removeCandidateInRow(candidates, row, x);
			block=convertxy2Subgrid(row, col);
			removeCandidateInBlock(candidates, block, x);
			rc = true;

		}
	}
	return rc;
}


// Twin-Methode: sucht nach einem 'nacktem Einer' in einem Block und - falls gefunden - setzt den verbliebenen Wert ein und streicht den Kandidatem in allen Einheitem
function check4NackterEinerInBlock(candidates, block) {

	 var rc = false;
	 var r, row;
	 var c, col;
	 var b;
	 var count;
	 var i;
	 var idx;
	 var x;
	 const NACKTER_EINER = 1;

	row = subgridXY[block-1][0];
	col = subgridXY[block-1][1];

	// System.out.println("DEBUG: check4NackterEinerInBlock" );

	for (r = row; r < (row + 3); r++) {
		for(c = col; c <(col + 3); c++) {
			count = 0;
			idx = 0;
			for (i = 0; i < 9; i++) {
				if (candidates[r][c][i] != 0) {
					count++;
					idx = i;
				}
			}

			// falls count genau 1 ist, ist nur noch eine mögliche Zahl übrig
			// If count is 1 only 1 possible candidate remains 
			if ( count == NACKTER_EINER ) {
				x = candidates[r][c][idx];
				console.log("'NACKTER EINER' in BLOCK %d! Row %d, Column %d, candidates[%d][%d][%d]=%d\n", block, r, c, r, c, idx, x);
				setPuzzleValue(r, c, x);
				setSolutionMatrix(r, c, x, DIRECT_TWIN);
				showSudokuPuzzleCompact();

				removeCandidateInColumn(candidates, c, x);
				removeCandidateInRow(candidates, r, x);
				block=convertxy2Subgrid(r, c);
				removeCandidateInBlock(candidates, block, x);
				rc = true;

			}
		}
	}
	return rc;
}


/*
 * METHODE DES DIREKTEN ZWILLINGS, TWIN METHODE, DOPPEL-ZWILLING:	IN ARBEIT !!	
 */

// Twin-Methode (Doppelzwilling): streiche die Kandidaten in Zeile, die schon in Spalte 0..8 der Zeile existieren

function checkRow4Candidates( row, p ) {
	// int[] p zeigt auf rowCandidates[row][]
	var col;
	var x;
	for (col = 0; col < 9; col++) {
		x = getPuzzleValue(row, col);
		if (x != 0) {		// Kandidat gibt es schon, also streichen (auf 0 setzen)
			p[x-1] = 0;	// remove candidate
		} 
	}
}

// Twin-Methode (Doppelzwilling): streiche die Kandidaten in Zeile, die schon existieren
function checkColumn4Candidates( col, p ) {
	// int[] p zeigt auf columnCandidates[col][]
	var row;
	var x;
	for (row = 0; row < 9; row++) {
		x = getPuzzleValue(row, col);
		if (x != 0) {
			p[x-1] = 0;	// remove candidate
		}
	}
}

// Twin-Methode (Doppelzwilling): streiche die Kandidaten im 3x3 Block, die schon existieren
function checkSubgrid4Candidates( subgrid, p) {
	// int[] p zeigt auf subgridCandidates[subgrid-1][]
	var r, row;
	var c, col;
	var x;

	row = subgridXY[subgrid-1][0];
	col = subgridXY[subgrid-1][1];

	for (r = row; r < (row+3); r++) {
		for (c = col; c < (col+3); c++) {
			x = getPuzzleValue(r, c);
			// System.out.printf("row=%d, col=%d, x=%d\n", row, col, x);
			if (x != 0) {
				p[x-1] = 0;		// remove candidate
			}
		}
	}
}






/*
 *  findAllCandidates:	die komplette Matrix der möglichen Kandidaten für jedes Feld ermitteln
 *  called by SolveWithDoubleTwins
 *  called by SolveWithTriples
 */
function findAllCandidates( candidates ) {
	// Compute remaining candidates for each field in puzzle
	// int[][][] candidates = new int[9][9][9];
	var r;
	var c;
	var subgrid;
	var i;
	var possibleCandidates = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];		// possible candidates for a single field

	console.log("DEBUG: findAllCandidates" );

	for (r = 0; r < 9; r++) {
		for (c = 0; c < 9; c++) {
			// for each field in row, col compute possible candidates
			if ( getPuzzleValue(r, c) == 0) {		// value of puzzle at r, c is not set	(empty field)			// 0 = not occupied by any number 1..9

				// Initialize possibleCandidates
				for (i = 0; i < 9; i++)
					possibleCandidates[i] = i + 1;

				// CHECK ROW r, COLUMNS 0..8, eliminate candidates
				checkRow4Candidates(r, possibleCandidates);

				// CHECK COLUMN c, ROWS 0..8, eliminate candidates
				checkColumn4Candidates(c, possibleCandidates);

				// CHECK subgrid, eliminate candidates
				subgrid = convertxy2Subgrid(r, c);		// Convert r, c to subgrid number
				checkSubgrid4Candidates(subgrid, possibleCandidates);

				// Copy remaining candidates to candidates[r][c]
				for (i = 0; i < 9; i++) {
					// console.log("DEBUG r=%d,c=%d,i=%d,possibleCandidates[%d]=%d\n", r,c,i,i,possibleCandidates[i]);
					candidates[r][c][i] = possibleCandidates[i];
				}
				// showArray(candidates[r][c]);
			}
		}
	}
}

	/*
	 *  updateAllCandidates:
	 *  
	 */
	function updateAllCandidates(candidates) {

		var r;
		var c;
		var subgrid;
		var i;
		var possibleCandidates = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];		// possible candidates for a single field

		console.log("DEBUG: updateAllCandidates" );

		for (r = 0; r < 9; r++) {
			for (c = 0; c < 9; c++) {
				// for each field in row, col compute possible candidates
				if ( getPuzzleValue(r, c) == 0) {		// value of puzzle at r, c is not set	(empty field)			// 0 = not occupied by any number 1..9

					// ***READ*** possible candidates which were modified
					for (i = 0; i < 9; i++) {
						possibleCandidates[i] = candidates[r][c][i];		// 
					}
										
					// CHECK ROW r, COLUMNS 0..8, eliminate candidates
					checkRow4Candidates(r, possibleCandidates);

					// CHECK COLUMN c, ROWS 0..8, eliminate candidates
					checkColumn4Candidates(c, possibleCandidates);

					// CHECK subgrid, eliminate candidates
					subgrid = convertxy2Subgrid(r, c);		// Convert r, c to subgrid number
					checkSubgrid4Candidates(subgrid, possibleCandidates);

					// WRITE remaining candidates to candidates[r][c]
					for (i=0; i<9; i++) {
						candidates[r][c][i] = possibleCandidates[i];
					}
					// showArray(candidates[r][c]);
				}
			}
		}
	}




