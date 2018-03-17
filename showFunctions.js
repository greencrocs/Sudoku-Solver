
// INIT solutionMatrix
function initSolutionMatrix( puzzle, solutionMatrix ) {
	/*
	 * solutionMatrix is a 9x9x2 3D Array containing row, column, preset field/ solved field, solving method number
	 *
	 */
	 console.log("initSolutionMatrix");
	 var r, c, i;
	 for ( r = 0; r < 9; r++ ) {
		 for ( c = 0; c < 9; c++ ) {
			 x = getPuzzleValue( r, c );
			 solutionMatrix[r][c][0] = x;	// puzzle value
			 if ( x !== 0 ) {
				 solutionMatrix[r][c][1] = PRESET_FIELD;	// type = PRESET_FIELD
			 } else {
				 solutionMatrix[r][c][1] = UNSOLVED_FIELD;	// type = UNSOLVED_FIELD
			 }
		 }
	 }
}	

function showSolutionMatrix( solutionMatrix ) {
	var r, c, x, t;
	
	for (r = 0; r < 9; r++) {
		for (c = 0; c < 9; c++) {
			x = solutionMatrix[r][c][0];
			t = solutionMatrix[r][c][1];
			switch( t ) {
				
				case UNSOLVED_FIELD:
					console.log("row %d, col %d: UNSOLVED FIELD", r, c);
					break;
				case PRESET_FIELD:
					console.log("row %d, col %d: %d, PRESET FIELD", r, c, x);
					break;
				case METHODICAL_SEARCH:
					console.log("row %d, col %d: %d, METHODICAL SEARCH", r, c, x);
					break;
				case NACKTER_EINER:
					console.log("row %d, col %d: %d, NACKTER EINER", r, c, x);
					break;
				case VERSTECKTER_EINER:
				console.log("row %d, col %d: %d, VERSTECKTER EINER", r, c, x);
					break;
				case DIRECT_TWIN:
					console.log("row %d, col%d: %d, DIRECT TWIN", r, c, x);
					break;
				case TRIPLES:
					console.log("row %d, col %d: %d, TRIPLES", r, c, x);
					break;
				case COMPLETE_RCB:
					console.log("row %d, col %d: %d, COMPLETE RCB", r, c, x);
					break;
				default:
					console.log("??? row %d, col%d: %d, ???", r, c, x);
					break;
			}
		}
	}
}
	
	

function setSolutionMatrix( r, c, x, type) {
	solutionMatrix[r][c][0] = x;	// cell solution
	solutionMatrix[r][c][1] = type;	// solved with METHODICAL_SEARCH, NACKTER_EINER, ...
}
	
	
	
	function showSudokuPuzzleCandidateCount(candidates) {
		
		var row, col;
		var i;
		console.log("\nCandidate Count for Sudoku %s\n", getSudokuDescription());

		for ( row = 0; row < 9; row++) {
			console.log("\n");
			for (col = 0; col < 9; col++) {
				// System.out.printf(("%2d "), getPuzzleValue(row, col));
				console.log(("%2d "), getCandidateCount4Field(candidates, row, col));
				if ((col + 1) % 3 == 0) {
					console.log("  ");
				}
			}
			if ((row + 1) % 3 == 0 ) {
				console.log("\n");
			}
		}
		console.log("\n");
	}

	function getCandidateCount4Field(candidates, row, col) {
		// TODO Auto-generated method stub
		var count = 0;
		for (var i = 0; i < 9; i++) {
			if (candidates[row][col][i] !=0 ) {
				count++;
			}
		}
		return count;
	}


	function showSudokuCandidatesGrid(candidates) {
		/**
		 * Show candidates grid with 9x9 grid for each field 
		 * Row 0 would look like:
		 * 123 123 ...
		 * 456 456 ...
		 * 789 789 ...
		 * 
		 * +------+
 		 * |   1  |
		 * |   1  |
		 * |   1  |
		 * +------+
		 * 
		 * 
		 */
		var row, col;
		var i;
		

		for (row = 0; row < 9; row++) {
			console.log("+------+------+------+------+------+------+------+------+------+\n");
			for (i = 0; i < 9; i += 3) {
				var rowString = "";
				for (col = 0; col < 9; col++) {

					// 1. i=0: 1. Zeile Kandidaten ausgeben, also 123 123 123 123 123 123 123 123 123
					// 2. i=3: 2. Zeile Kandidaten ausgeben, also 456 456 ...
					// 3. i=6: 3. Zeile Kandidaten ausgeben, also 789 789 ...
					var c1 = " ";
					var c2 = " ";
					var c3 = " ";
					if (candidates[row][col][i] != 0) {
						c1 = "" + candidates[row][col][i];
					}
					if (candidates[row][col][i+1] != 0) {
						c2 = "" + candidates[row][col][i+1];
					}
					if (candidates[row][col][i+2] != 0) {
						c3 = "" + candidates[row][col][i+2];
					}
					
					rowString += "|" + c1 + " " + c2 + " " + c3 + " ";

					// console.log("|%1s %1s %1s ",	c1, c2, c3);

				}
				// console.log("|\n");
				console.log(rowString + "|\n");
			}
		}
		console.log("+------+------+------+------+------+------+-------+-----+------+\n");
	}