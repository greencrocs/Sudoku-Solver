
import java.util.ArrayList;
import java.util.List;

public  class XWing {
	private static final 	int EMPTY_FIELD = 0;
	private static final   	int XWING_A = 0;
	private static final   	int XWING_B = 1;
	private static final   	int XWING_C = 2;
	private static final   	int XWING_D = 3;
	
	
	public static int SolveWithXWing(SudokuPuzzle puzzle, int[][][] candidates) {

		final   int XWING_A = 0;
		final   int XWING_B = 1;
		final   int XWING_C = 2;
		final   int XWING_D = 3;
		
		int col;		// column	
		int row;
		int block;
		
		int i;
		int x;
		int removeCandidate=0;
		boolean xwingConfig=false;
		boolean continue2Solve=false;

		int emptyFields;
		
		int loop=0;

		// int[][][] candidates = new int[9][9][9];						// array candidates contains all possible candidates 1..9 for all fields							

		// int[] rowEmptyFields={0, 0, 0, 0, 0, 0, 0, 0, 0};

		int[] colIdxXwing = { -1, -1, -1, -1};	
		int[] rowIdxXwing = { -1, -1, -1, -1};

		int[]candidateCount = { 0, 0, 0, 0, 0, 0, 0, 0, 0 };	// wie of kommen die Zahlen 1 bis 9 als Kandidaten vor?
							//  0, 0, 2, 0, 0, 0, 4, 0, 2		// 3 kommt 2x, 7 kommt 4x, 9 kommt 2x vor, also isses die 7!
		int xWingCandidates=0;

		emptyFields = puzzle.numberEmptyFields();
		
		// MAIN LOOP
		
		// TEST
		// NUR TEMPOR�R!
		// puzzle.findAllCandidates(candidates);
		
		do {
			continue2Solve=false;
			System.out.printf("X-Wing Method: loop=%d, empty Fields=%d\n", ++loop, emptyFields);

			/**
			 * X-Wing
			 * /**
			 * The rule is
			 * When there are only two possible cells for a value in each of two different rows,
			 * and these candidates lie also in the same columns,
			 * then all other candidates for this value in the columns can be eliminated.
			 */
			
			// count all empty field per row
			int[] rowEmptyFields={0, 0, 0, 0, 0, 0, 0, 0, 0};	// geht das so?
			for (row=0; row<9; row++) {
				for (col=0; col<9; col++) {
					if (puzzle.getPuzzleValue(row, col)==0) {
						rowEmptyFields[row]++;
					}
				}
				System.out.printf("row %d, empty fields %d\n", row, rowEmptyFields[row]);
			}

			xWingCandidates=0;
			xwingConfig=false;
			for (row=0; row<9; row++) {
				if (rowEmptyFields[row]==2) {
					for (col=0; col<9; col++) {
						if (puzzle.getPuzzleValue(row, col)==EMPTY_FIELD) {	// first or second empty field in row
							// do not handle more than 4 (or more?) candidates
							if (xWingCandidates < rowIdxXwing.length ) {	// max. 16 Xwing candidates
								rowIdxXwing[xWingCandidates]=row;
								colIdxXwing[xWingCandidates]=col;
								block=puzzle.convertxy2Subgrid(row, col);
								System.out.printf("X-Wing %d, row %d, col %d, block %d\n", xWingCandidates, rowIdxXwing[xWingCandidates], colIdxXwing[xWingCandidates], block);
								puzzle.showArray(candidates[row][col]);	// show possible candidates for field 
								xWingCandidates++;
							}
						}
					}
				}
			}

			// A & B in same row, C & D in same row, A & C in same column, B & D in same column

			if (xWingCandidates > 4) {
				System.out.printf("Found more than 4 (%d) X-Wing candidates, but let's try with the first 4 X-Wing candidates\n", xWingCandidates);
				xWingCandidates=4;
				// break;
			}
			
			if ( (xWingCandidates == 4) &&
					(colIdxXwing[XWING_A] == colIdxXwing[XWING_C]) &&
					(colIdxXwing[XWING_B] == colIdxXwing[XWING_D]) ) {
				System.out.println("X-Wing constellation detected, what now?");
			} else {
				System.out.println("NOT a X-Wing constellation, leave");
				break;	// leave 
			}
			
			// X-Wing candidates should lie in 4 different blocks
			if (candidatesInDifferentBlocks( rowIdxXwing, colIdxXwing)==false) {
				System.out.println("X-Wing candidates lie not in 4 different blocks, leave ...");
				break;
			}
		

			// Show possible candidates for XWING_A and XWING_B columns
			System.out.printf("Show all candidates for XWING_A col %d\n", colIdxXwing[XWING_A]);

			for (row=0; row<9; row++) {
				for (i=0; i<9; i++) {
					System.out.printf("%2d ", candidates[row][colIdxXwing[XWING_A]][i]);
				}
				System.out.println();
			}

			System.out.printf("Show all candidates for XWING_B col %d\n", colIdxXwing[XWING_B]);
			for (row=0; row<9; row++) {
				for (i=0; i<9; i++) {
					System.out.printf("%2d ", candidates[row][colIdxXwing[XWING_B]][i]);
				}
				System.out.println();
			}

			// TODO check4CommonCandidateIn4Fields( candidates, rowIdxXwing, colIdxXwing, candidateCount);
			// check if a candidate appear 4 times in A, B, C, D
			for (x=0; x<4; x++) {
				row=rowIdxXwing[x];
				col=colIdxXwing[x];
				for (i=0; i<9; i++) {
					// count candidates for values 1..9
					if (candidates[row][col][i] > 0) {
						candidateCount[i]++;
						if (candidateCount[i]==4) {
							removeCandidate=i+1;
							xwingConfig=true;
							System.out.printf("found removeCandidate=%d\n", removeCandidate);
						}
					}
				}
			}
	
			if (xwingConfig==false) {
				System.out.println("No common candidate found for XWING A, B, C, D");
				break;
			}
				
			System.out.println("candidateCount: we do have a common candidate for XWING A, B, C, D!");
			puzzle.showArray(candidateCount);

			// remove candidates in columns ....., exclude A and C for first, B and D for second column! 
			removeXWingCandidateIn2Columns(candidates, removeCandidate, colIdxXwing[XWING_A],colIdxXwing[XWING_B], rowIdxXwing);

			// Check for 'Nackter Einer' in columns, rows, blocks
			
			puzzle.check4NackterEinerInColumn(candidates, colIdxXwing[XWING_A]);
			puzzle.check4NackterEinerInColumn(candidates, colIdxXwing[XWING_B]);
			// check4NackterEinerInRow(candidates, rowIdxXwing[XWING_A]);
			// check4NackterEinerInRow(candidates, rowIdxXwing[XWING_C]);

			
			for (x=0; x<4; x++) {
				block=convertxy2Subgrid(rowIdxXwing[x], colIdxXwing[x]);	// 0..3 == XWING_A,B,C,D
				puzzle.check4NackterEinerInBlock(candidates, block);
			}
			
			if (puzzle.numberEmptyFields() < emptyFields) {	// at least 1 new field was solved so let's continue
				emptyFields = puzzle.numberEmptyFields();
				continue2Solve = true;
			} else {
				continue2Solve = false;
			}
			if (puzzle.isSolved() == true) {
				continue2Solve = false;
			}
			
		} while ( (emptyFields >  0) && (continue2Solve == true) ); 
		
		// Update ALL possible candidates for each field in puzzle
		puzzle.updateAllCandidates(candidates);	
		
		return (81 - puzzle.numberEmptyFields());
	}
	
	
	public static int SolveWithXWingColumn(SudokuPuzzle puzzle, int[][][] candidates) {

		int col;		// column	
		int row;		// row
		int block;		// block (AKA subgrid)
		int i;
		int x;
		int removeCandidate=0;
		boolean xwingConfig=false;
		boolean continue2Solve=false;

		int emptyFields;
		
		int loop=0;

		// int[][][] candidates = new int[9][9][9];						// array candidates contains all possible candidates 1..9 for all fields							

		// int[] rowEmptyFields={0, 0, 0, 0, 0, 0, 0, 0, 0};

		int[] colIdxXwing = { -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1};	
		int[] rowIdxXwing = { -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1};

		int[]candidateCount = { 0, 0, 0, 0, 0, 0, 0, 0, 0 };	// wie of kommen die Zahlen 1 bis 9 als Kandidaten vor?
							//  0, 0, 2, 0, 0, 0, 4, 0, 2		// 3 kommt 2x, 7 kommt 4x, 9 kommt 2x vor, also isses die 7!
		int xWingCandidates=0;


		emptyFields = puzzle.numberEmptyFields();
		
	// MAIN LOOP
		
		do {
			continue2Solve=false;
			System.out.printf("X-Wing Method (Column Variant): loop=%d, empty Fields=%d\n", ++loop, emptyFields);

			/**
			 * X-Wing
			 * /**
			 * The rule is
			 * When there are only two possible cells for a value in each of two different columns,
			 * and these candidates lie also in the same rows,
			 * then all other candidates for this value in the rows can be eliminated.
			 */
			int[] colEmptyFields={0, 0, 0, 0, 0, 0, 0, 0, 0};	// geht das so?
			for (col=0; col<9; col++) {
				for (row=0; row<9; row++) {
					if (puzzle.getPuzzleValue(row, col)==0) {
						colEmptyFields[col]++;
					}
				}
				System.out.printf("col %d, empty fields %d\n", col, colEmptyFields[col]);
			}

			xWingCandidates=0;
			xwingConfig=false;
			for (col=0; col<9; col++) {
				if (colEmptyFields[col]==2) {
					for (row=0; row<9; row++) {
						if (puzzle.getPuzzleValue(row, col)==EMPTY_FIELD) {	// first or second empty field in column
							// do not handle more than 16 candidates
							if (xWingCandidates < colIdxXwing.length ) {	// max. 16 Xwing candidates
								rowIdxXwing[xWingCandidates]=row;
								colIdxXwing[xWingCandidates]=col;
								block=convertxy2Subgrid(row, col);
								System.out.printf("X-Wing %d, col %d, row %d, block %d\n", xWingCandidates, colIdxXwing[xWingCandidates], rowIdxXwing[xWingCandidates], block);
								puzzle.showArray(candidates[row][col]);	// show possible candidates for field 
								xWingCandidates++;
							}
						}
					}
				}
			}

			// A & B in same col, C & D in same col, A & C in same row, B & D in same row

			if (xWingCandidates > 4) {
				System.out.printf("Can't handle more than 4 (%d) X-Wing candidates, so let's try the first 4 X-Wing candidates\n", xWingCandidates);
				xWingCandidates=4;
				// break;
			}
			
		if ( (xWingCandidates == 4) &&
					(rowIdxXwing[XWING_A] == rowIdxXwing[XWING_C]) &&
					(rowIdxXwing[XWING_B] == rowIdxXwing[XWING_D]) ) {
				System.out.println("X-Wing constellation (column variant) detected!");
			} else {
				System.out.println("NOT a X-Wing constellation, leave");
				break;	// leave 
			}

		// X-Wing candidates should lie in 4 different blocks
		if (candidatesInDifferentBlocks( rowIdxXwing, colIdxXwing)==false) {
			System.out.println("X-Wing candidates lie not in 4 different blocks, leave ...");
			break;
		}

		// Show possible candidates for XWING_A and XWING_B rows
			System.out.printf("show all candidates for XWING_A row %d\n", rowIdxXwing[XWING_A]);

			for (col=0; col<9; col++) {
				for (i=0; i<9; i++) {
					System.out.printf("%2d ", candidates[rowIdxXwing[XWING_A]][col][i]);
				}
				System.out.println();
			}

			System.out.printf("show all candidates for XWING_B row %d\n", rowIdxXwing[XWING_B]);
			for (col=0; col<9; col++) {
				for (i=0; i<9; i++) {
					System.out.printf("%2d ", candidates[rowIdxXwing[XWING_B]][col][i]);
				}
				System.out.println();
			}
	
			// TODO check4CommonCandidateIn4Fields( candidates, rowIdxXwing, colIdxXwing, candidateCount);
			// check if a candidate appear 4 times in A, B, C, D
			for (x=0; x<4; x++) {
				row=rowIdxXwing[x];
				col=colIdxXwing[x];
				for (i=0; i<9; i++) {
					// count candidates for values 1..9
					if (candidates[row][col][i] > 0) {
						candidateCount[i]++;
						if (candidateCount[i]==4) {
							removeCandidate=i+1;
							xwingConfig=true;
							System.out.printf("removeCandidate=%d\n", removeCandidate);
						}
					}
				}
			}

			if (xwingConfig==false) {
				System.out.println("No common candidate found for XWING A, B, C, D");
				break;
			}
			System.out.println("candidateCount: we do have a common candidate for XWING A, B, C, D!");
			puzzle.showArray(candidateCount);
						
			// remove candidates in columns ....., exclude A and C for first, B and D for second column! 
			removeXWingCandidateIn2Rows(candidates, removeCandidate, rowIdxXwing[XWING_A],rowIdxXwing[XWING_B], colIdxXwing);

			// Check for 'Nackter Einer' in columns, rows, blocks
			// check4NackterEinerInColumn(candidates, colIdxXwing[XWING_A]);
			// check4NackterEinerInColumn(candidates, colIdxXwing[XWING_B]);
			puzzle.check4NackterEinerInRow(candidates, rowIdxXwing[XWING_A]);
			puzzle.check4NackterEinerInRow(candidates, rowIdxXwing[XWING_C]);

			
			for (x=0; x<4; x++) {
				block=convertxy2Subgrid(rowIdxXwing[x], colIdxXwing[x]);	// 0..3 == XWING_A,B,C,D
				puzzle.check4NackterEinerInBlock(candidates, block);
			}
			
			if (puzzle.numberEmptyFields() < emptyFields) {	// at least 1 new field was solved so let's continue
				emptyFields = puzzle.numberEmptyFields();
				continue2Solve = true;
			} else {
				continue2Solve = false;
			}
			if (puzzle.isSolved() == true) {
				continue2Solve = false;
			}
			
		} while ( (emptyFields >  0) && (continue2Solve == true) ); 
		
		// Update ALL possible candidates for each field in puzzle
		puzzle.updateAllCandidates(candidates);	
		
		return (81 - puzzle.numberEmptyFields());
	}
	
	
	
	
	private static boolean candidatesInDifferentBlocks(int[] rowIdxXwing, int[] colIdxXwing) {
		// X-Wing candidates should lie in 4 different blocks, return false if they are not
		List<Integer> xwingBlocks = new ArrayList<>();
		int[] xWingBlock=new int[4];
		int x;
		for (x=0; x<4; x++) {
			xWingBlock[x]=convertxy2Subgrid(rowIdxXwing[x], colIdxXwing[x]);	
			System.out.printf("xWingBlock[%d]=%d\n", x, xWingBlock[x]);
		}
		if ( (xWingBlock[0] != xWingBlock[1]) && (xWingBlock[1] != xWingBlock[2]) && (xWingBlock[2] != xWingBlock[3]) ) {
			System.out.println("OK, X-Wing candidates lie in 4 different blocks");
			return true;
		}
		return false;
	}

	// X-Wing-Methode: streiche einen Kandidaten in 2 Zeilem
	// Achtung: NICHT gestrichen wird		A, B, C, D
	public static void removeXWingCandidateIn2Rows( int[][][]candidates, int x, int rowA, int rowB, int[]colIdxXwing) {
		// int[] colIdxXwing enth�lt die 2 Spaltennummern der XWing ABCD Kandidate, wobei die Spalten f�r AB und CD jeweils gleich sind,
		// also brauche ich nur die Spaltennummern von AC oder BD
		int col;
		for (col=0; col<9; col++) {
			if ( (col != colIdxXwing[XWING_A]) && (col != colIdxXwing[XWING_C]) ) {
				System.out.printf("removeXWIngCandidateIn2Rows: remove %d in row %d, rowA %d, rowB %d\n", x, col, rowA, rowB);
				candidates[rowA][col][x-1]=0;
				candidates[rowB][col][x-1]=0;
				// System.out.println(candidateCount(candidates));
			}
		}
	}
	
	// X-Wing-Methode: streiche einen Kandidaten in 2 Spalten
	// Achtung: NICHT gestrichen wird		A, B, C, D
	public static void removeXWingCandidateIn2Columns( int[][][]candidates, int x, int colA, int colB, int[]rowIdxXwing) {
		// int[] rowIdxXwing enth�lt die 2 Zeilennummern der XWing ABCD Kandidate, wobei die Zeilen f�r AB und CD jeweils gleich sind,
		// also brauche ich nur die Zeilennummern von AC oder BD
		int row;
		for (row=0; row<9; row++) {
			if ( (row != rowIdxXwing[XWING_A]) && (row != rowIdxXwing[XWING_C]) ) {
				System.out.printf("removeXWIngCandidateIn2Columns: remove %d in row %d, colA %d, colB %d\n", x, row, colA, colB);
				candidates[row][colA][x-1]=0;
				candidates[row][colB][x-1]=0;
				// System.out.println(candidateCount(candidates));
			}
		}
	}
	
	public static int 	convertxy2Subgrid(int row, int column) {
		return(((row/3 * 3) + 1) + ( column/3 ));
	}

}
