	/*
	* Complete Row, Column, Block (RCB)
	*
	*/
		
	function completeRows() {
		// if only 1 value is missing in a row, complete the row
		var r, c;
		var colSave;
		var i;
		var x;
		var idx;
		var count;
		var occupiedFields = [ -1, -1, -1, -1, -1, -1, -1, -1, -1 ];	// -1 = not occupied, 1..9 = occupied

		// Check all rows
		colSave=0;
		idx=0;
		for (r=0; r<9; r++) {
			for (i=0; i<9; i++) { 
				occupiedFields[i]=-1;	// init occupiedFields for each new row r
			}	
			for (c=0; c<9; c++) {
				// x = Puzzle[r][c];
				x = getPuzzleValue(r, c);
				if (x !== 0) {			// 1..9 or -1 = not occupied
					occupiedFields[x-1] = x;
				}
				else {
					colSave = c;	// remember column of missing value
				}
			}

			// occupiedFields is now something like 1 2 3 4 5 6 7 -1  9 or -1 -1 3 4 5 6 7 -1 9
			// System.out.printf("DEBUG completeRows(): occupiedFields:\n");
			// showArray(occupiedFields);

			// if only one element of occupied fields = -1 we can add the last missing value in row r 
			count=0;
			for (i=0; i<9; i++) {
				if (occupiedFields[i] === -1) {
					count++;
					idx=i;				// save index 
				}
			}

			// if count == 1 exactly 1 field is empty which we can fill with the last missing value, value is defined by idx+1
			if (count === 1) {
				console.log("completeRows(): Row %d can be completed with missing value %d at column %d\n", r, idx+1, colSave);
				solvedWithCompleteRCB++;
				document.getElementById("solvedWithCompleteRCB").innerHTML = "Solved with Complete RCB: " +  solvedWithCompleteRCB;	

				
				setPuzzleValue(r, colSave, idx+1);			// set value in puzzle at r, colSave))
			} else {
				; //System.out.printf("DEBUG completeRows(): Row %d can not be completed, no. of empty fields=%d\n", r, count);
			}
		}
	}

	function completeColumns() {
		// if only 1 value is missing in a column, complete the column
		var r, c;
		var row;
		var rowSave;
		var i;
		var x;
		var idx;
		var count;
		var occupiedFields = [ -1, -1, -1, -1, -1, -1, -1, -1, -1 ];	// -1 = not occupied, 1..9 = occupied

		// Check all columns
		rowSave=0;
		idx=0;
		for (c=0; c<9; c++) {
			for (i=0; i<9; i++) { 
				occupiedFields[i]=-1;	// init occupiedFields for each new row r
			}	
			for (r=0; r<9; r++) {
				// x = Puzzle[r][c];
				x=getPuzzleValue(r, c);
				if (x !== 0) {			// 1..9 or -1 = not occupied
					occupiedFields[x-1] = x;		
				} else {
					rowSave = r;	// remember row of missing value
				}
			}

			// occupiedFields is now something like 1 2 3 4 5 6 7 -1  9 or -1 -1 3 4 5 6 7 -1 9
			// System.out.printf("DEBUG completeColumns(): occupiedFields:\n");
			// showArray(occupiedFields);

			// if only one element of occupied fields = -1 we can add the last missing value in col c 
			count=0;
			for (i=0; i<9; i++) {
				if (occupiedFields[i] == -1) {
					count++;
					idx=i;				// save index 
				}
			}

			// if count == 1 exactly 1 field is empty which we can fill with the last missing value, value is defined by idx +1
			if (count === 1) {
				console.log("completeColumns(): Column %d can be completed with missing value %d at row %d\n", c, idx+1, rowSave);
				setPuzzleValue(rowSave, c, idx+1);	// set value in puzzle at rowSave, c))
			} else {
				; // System.out.printf("DEBUG completeColums(): Column %d can not be completed, no of empty fields=%d\n", c, count);
			}
		}
	}

	function completeSubgrids() {
		// if only 1 value is missing in a subgrid, complete the subgrid
		var r, c;
		var row, col;
		var rowSave, colSave;
		var s, subgrid;
		var i, j;
		var x;
		var idx;
		var count;
		var subgridOccupiedFields = [ 	
				[-1, -1, -1], 
				[-1, -1, -1], 
				[-1, -1, -1]
		]; 
		var idxOccupiedFields;
		var subgridrow, subgridcol;

		var occupiedFields = [ -1, -1, -1, -1, -1, -1, -1, -1, -1 ];	// -1 = not occupied, 1..9 = occupied

		// Check all subgrids
		row=0;
		idx=0;
		rowSave=colSave=0;

		// SUBGRIDS
		for (s=1; s<=9; s++) {
			row = subgridXY[s-1][0];
			col = subgridXY[s-1][1];
			// System.out.printf("block=%d, start row=%d, col=%d\n", s, row, col);


			// init occupiedFields
			for (i=0; i<9; i++) { 
				occupiedFields[i]=-1;	// init occupiedFields for each new row r
			}	
			// OR
			// init subgrid
			//for (i=0; i<3; i++)
			//	for (j=0; j<3; j++)
			//		subgridOccupiedFields[i][j]=1;
			rowSave = -1;
			colSave = -1;
			for (r=row; r<(row+3); r++) {
				for (c=col; c<(col+3); c++ ) {
					// x = Puzzle[r][c];
					x = getPuzzleValue(r, c);
					if (x != 0) {			// 1..9 or -1 = not occupied
						// occupiedFields[(r-row)*3 + c -col] = x;
						occupiedFields[x-1] = x;
						// subgridOccupiedFields[r-row][c-col] = x;
					} else {
						// idxOccupiedFields = (r-row)*3 + c -col;		// remember index of missing value 
						rowSave = r;								// remember row of missing value
						colSave = c; 								// remember col of missing value
					}
				}
			}

			// occupiedFields is now something like 1 2 3  -1 5 6  7 8 9, so value 4 is missing
			// System.out.printf("DEBUG completeSubgrids(): occupiedFields:\n");
			// showArray(occupiedFields);

			// if only one element of occupied fields = -1 we can add the last missing value in subgrid  
			count=0;
			for (i=0; i<9; i++) {
				if (occupiedFields[i] === -1) {
					count++;
					idx=i;				// save index 
				}
			}


			// if count == 1 exactly 1 field is empty which we can fill with the last missing value, value is defined by idx +1
			if (count === 1) {
				console.log("completeSubgrid(): Subgrid %d can be completed with missing value %d at row %d, col %d\n", s, idx+1, rowSave, colSave);
				setPuzzleValue(rowSave, colSave, idx+1);			// set value in puzzle at row, c))
				setSolutionMatrix(rowSave, colSave, idx+1, COMPLETE_RCB);
			} else {
				; // System.out.printf("DEBUG completeSubgrids(): Subgrid %d can not be completed, no of empty fields=%d\n", s, count);
			}
		}
	}

