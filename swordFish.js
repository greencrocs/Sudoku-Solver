

public class Swordfish {
	
	public static int SolveWithSwordfish(SudokuPuzzle puzzle, int[][][] candidates) {

		int col;		// column	
		int row;
		int block;
		
		int i;
		int x;
		int removeCandidate=0;
		
		boolean continue2Solve=false;

		int emptyFields;
		
		int loop=0;

		// int[][][] candidates = new int[9][9][9];						// array candidates contains all possible candidates 1..9 for all fields							

		// int[] rowEmptyFields={0, 0, 0, 0, 0, 0, 0, 0, 0};

		int[] colIdxXwing = { -1, -1, -1 };	
		int[] rowIdxXwing = { -1, -1, -1 };

		int[]candidateCount = { 0, 0, 0, 0, 0, 0, 0, 0, 0 };	// wie of kommen die Zahlen 1 bis 9 als Kandidaten vor?
							//  0, 0, 2, 0, 0, 0, 4, 0, 2		// 3 kommt 2x, 7 kommt 4x, 9 kommt 2x vor, also isses die 7!
		int swordfishCandidates=0;

		System.out.println("Swordfish Method: work in progress");
		
		emptyFields = puzzle.numberEmptyFields();
		
		// MAIN LOOP
		
		do {
			continue2Solve=false;
			System.out.printf("Swordfish Method: loop=%d, empty Fields=%d\n", ++loop, emptyFields);

			/**
			 * Swordfish
			 * 
			 * A Swordfish is a 3 by 3 nine-cell pattern where a candidate is found on three different rows 
			 * (or three columns) and they line up in the opposite direction. 
			 * Eventually we will fix three candidates somewhere in those cells which excludes all other candidates in those units.
			 * 
			 */
			
			int[][] rowSwordfishPosition = new int[9][9];	// enth�lt f�r einen Kandidaten x die Positionen
			// f�r jeden Kandidaten x 
			for (x=1; x<=9; x++) {
				// suche in jeder Zeile row
				int fishCountRow=0;
				for (row=0; row<9; row++) {
					
					// suche f�r jedes Feld in row den Kandidaten x
					int fishCountCol = 0;
					for (col=0; col<9; col++) {
						rowSwordfishPosition[row][col]=0;	// Kandidat auf dieser Position nicht (0) vorhanden
						if (candidates[row][col][x-1]==x) {		// Kandidat x gefunden
							// es gibt einen Kandidaten x in row, column
							// speichere rowIdxColumn
							rowSwordfishPosition[row][col]=x;
							fishCountCol++;
						}
					}
					// Show candidate x positions in row
					if (fishCountCol==3) {	// candidate x shows up in 3 fields
						System.out.printf("rowSwordfishPosition for %d in row %d ", x, row );
						for (i=0; i<9; i++) {
							System.out.printf("%2d ", rowSwordfishPosition[row][i]);
						}
						System.out.println();
						fishCountRow++;
					} 
				}
				System.out.println();
			}

			// 
			
			
			
			
			
			
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
	
	

}
