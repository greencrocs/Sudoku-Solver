/*
 * PREP Functions (HTML, ...)
 */

 // Prep Sudoku Table with HTML
 
 /* OLD
function prepSudokuTable() {
	var r, c;
	var hdr;
	var cap = "SuDoKu Puzzle: " + getSudokuDescription();
	var caption = "<caption>" + cap + "</caption>";
	tbl = "<table id='sudokuTable'>" + caption;	// start table
	var row;
	
	// Prepare HTML header with Col# C0..C8
	hdr = "<tr><th></th>"; // 
	for (c=0; c<9; c++) {
	  hdr = hdr + "<th>" + "C" + c + "</th>";
	}

	hdr = hdr + "</tr>";
	tbl = tbl + hdr;
	var x;
	
	// Prepare rows with leading Row# R0..R8
	// ToDo: R0 .. R9 bold, black same as hdr C0 .. C1
	for (r=0; r<9; r++) {
	  row = "<tr>" + "<td>" + "R" + r + "</td>";	  // row = "<tr>";			    // start row r
		for (c=0; c<9; c++) {
		  x = getPuzzleValue(r, c);
		  if (x===0) {
		    x = " ";
		  }
			row = row + "<td>" +  x + "</td>";
		}
		row = row + "</tr>";		// end row
		// console.log(row);
		tbl = tbl + row;
	}
	tbl = tbl + "</table>";			// end table
	
	if (debug == true) 	console.log(tbl);
	
	return(tbl);
}
*/

// NEW: Prep Sudoku Grid with HTML
function prepSudokuGrid() {
	var r, c;
	var cap = "SuDoKu Puzzle: " + getSudokuDescription();
	var caption = "<caption>" + cap + "</caption>";
	tbl = "<table id='sudokuGrid'>";		//  + caption;	// start table
	var row = "";
	
	var x;
	
	/*
	Generate HTML code like this:
	<tr>
          <td><input id="cell-0"  type="text" value="5" disabled></td>
          <td><input id="cell-1"  type="text" value="3" disabled></td>
          <td><input id="cell-2"  type="text"></td>
	*/
	var cellid = "";
	var cellno = 0;
	for (r=0; r<9; r++) {
	  row = "<tr>";	  		// start row with "<tr>"			    // start row r
		for (c = 0; c < 9; c++) {
		  x = getPuzzleValue(r, c);
		  // if (x===0) {
		  //  x = " ";
		  // }
		  cellid = "cell-" + cellno++;		// cell-0 .. 99
		  if ( x == 0 ) {
			  row = row + "<td><input id='" + cellid + "'" + " type='number'></td>";
		  } else {
		     row = row + "<td><input id='" + cellid + "'" + " type='number' value=" + x + " disabled></td>" ;
		  }
		  
		  
		  
		}
		row = row + "</tr>";	// end row with "</tr>"
		if (debug == true) console.log(row);
		tbl = tbl + row;
	}
	tbl = tbl + "</table>";		// end table
	
	if (debug == true) 	console.log(tbl);
	
	return(tbl);
}

// NEW: Prep Sudoku Grid with HTML
function prepSolvedSudokuGrid() {
	var r, c;
	var cap = "SuDoKu Puzzle: " + getSudokuDescription();
	var caption = "<caption>" + cap + "</caption>";
	tbl = "<table id='sudokuGrid'>";		//  + caption;	// start table
	var row = "";
	
	var x;
	var t;
	
	/*
	Generate HTML code like this:
	<tr>
          <td><input id="cell-0"  type="text" value="5" disabled></td>
          <td><input id="cell-1"  type="text" value="3" disabled></td>
          <td><input id="cell-2"  type="text"></td>
	*/
	var cellid = "";
	var cellno = 0;
	for (r=0; r<9; r++) {
	  row = "<tr>";	  		// start row with "<tr>"			    // start row r
		for (c = 0; c < 9; c++) {
		  x = getPuzzleValue(r, c);
		  t = solutionMatrix[r][c][1];		// solving Method METHODICAL_SEARCH, ...
		  // if (x===0) {
		  //  x = " ";
		  // }
		  cellid = "cell-" + cellno++;		// cell-0 .. 99
		  if ( x == 0 ) {
			  row = row + "<td><input id='" + cellid + "'" + " type='text'></td>";
		  } else {
		     row = row + "<td><input id='" + cellid + "'" + " type='text' value=" + x + " methodicalSearch></td>" ;
		  }
		  
		  
		  
		}
		row = row + "</tr>";	// end row with "</tr>"
		if (debug == true) console.log(row);
		tbl = tbl + row;
	}
	tbl = tbl + "</table>";		// end table
	
	if (debug == true) 	console.log(tbl);
	
	return(tbl);
}

function prepSudokuList() {
	// Prepare Sudoku list to choose from in index.html
	
	var optionList = "<select id='sudokuList'>";
	
	for (var i = 0; i < puzzleObjList.length; i++) {
		optionList = optionList + "<option>" + puzzleObjList[i].puzzleDescription + "</option>";
	}
	optionList += "</select>";
	console.log(optionList);
	return(optionList);
}

