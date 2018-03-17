
// GLOBAL Variables

// debug true/false?
var debug;					// boolean, is set  in index.html

var puzzle = emptyPuzzle;				// selected puzzle from ...
var selectedPuzzle;
var description = "Empty Sudoku Puzzle";			// puzzle description
var methodName = "MethodName";
var solvedNo = -1;

var solvedMatrix;

// CONSTANTS
const SOLVED	= true;
const NOTSOLVED	= false;

const	PRESET_FIELD		= 	-1;
const	UNSOLVED_FIELD		=	0;
const 	METHODICAL_SEARCH	=	1;
const	NACKTER_EINER		=	2;
const 	VERSTECKTER_EINER	=	3;
const	DIRECT_TWIN			=	4;
const	TRIPLES				=	5;
const	COMPLETE_RCB		=	10;
	
// Test
var methodAndPuzzleValue = "methodAndPuzzleValue";	
	

/*
 * List of Puzzle Object, each object contains
 *	puzzleDescription:	String
 *	puzzleData:			puzzle
 *	puzzleStatus:		SOLVED | NOTSOLVED
 *	puzzleStatistics:	tbd
 *
 */	
var puzzleObjList =  [ 
  { puzzleDescription: "NW Puzzle 18-01-09 schwer", puzzleData: nwPuzzle180109schwer     },
  { puzzleDescription: "nwPuzzle171209schwer",  	puzzleData: nwPuzzle171209schwer     },
  { puzzleDescription: "nwPuzzle171209schwer_bv",  	puzzleData: nwPuzzle171209schwer_bv     },
  { puzzleDescription: "nwPuzzle171124mittel",  	puzzleData: nwPuzzle171124mittel     },
  { puzzleDescription: "nwPuzzle171122schwer",  	puzzleData: nwPuzzle171122schwer     },
  { puzzleDescription: "nwPuzzle171115rechts",  	puzzleData: nwPuzzle171115rechts     },
  { puzzleDescription: "nwPuzzle171115schwer",  	puzzleData: nwPuzzle171115schwer     },
  { puzzleDescription: "nwPuzzle171114schwer",  	puzzleData: nwPuzzle171114schwer     },
  { puzzleDescription: "nwPuzzle171109schwer",  	puzzleData: nwPuzzle171109schwer     },
  { puzzleDescription: "nwPuzzle171109leicht",  	puzzleData: nwPuzzle171109leicht     },
  { puzzleDescription: "nwPuzzle171108mittel",  	puzzleData: nwPuzzle171108mittel     },
  { puzzleDescription: "nwPuzzle171107schwer",  	puzzleData: nwPuzzle171107schwer     },
  { puzzleDescription: "nwPuzzle171106schwer",  	puzzleData: nwPuzzle171106schwer     },
  { puzzleDescription: "nwPuzzle171103mittel",  	puzzleData: nwPuzzle171103mittel     },
  { puzzleDescription: "nwPuzzle171031schwer",  	puzzleData: nwPuzzle171031schwer     },
  { puzzleDescription: "nwPuzzle171031leicht",  	puzzleData: nwPuzzle171031leicht     },
  { puzzleDescription: "nwPuzzle171018schwer",  	puzzleData: nwPuzzle171018schwer     },
  { puzzleDescription: "nwPuzzle170411extraschweroben",  puzzleData: nwPuzzle170411extraschweroben     },
  { puzzleDescription: "nwPuzzle170411schweroben",  puzzleData: nwPuzzle170411schweroben     },
  { puzzleDescription: "nwPuzzle170411mitteloben",  puzzleData: nwPuzzle170411mitteloben     },
  { puzzleDescription: "nwPuzzle170403mittel",  	puzzleData: nwPuzzle170403mittel     },
  { puzzleDescription: "nwPuzzle170403schwer",  	puzzleData: nwPuzzle170403schwer     },
  { puzzleDescription: "nwPuzzle170325leicht",  	puzzleData: nwPuzzle170325leicht     },
  { puzzleDescription: "nwPuzzle170325schwer",  	puzzleData: nwPuzzle170325schwer  	 },
  { puzzleDescription: "nwPuzzle170302leicht",  	puzzleData: nwPuzzle170302leicht     },
  { puzzleDescription: "nwPuzzle170302schwer",  	puzzleData: nwPuzzle170302schwer     },
  { puzzleDescription: "nwPuzzle170225extraschweroben",  puzzleData: nwPuzzle170225extraschweroben     },
  { puzzleDescription: "nwPuzzle170225schweroben",  puzzleData: nwPuzzle170225schweroben     },
  { puzzleDescription: "nwPuzzle170225mitteloben",  puzzleData: nwPuzzle170225mitteloben     },
  { puzzleDescription: "nwPuzzle170223mittel",  	puzzleData: nwPuzzle170223mittel, puzzleStatus:	NOTSOLVED    },
  { puzzleDescription: "nwPuzzle170222leicht",  	puzzleData: nwPuzzle170222leicht, puzzleStatus:	SOLVED      },
  { puzzleDescription: "nwPuzzle170222schwer",  	puzzleData: nwPuzzle170222schwer, puzzleStatus:	SOLVED      },
  { puzzleDescription: "nwPuzzle170220mittel",  	puzzleData: nwPuzzle170220mittel, puzzleStatus:	SOLVED      },
  { puzzleDescription: "nwPuzzle170220schwer",  	puzzleData: nwPuzzle170220schwer, puzzleStatus:	SOLVED      },
  { puzzleDescription: "nwPuzzle170217leicht",  	puzzleData: nwPuzzle170217leicht, puzzleStatus:	SOLVED      },
  { puzzleDescription: "nwPuzzle170217schwer",  	puzzleData: nwPuzzle170217schwer, puzzleStatus:	SOLVED      },

  { puzzleDescription: "Barry170320extreme",    		puzzleData: Barry170320extreme, puzzleStatus:	NOTSOLVED       },
  { puzzleDescription: "Denver Post 17-03-19 *****",	puzzleData: DP170319_DR5, 	puzzleStatus:	SOLVED     },
  { puzzleDescription: "Denver Post 17-03-03 ****",     puzzleData: DP170303_DR4, 	puzzleStatus:	SOLVED     },
  { puzzleDescription: "DPevil",                		puzzleData: DPevil, 		puzzleStatus:	NOTSOLVED       },
];

/**
 * Create a 81 x 2 2D Array
 * See what happens ...
 */
var solutionMatrix = new Array();		// 9x9x2						
console.log("Build 9x9x2 3D-array solutionMatrix");
for (var r = 0; r < 9; r++) {
	solutionMatrix[r] = new Array();
	for (var c = 0; c < 9; c++) {
		solutionMatrix[r][c] = new Array();
		solutionMatrix[r][c][0] = PRESET_FIELD;
		solutionMatrix[r][c][1] = UNSOLVED_FIELD;
	}
}
console.log(solutionMatrix);

// puzzle is selected in index.html, 
console.log("Name of selected puzzle=" + selectedPuzzle);

// var puzzle = getSelectedPuzzle();
// console.log(puzzle);


// var puzzle = emptyPuzzle;
// var strHZPuzzle180209schwer = "040000102009000560006001037000050006030907050700080000310800400052000600604000090";
// convertString2Puzzle(strHZPuzzle180209schwer);

// How many cells were solved with which method?
var solvedWithMethodicalSearch = 0;
var solvedWithNackterEiner = 0;
var solvedWithVersteckterEiner = 0;
var solvedWithDirectTwin = 0;
var solvedWithDrillinge = 0;
var solvedWithCompleteRCB = 0;
var solvedWithNextMethod = 0;

// index.html:	which methods are checked/unchecked?
var isMethodicalSearchChecked 			= true;		// Methodical Search is always used
var isNackterEinerChecked 				; // = document.getElementById("nackterEiner").checked;
var isVersteckterEinerChecked 			; // = document.getElementById("versteckterEiner").checked;
var isDirectTwinChecked 				; // = document.getElementById("directTwin").checked; 
var isDrillingeChecked 					; // = document.getElementById("Drillinge").checked;
var isCompleteRCBChecked 				; // = document.getElementById("completeRCB").checked;

/*
var isNackterEinerChecked 				= document.getElementById("nackterEiner").checked;
var isVersteckterEinerChecked 			= document.getElementById("versteckterEiner").checked;
var isDirectTwinChecked 				= document.getElementById("directTwin").checked; 
var isCompleteRCBChecked 				= document.getElementById("completeRCB").checked;
*/




var tbl = "";

// First element of subgrid 1..9 starts at ...
var subgridXY = [ 	
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

/*
 * GET Functions
 */
 
 /*
 // Get selected Puzzle
 function getSelectedPuzzle() {
	var idx = document.getElementById("sudokuPuzzleList").selectedIndex;
	var options = document.getElementById("sudokuPuzzleList").options;
	console.log("idx=" + idx);
	console.log("options=" + options);
	selectedPuzzle = options[idx].txt;
	console.log("Selected Puzzle: " + selectedPuzzle);
		
 }
*/
 
 /*
 function myFunction() {
			var x = document.getElementById("sudokuPuzzleList").selectedIndex;
			var y = document.getElementById("sudokuPuzzleList").options;
			alert("Index: " + y[x].index + " is " + y[x].text);
		}
 
 
 */
 
 
 // Get Sudoku Description
 function getSudokuDescription() {
   return (description);  
}

// Get number of empty/unsolved cells in puzzle
function getNumberEmptyFields() {
	var empty = 0;
	var i, j;

	for (i=0; i<9; i++) {
		for (j=0; j<9; j++) {
			if ( getPuzzleValue(i, j) === 0) {
				empty++;
			}
		}
	}
	return empty;
}

// Get puzzle value at row r, column c
function getPuzzleValue(r, c) {
	return puzzle[r][c];
}

// Is Debug ON or OFF?
function isDebugON(rObj) {
	console.log(rObj);
	for (var i = 0; i < rObj.length; i++ ) {
		console.log(rObj.checked);
		console.log(rObj.value);
		if (rObj[i].checked) {
			return(rObj[i].value);
		}
		return false;
	}
}

/*
 * SET Functionsro
 */

// Set puzzle value to x, sleep for m ms
function setPuzzleValue( row, col, x) {
	// ToDo: select sleep value in index.html (checkbox, slider, ...)
	
	puzzle[row][col] = x;
	
	
	// This seems not to work, Sudoku Table is not refreshed :-(
	if (debug == true) console.log(puzzle);
	// document.getElementById("puzzleGrid").innerHTML = prepSudokuGrid();
	
	// setTimeout(updateHTMLTable, 5);
	
	//document.getElementById("puzzle").innerHTML = ""; 
	//document.getElementById("puzzle").innerHTML = prepSudokuTable(); 
	
	
	// his seems not to work, ...
	//document.getElementById("methodAndPuzzleValue").innerHTML = "MURX" + " " + x;
	//sleep(500);
	
}

function updateHTMLTable() {
	// document.getElementById("puzzle").innerHTML = prepSudokuTable();
	// document.getElementById("puzzleGrid").innerHTML = prepSudokuGrid();
}

function convertString2Puzzle( s ) {
  var i, r, c, x;
  i=0;
  for (r=0; r<9; r++) {
    for (c=0; c<9; c++) {
      x = s.substr(i++, 1);
	  console.log(x);
      setPuzzleValue(r, c, x);
    }
  }
  showSudokuPuzzleCompact();
}

/*
 * SHOW Functions (HTML, ...)
 */
function showSudokuPuzzleCompact() {
	var r, c;
	var x;
	var row = "";
	var emptyFields = getNumberEmptyFields();
	console.log("Sudoku %s\n", getSudokuDescription());

	console.log("Set fields %d, empty fields %d\n", 81-emptyFields, emptyFields);
	
	for (r=0; r<9; r++) {
		row = "";
		// console.log("\n");
		for (c=0; c<9; c++) {
		  x = getPuzzleValue(r, c);
		  if (x===0) {
		    x = " ";
		  }
		  row = row + x + "  ";
			// console.log("%2d ", getPuzzleValue(r, c));
		}
		console.log(row);
		
	}
	// console.log("\n");
	return("Done");
}

/*
 * More helper functions ...
 */
function isSolved() {
		var i, j;
		var tobesolved = 0;
		var solved = false;

		for (i=0; i<9; i++) {
			for (j=0; j<9; j++) {
				if ( puzzle[i][j] === 0) {
					tobesolved++;
				}
			}
		}
		if (tobesolved === 0) {
			solved = true;
		}
		return solved;
	}
	
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

/*
 * CHECK Functions
 */
 
// Methodisches Suchen:	CHECK Puzzle for blocked rows & columns for a given value
function check4blockedRowsColumns( x, blockedRows, blockedColumns) {
	var r, c;	      // row, col
	for (r=0; r<9; r++) {
		for (c=0; c<9; c++) {
			if ( puzzle[r][c] == x ) {
				blockedRows[r]=r;	
				blockedColumns[c]=c;
			}
		}
	} 
}

// Methodisches Suchen: CHECK 3x3 subgrid for a certain value x
function checkSubgrid4Value( subgrid, x) {
	var r, c;	              // row, col
	var containsX = false;

  var row = subgridXY[subgrid-1][0];
	var col = subgridXY[subgrid-1][1];

	for (r=row; r<(row+3); r++) {
		for (c=col; c<(col+3); c++) {
			if ( puzzle[r][c] == x ) {
				containsX = true;
			}
		}
	} 
	return containsX;
}

/*
 * MISC. CHECK METHODS
 */

// TEST: CHECK Row for duplicate value x
function check4DuplicateValueInRow( x, row) {
	var c;
	for (c=0; c<9; c++) {
		if (puzzle[row][c]==x ) {
			return c;
		}
	}
	return -1;
}

// TEST: CHECK Column for duplicate value x
function check4DuplicateValueInColumn( x, col) {
	var r;
	for (r=0; r<9; r++) {
		if (puzzle[r][col]==x ) {
			return r;
		}
	}
	return -1;
}

	

	
	
	

	
/*
 *  SOLVE Sudoku Puzzle with 'Nackter Einer'
 */

// function SolveWithNackterEiner() {
//	  
//	  console.log("Nackter EIner: NOT IMPLEMENTED YET");
//	  return(getNumberEmptyField());  
//	  
// }

/*
 * SHOW methods
 * ============
 */
function showMethod(methodName) {
		
		console.log("Try to solve a Sudoku Puzzle using '%s' (occupied/empty fields=%d/%d)\n\n", methodName, 81-getNumberEmptyFields(), getNumberEmptyFields());
		document.getElementById("myLog").innerHTML = methodName;
    	
}
	
function showPuzzleIsSolved(methodName) {
		console.log("%s : Sudoku puzzle %s is SOLVED! :-)", methodName, getSudokuDescription());
		
}
	
function showPuzzleIsNotSolved(methodName) {
		console.log("%s : Sudoku puzzle %s is NOT solved! :-(, empty Field=%d\n", methodName, getSudokuDescription(), getNumberEmptyFields());
		
}

function solveSudokuPuzzle() {
	// TODO Auto-generated method stub
	
	var emptyFields;		  // initial empty fields
	var emptyFields1;		  // empty fields for method 1
	var emptyFields2;		  // empty fields for method 2
	var emptyFields3;		  // empty fields for method 3
	var emptyFields4;		  // empty fields for method 4
	var emptyFields5;		  // empty fields for method 5
	var emptyFieldsLastMethod;		// empty fields for last Method
		
	var presetFields;
	var continue2Solve = false;
		
	var subgrid;	// Subgrid number 1..9

	var methodName = "MethodName";
	
	debug = isDebugON( document.debugForm.myDebug );
	console.log("DBUG: " + debug);
	
	
	// TBD:	Select Puzzle from list you'd like to solve:
	// System.out.printf("Anzahl Sudoku Puzzles: %d\n", SudokuInstances.puzzleList.length);
		
	// TODO: 
	//for (i=0; i<SudokuInstances.puzzleList.length; i++) {
		//SudokuPuzzle puzzle = new SudokuPuzzle(SudokuInstances.puzzleList[i]);
		//puzzle.setSudokuDescription("Test");
		//System.out.printf("%2d. Puzzle=%s\n", i, puzzle.getSudokuDescription());
	//}
	
	// SudokuPuzzle puzzle = new SudokuPuzzle("DP170303_DR4", SudokuInstances.DP170303_DR4);
	// puzzle.showSudokuPuzzle();	
								

	// MAIN LOOP: 
		
		
	// long start = System.currentTimeMillis();
	    
	// Get elapsed time in milliseconds
  //  long elapsedTimeMillis = System.currentTimeMillis() - start;
  //  float elapsedTimeSec = elapsedTimeMillis/1000F;
  //  System.out.println(elapsedTimeSec);
	

		
	
		
	emptyFields = getNumberEmptyFields();
	presetFields = 81 - emptyFields;
			
	do {
		
		
		/* 
		 * 1. METHODISCHES SUCHEN
		 */
		methodName = "Methodical Search";
		showMethod(methodName);
		continue2Solve = true;
		result = setTimeout(SolveWithMethodicalSearch(), 50);
		if (( emptyFields1 = result) === 0 ) {
			showPuzzleIsSolved(methodName);
			document.getElementById("puzzleGrid").innerHTML = prepSudokuGrid();
			continue2Solve = false;
			break;						// no need to call any further methods ...
		}	else {
			showPuzzleIsNotSolved(methodName);
			showSudokuPuzzleCompact();
		}
		
		/* 
		 * 2. NACKTER EINER
		 */
		methodName = "Nackter Einer";
		if ( isNackterEinerChecked == true ) {
		   showMethod(methodName);
		
		   if ((emptyFields2 = solveWithNackterEiner())=== 0) {
			 showPuzzleIsSolved(methodName);
			 document.getElementById("puzzleGrid").innerHTML = prepSudokuGrid();
			 continue2Solve = false;
			 break;						// no need to call any further methods ...
		   } else {
			showPuzzleIsNotSolved(methodName);
			showSudokuPuzzleCompact();
		   }
		}
		else {
			console.log("SKIP Method %s!\n", methodName);
		}
		
		/* 
		 * 3. VERSTECKTER EINER
		 */
		methodName = "Versteckter Einer";
		if ( isVersteckterEinerChecked == true ) {
			showMethod(methodName);
			if ((emptyFields3 = solveWithVersteckterEiner())=== 0) {
				showPuzzleIsSolved(methodName);
				document.getElementById("puzzleGrid").innerHTML = prepSudokuGrid();
				continue2Solve = false;
				break;						// no need to call any further methods ...
			}	else {
				showPuzzleIsNotSolved(methodName);
				showSudokuPuzzleCompact();
			}
		}
		else {
			console.log("SKIP Method %s!\n", methodName);
		}

		/* 
		 * 4. DIRECT TWIN
		 */
		methodName = "Direct Twin";
		if ( isDirectTwinChecked == true ) {
			showMethod(methodName);
			if ((emptyFields4 = SolveWithDirectTwin())=== 0) {
				showPuzzleIsSolved(methodName);
				document.getElementById("puzzleGrid").innerHTML = prepSudokuGrid();
				continue2Solve = false;
				break;						// no need to call any further methods ...
			}	else {
				showPuzzleIsNotSolved(methodName);
				showSudokuPuzzleCompact();
			}
		}
		else {
			console.log("SKIP Method %s!\n", methodName);
		}
		
		/* 
		 * 5. DRILLINGE
		 */
		methodName = "Drillinge";
		console.log("SKIP Method %s!\n", methodName);
		


		
		/* 
		 * X. COMPLETE ROWS, COLUMNS, SUBGRIDS (RCB)
		 */
		methodName = "Complete Rows, Columns, Blocks (RCB)";
		if ( isCompleteRCBChecked == true ) {
			// start = System.currentTimeMillis();start = System.currentTimeMillis();
			showMethod(methodName);
			completeRows();
			completeColumns();
			completeSubgrids();
						
			if ((emptyFieldsLastMethod = getNumberEmptyFields()) == 0) {
				puzzle.showPuzzleIsSolved(methodName);
				document.getElementById("puzzleGrid").innerHTML = prepSudokuGrid();
				continue2Solve = false;
				break;		// no need to call any further methods
			}	else {
				showPuzzleIsNotSolved(methodName);
				showSudokuPuzzleCompact();
			}
		}
		else {
			console.log("SKIP Method %s!\n", methodName);
		}
		
		// Get elapsed time in milliseconds
		   // elapsedTimeMillis = System.currentTimeMillis() - start;
		   // elapsedTimeSec = elapsedTimeMillis/1000F;
		   // System.out.println(elapsedTimeSec);

		
    // *************************************************************************
					
		if ((emptyFieldsLastMethod = getNumberEmptyFields()) === 0) {
			showPuzzleIsSolved(methodName);
			document.getElementById("puzzleGrid").innerHTML = prepSudokuGrid();
			continue2Solve = false;
			break;		// no need to call any further methods
		}	else {
			showPuzzleIsNotSolved(methodName);
			showSudokuPuzzleCompact();
		}
		
		
	} while ((emptyFieldsLastMethod < emptyFields1) &&  (continue2Solve == true));
		
	document.getElementById("puzzleGrid").innerHTML = prepSudokuGrid();
		
	// Statistics
	showSudokuPuzzleCompact();
	// checkSudokuSolution();
	console.log("Sudoku STATISTICS\nPreset Fields %d, initial empty Fields %d, actual empty Fields %d, solved fields %d\n", presetFields, 81-presetFields, getNumberEmptyFields(), (81 - presetFields) - getNumberEmptyFields());
	console.log("Solved with 'Methodical Search':\t%d\n", solvedWithMethodicalSearch);
	console.log("Solved with 'Nackter Einer':\t%d\n", solvedWithNackterEiner);
	console.log("Solved with 'Versteckter Einer':\t%d\n", solvedWithVersteckterEiner);
	console.log("Solved with 'Direct Twin':\t%d\n", solvedWithDirectTwin);
	console.log("Solved with 'Complete RCB':\t%d\n", solvedWithCompleteRCB);
	
	// Solution Matrix
	console.log(solutionMatrix);
	showSolutionMatrix(solutionMatrix);
	
	if (getNumberEmptyFields() === 0 )
	  return("Solved");
	else 
	  return ("NOT Solved");
	}


function getDate() {
    return(Date());
   // return(Date());
}





