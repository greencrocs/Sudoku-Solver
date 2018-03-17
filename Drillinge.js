import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class Drillinge {

	private static final int TWIN 			= 2;
	private static final int TRIPLE 		= 3;

	private static final int TRIPLE_ONE 	= 0;
	private static final int TRIPLE_TWO 	= 1;
	private static final int TRIPLE_THREE 	= 2;
	private static final int TRIPLE_FOUR 	= 3;

	private static final int TWIN_ONE 	= 0;
	private static final int TWIN_TWO 	= 1;
	private static final int TWIN_THREE = 2;
	private static final int TWIN_FOUR 	= 3;
	private static final int TWIN_FIVE 	= 4;

	public static int SolveWithDrillinge(SudokuPuzzle puzzle, int[][][] candidates) {
		/**
		 * A 'Naked Triple' is slightly more complicated because it does not always imply three numbers each in three cells.
		 * 
		 * Any group of three cells in the same unit that contain IN TOTAL three candidates is a Naked Triple.
		 * Each cell can have two or three numbers, as long as in combination all three cells have only three numbers.
		 * When this happens, the three candidates can be removed from all other cells in the same unit.
		 * 
		 * The combinations of candidates for a Naked Triple will be one of the following:
		 *
		 *	(123) (123) (123) - {3/3/3} (in terms of candidates per cell)
		 *	(123) (123) (12) - {3/3/2} (or some combination thereof)
		 *	(123) (12) (23) - {3/2/2/}
		 *	(12) (23) (13) - {2/2/2}
		 *
		 */

		int c, col;		// column	
		int r, row;		// row
		int b, block;	// block (AKA subgrid)
		int s, subgrid;
		int x;			// value in puzzle

		int i, j, k, f;

		int emptyFields;
		int presetFields;

		boolean continueSudoku = false;
		int loop=0;

		int count;
		int idx;
		int countCheckRow4Triples=0;
		int countCheckCol4Triples=0;
		int countCheckBlock4Triples=0;

		int[] possibleCandidates = 	{ 1, 2, 3, 4, 5, 6, 7 , 8, 9 };	// array possibleCandidates contains all possible candidates 1..9 for 1 field	
		int[] rowTriple = 	{ -1, -1, -1, -1, -1, -1, -1, -1, -1 };
		int[] colTriple = 	{ -1, -1, -1, -1, -1, -1, -1, -1, -1 };
		int[] blockTriple = { -1, -1, -1, -1, -1, -1, -1, -1, -1 };
		List<List<Integer>> tripleList = new ArrayList<List<Integer>>();

		// NUR TEMPOR�R!
		// puzzle.findAllCandidates(candidates);

		// MAIN LOOP

		emptyFields = puzzle.numberEmptyFields();
		presetFields = 81 - emptyFields;

		do {
			System.out.printf("New Triple Method (n Triples and m Twins): loop=%d, empty Fields=%d\n", ++loop, emptyFields);
			/*
			 * Sudoku Wikipedia: Drillinge			 
			 */
			continueSudoku = false;

			// Check all rows for triples
			for (row=0; row<9; row++) {
				checkRow4Drillinge(puzzle, row, candidates, colTriple);
				countCheckRow4Triples++;
			}

			// Check all columns
			for (col=0; col<9; col++) {
				checkColumn4Drillinge(puzzle, col, candidates, rowTriple);
				countCheckCol4Triples++;
			}

			// Check all blocks
			for (block=1; block<=9; block++) {
				checkBlock4Drillinge(puzzle, block, candidates, rowTriple, colTriple);
				countCheckBlock4Triples++;
			}

			if (puzzle.numberEmptyFields() < emptyFields) {	// at least 1 new field was solved so let's continue
				emptyFields = puzzle.numberEmptyFields();
				continueSudoku = true;
			} else {
				continueSudoku = false;
			}
			if (puzzle.isSolved() == true) {
				continueSudoku = false;
			}

		} while ( (emptyFields >  0) && (continueSudoku == true) );	

		// Update ALL possible candidates for each field in puzzle
		puzzle.updateAllCandidates(candidates);	

		return (81 - puzzle.numberEmptyFields());		// == Fields solved in total
	}



	public static boolean checkRow4Drillinge( SudokuPuzzle puzzle, int row, int[][][] candidates, int[] colTriple) {

		List<Integer> finalTriple = new ArrayList<>();

		List<List<Integer>> tripleList = new ArrayList<List<Integer>>();		
		List<List<Integer>> twinList = new ArrayList<List<Integer>>();

		int[] candidateCount = {0, 0, 0, 0, 0, 0, 0, 0, 0};	// no. of twins in a row

		// int[] rowTriple = { -1, -1, -1, -1, -1, -1, -1, -1, -1 };
		// int[] rowTwin =	  { -1, -1, -1, -1, -1, -1, -1, -1, -1 };

		// boolean[] foundTriple =	{ false, false, false, false, false, false, false, false, false };				// handle max 4 triples
		// boolean[] foundTwin =	{ false, false, false, false, false };		// handle max 5 twins

		int[] colTwin	= { -1, -1, -1, -1, -1, -1, -1, -1, -1 };			// -1 = no (matching) twin
		//  0..8 = (matching) twin at column 0..8 
		int matchTwins=0;

		int rowTriples=0;		// no. of triples found in row
		int rowTwins=0;			// no. of twins found in row

		finalTriple.clear();

		int col;
		int r;
		int i, j;

		boolean found333 = false;
		boolean found332 = false;
		boolean found322 = false;
		boolean found222 = false;

		// Count candidates for each field in row
		puzzle.countCandidatesRow(candidates, row, candidateCount);

		// Check for triples and twins in row
		for (col=0; col<9; col++) {
			// System.out.println(candidateCount[col]);

			switch (candidateCount[col]) {

			case TWIN:
				twinList.add(new ArrayList<Integer>());		// Neue Liste anlegen und Zwillinge eintragen	
				colTwin[rowTwins]=col;						// store col# where we found twin
				rowTwins++;
				// System.out.printf("Found twin candidate#%d in row %d, col %d: ", rowTwins, row, col);
				for (i=0; i<9; i++) {
					if (candidates[row][col][i] != 0) {
						twinList.get(rowTwins-1).add(candidates[row][col][i]);	// add twin candidates to twinList
					}
				}

				// System.out.println(twinList.get(rowTwins-1));
				// System.out.printf("twinList.get(rowTwins-1).size())=%d\n", twinList.get(rowTwins-1).size());
				// System.out.printf("twinList.size()=%d\n", twinList.size());
				break;

			case TRIPLE:
				tripleList.add(new ArrayList<Integer>());		// Neue Liste anlegen und Drilling eintragen	
				colTriple[rowTriples]=col;						// store col# where we found triple 
				rowTriples++;
				// System.out.printf("Found triple candidate#%d in row %d, col %d: ", rowTriples, row, col);
				for (i=0; i<9; i++) {
					if (candidates[row][col][i] != 0) {
						tripleList.get(rowTriples-1).add(candidates[row][col][i]);	// add triple to tripleList
					}
				}
				// System.out.println(tripleList.get(rowTriples-1));
				// System.out.printf("tripleList.get(rowTriples-1).size())=%d\n", tripleList.get(rowTriples-1).size());
				// System.out.printf("tripleList.size()=%d\n", tripleList.size());
				break;

			default:
				break;
			}
		}

		System.out.printf("Found %d triples in row %d\n", rowTriples, row);
		for (i=0; i<rowTriples; i++) {
			System.out.printf("Triple#%d in col#%d ", i, colTriple[i]);
			System.out.println(tripleList.get(i));
		}

		System.out.printf("Found %d twins in row %d\n", rowTwins, row);
		for (i=0; i<rowTwins; i++) {
			System.out.printf("Twins#%d in col#%d ", i, colTwin[i]);
			System.out.println(twinList.get(i));
		}

		/**
		 *	We have n triples and m twins
		 *
		 *	Possible combinations are	333	332	322	222
		 *	333		3 triples
		 *			a) 	3 triples are identical				-> removeCandidates
		 *			b)	2 of 3 triples are identical		-> 332
		 *			c)	3 unique triples, for each triple	-> 322
		 *					
		 *
		 *	332		2 triples
		 *			a) 2 triples are identical, find matching twin	-> removeCandidates
		 *				aa) no matching twin for triple		-> 322
		 *			b) 2 unique triples, for each triple 	-> 322
		 *				
		 *	322		1 triple
		 *			a)	find 2 matching twins	12-	
		 *										1-3
		 *										-23
		 *			b)	if a) does not work					-> 222
		 *						
		 *				
		 *	222		0 triples, 3 twins make up a triple
		 *			a)	build triple 123 out of 3 twins	12-
		 *												1-3
		 *												-23
		 *			
		 */


		/*
		 * 3/3/3	DAS KANN MAN DOCH BESSER PROGRAMMIEREN!
		 */
		found333=false;
		if (rowTriples==3) {
			System.out.println("333: 3 TRIPLES");
			if (identicalTriples333(tripleList)==true) {
				System.out.println("333a: triple1, 2 and 3 are identical");
				System.out.println(tripleList.get(TRIPLE_ONE));
				System.out.println(tripleList.get(TRIPLE_TWO));
				System.out.println(tripleList.get(TRIPLE_THREE));
				found333=true;
				System.out.println("333: removeTripleCandidates");
				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
				removeTripleCandidatesInRow(candidates, row, tripleList, colTriple);	
				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
				if (puzzle.check4NackterEinerInRow( candidates, row )==true) {
					puzzle.check4NackterEinerInColumn(candidates, colTriple[TRIPLE_ONE]);		// NEW
					puzzle.check4NackterEinerInColumn(candidates, colTriple[TRIPLE_TWO]); 		// NEW
					puzzle.check4NackterEinerInColumn(candidates, colTriple[TRIPLE_THREE]); 	// NEW
				}; 
				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
				return true;

			} else {
				System.out.println("333: triple1, 2 and 3 are NOT identical");

				if (tripleList.get(TRIPLE_ONE).equals(tripleList.get(TRIPLE_TWO))==true) {
					System.out.println("333b: triple1 and 2 are identical");
					tripleList.remove(TRIPLE_THREE);		// delete triple3
					colTriple[TRIPLE_THREE]=-1;				// delete col# of 3rd triple
					rowTriples--;
					System.out.println(tripleList.get(TRIPLE_ONE));
					System.out.println(tripleList.get(TRIPLE_TWO));
					System.out.println("333b: --> 332");
					// break label332;

				} else {

					if (tripleList.get(TRIPLE_ONE).equals(tripleList.get(TRIPLE_THREE))==true) {
						System.out.println("333b: triple1 and 3 are identical");
						tripleList.remove(TRIPLE_TWO);		// delete triple2, triple3 becomes triple2?
						colTriple[TRIPLE_TWO]=colTriple[TRIPLE_THREE];		
						colTriple[TRIPLE_THREE]=-1;				// delete col# of 3rd triple
						rowTriples--;
						System.out.println(tripleList.get(TRIPLE_ONE));
						System.out.println(tripleList.get(TRIPLE_TWO));
						System.out.println("333b: --> 332");
						// break label332;

					} else {

						if (tripleList.get(TRIPLE_TWO).equals(tripleList.get(TRIPLE_THREE))==true) {
							System.out.println("333b: triple2 and 3 are identical");
							tripleList.remove(TRIPLE_ONE);		// delete triple2, triple3 becomes triple2?
							colTriple[TRIPLE_ONE]=colTriple[TRIPLE_TWO];
							colTriple[TRIPLE_TWO]=colTriple[TRIPLE_THREE];
							colTriple[TRIPLE_THREE]=-1;				// delete col# of 3rd triple
							rowTriples--;
							System.out.println(tripleList.get(TRIPLE_ONE));
							System.out.println(tripleList.get(TRIPLE_TWO));
							System.out.println("333b: --> 332");
							// break label332;

						} else {
							System.out.printf("333b: We have 3 unique triples, rowTriples=%d\n", rowTriples);
							found332=false;
							found322=false;
							System.out.println("333b: for each unique triple try --> 322");
							rowTriples=3;		// TEST TEST TEST
							// break label322;

						}
					}
				} 
			}
		}


		/*
		 * 3/3/2
		 */
		label332:

			found332=false;
		if (rowTriples==2) {
			System.out.println("332: 2 TRIPLES");
			if (identicalTriples332(tripleList)==true) {
				System.out.println("332: triple1 and 2 are identical");
				System.out.println(tripleList.get(TRIPLE_ONE));
				System.out.println(tripleList.get(TRIPLE_TWO));
				found332=true;
				int matchingTwins=0;
				if ( (matchingTwins=twinMatchesTriples332(tripleList, twinList, colTwin)) >=1 ) {
					System.out.println("332: %d twin(s) match triple1");
					puzzle.showArray(colTwin);
					System.out.println("332: removeTripleAndTwinCandidates");
					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates

					removeTwinAndTripleCandidatesInRow(candidates, row, tripleList, colTriple, twinList, colTwin );	

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
					if (puzzle.check4NackterEinerInRow( candidates, row )==true) {
						puzzle.check4NackterEinerInColumn(candidates, colTriple[TRIPLE_ONE]);		
						puzzle.check4NackterEinerInColumn(candidates, colTriple[TRIPLE_TWO]); 		
						for (col=0; col<9; col++) {
							if (colTwin[col]!=-1) {
								puzzle.check4NackterEinerInColumn(candidates, colTwin[col]);
							}
						}
					}
					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
					return true;

				} else {
					System.out.println("332: no matching twin found, try '2/2/2'");
					// Wenn bei 332 kein twin passt, entf�llt 3/2/2, aber 2/2/2 ginge noch
					// break label222;

				}


			} else {
				System.out.println("332: triple1 and 2 are not identical, try 3/2/2 for both triples!");
				System.out.println(tripleList.get(TRIPLE_ONE));
				System.out.println(tripleList.get(TRIPLE_TWO));
				found332=false;
				// break label322;

			}
		}

		/*
		 * 3/2/2
		 */
		found322=false;

		// TODO hier m�sste f�r jedes triple (z.B aus 333 mit 3 unterschiedlichen Drillingen 
		if (rowTriples > 1) {
			System.out.printf("rowTriples=%d, run 322 for each TRIPLE!\n", rowTriples);
		}

		int match=0;
		int[]colTwinBackup = new int[9];
		for (r=0; r<rowTriples; r++) {
			List<Integer> tmpTriple=new ArrayList<>();
			tmpTriple.addAll(tripleList.get(r));		// geht das??
			System.out.println(tmpTriple);

			for (i=0; i<colTwin.length; i++) {
				colTwinBackup[i]=colTwin[i];		// geht bestimmt einfacher!!
			}

			System.out.println("322: 1 TRIPLE");
			if ( (matchTwins=twinsMatchTriple(twinList, colTwin, tmpTriple)) >= 2) {
				match++;
				System.out.printf("322: %d twin(s) match(es) triple\n", matchTwins);
				puzzle.showArray(colTwin);
				System.out.println("322: removeTripleAndTwinCandidatesInRow");
				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
				System.out.println(row);
				System.out.println(tmpTriple);
				System.out.println(colTriple[r]);
				puzzle.showArray(colTwin);

				removeTripleAndTwinCandidatesInRow(candidates, row, tmpTriple, colTriple[r], twinList, colTwin);

				if (puzzle.check4NackterEinerInRow( candidates, row )==true) {
					puzzle.check4NackterEinerInColumn(candidates, colTriple[r]);		
					for (col=0; col<9; col++) {
						if (colTwin[col]!=-1) {
							puzzle.check4NackterEinerInColumn(candidates, colTwin[col]);
						}
					}
				}
				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates



			} 
			else {
				System.out.printf("322: number of matchin twins: %d, try next triple ...\n", matchTwins);

				// RESTORE colTwin which may have been corrupted by previous twinsMatchTriple run
				System.out.println("322: RESTORE colTwin which may have been corrupted by previous twinsMatchTriple run");
				for (i=0; i<colTwin.length; i++) {
					colTwin[i]=colTwinBackup[i];		// geht bestimmt einfacher!!
				}
			}

			// All (>=1) Triples have been checked for matching twins

			if (match==0) {
				System.out.println("322: no matching twins found, try '2/2/2'");
				// Wenn bei 322 keine 2 twins passen, kann 2/2/2 noch funktionieren
				// break label222;
			}
			else {
				System.out.printf("322: found matching twins for %d triple(s)\n", match);
				return true;
			}
		}

		/*
		 * 2/2/2		TODO �berarbeite, was ist bei mehr als 3 twins
		 */
		label222:

			finalTriple.clear();

		if ( rowTwins<3 ) {
			System.out.printf("222: Invalid 2/2/2 configuration, not enough twins (%d)\n", rowTwins);
			return false;
		} else {
			System.out.printf("222: %d TWINS, try to build a TRIPLE\n", rowTwins);
			/*
			 * 	convertTwins2Triple	PR�FEN !!! Mehr als 3 Twins ???
			 */
			if (rowTwins==3) {

				if (convertTwins2Triple( twinList, colTwin, finalTriple)==true) {
					System.out.println("222: Valid 2/2/2 configuration");
					puzzle.showArray(colTwin);
					System.out.println(finalTriple);
					System.out.println("222: removeFinalTripleCandidates");
					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
					removeFinalTripleInRow(candidates, row, finalTriple, twinList, colTwinBackup);
					checkRowAndColumns( row, colTwinBackup, puzzle, candidates );
					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

					return true;
				} else {
					System.out.println("222: Can't build triple");
					return false;
				}
			} else {
				System.out.printf("222: %d TWINS (more than 3), try to build a TRIPLE\n", rowTwins);
				// Only handle 4 triples
				if (rowTwins>3) rowTwins=4;		// can't handle more than 4 twins 

				// Geht das so???

				List<Integer> twin1 = twinList.get(0);
				List<Integer> twin2 = twinList.get(1);
				List<Integer> twin3 = twinList.get(2);
				List<Integer> twin4 = twinList.get(3);

				if (convert3Twins2Triple(twin1, twin2, twin3, finalTriple)==true) {
					System.out.println("222: Valid 2/2/2 configuration (123)");
					System.out.println("222: (123) removeFinalTripleCandidates");

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates

					removeFinalTripleInRow(candidates, row, finalTriple, twinList, colTwinBackup);
					checkRowAndColumns( row, colTwinBackup, puzzle, candidates );

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

					//	twin1,2,3: exclude colTwin 0 1 2 

					return true;
				}

				finalTriple.clear();
				if (convert3Twins2Triple(twin1, twin2, twin4, finalTriple)==true) {
					System.out.println("222: Valid 2/2/2 configuration (124)");
					System.out.println("222: (124) removeTripleCandidates");

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates

					removeFinalTripleInRow(candidates, row, finalTriple, twinList, colTwinBackup);
					checkRowAndColumns( row, colTwinBackup, puzzle, candidates );

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

					//	twin1,2,4: exclude colTwin 0 1 3 

					return true;
				}

				finalTriple.clear();
				if (convert3Twins2Triple(twin1, twin3, twin4, finalTriple)==true) {
					System.out.println("222: Valid 2/2/2 configuration (134)");
					System.out.println("222: (134) removeTripleCandidates");

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates

					removeFinalTripleInRow(candidates, row, finalTriple, twinList, colTwinBackup);
					checkRowAndColumns( row, colTwinBackup, puzzle, candidates );

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

					//	twin1,3,4: exclude colTwin 0 2 3 

					return true;
				}

				finalTriple.clear();
				if (convert3Twins2Triple(twin2, twin3, twin4, finalTriple)==true) {
					System.out.println("222: Valid 2/2/2 configuration (234)");
					System.out.println("222: (234) removeTripleCandidates");

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates

					removeFinalTripleInRow(candidates, row, finalTriple, twinList, colTwinBackup);
					checkRowAndColumns( row, colTwinBackup, puzzle, candidates );

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

					//	twin2,3,4: exclude colTwin 1 2 3 


					return true;
				}
			}
		}
		return false;
	}	

	private static void checkRowAndColumns(int row, int[] colTwinBackup, SudokuPuzzle puzzle, int[][][] candidates) {
		/*
		 * Candidates were removed now
		 * 	check for 'nackter Einer' in row
		 * 		if 'nackter Einer' was found, also check the columns where 3 twins were detected and
		 * 		possibly 1 or more 'nackter Einer' were found (and thus a field was solved)-
		 * 		Or would it be better to check all columns for 'nackte Einer'???
		 */
		if (puzzle.check4NackterEinerInRow(candidates, row)==true) {
			for (int i=0; i<colTwinBackup.length; i++ ) {
				if (colTwinBackup[i]!=-1) {
					puzzle.check4NackterEinerInColumn(candidates, colTwinBackup[i]);
				}
			}
		}
	}



	/*
	 * 	REMOVE CANDIDATES IN ROW
	 */
	private static void removeTripleCandidatesInRow(int[][][] candidates, int row, List<List<Integer>> tripleList,
			int[] exclColumns) {
		/*	
		 * 333:	remove triples from candidates in row for remaining 6 fields, 
		 * 		excluded are the 3 field where we detected the triples, 
		 * 		columns to exclude are stored in exclColumns (colTriple).
		 *		As triples are identical triples we only need the first triple 
		 */
		int col;
		List<Integer> triple = tripleList.get(0);		// geht das so?
		System.out.printf("333: removeTripleCandidatesInRow: %d\n", row);
		System.out.println(triple);

		for (col=0; col<9; col++) {
			if (exclColumns[col]==-1) {		// -1 || 0..9
				candidates[row][col][(triple.get(TRIPLE_ONE))-1]=0;			// triple.get(0) = 4; candidate[row][col][4-1) = 0;
				candidates[row][col][(triple.get(TRIPLE_TWO))-1]=0;			// triple.get(1) = 7; candidate[row][col][7-1) = 0;
				candidates[row][col][(triple.get(TRIPLE_THREE))-1]=0;		// triple.get(2) = 9; candidate[row][col][9-1) = 0;
			}
		}
	}

	private static void removeTwinAndTripleCandidatesInRow(int[][][] candidates, int row, List<List<Integer>> tripleList,
			int[] colTriple, List<List<Integer>> twinList,	int[] colTwin) {
		// 332:	Remove triple candidates in row for remaining 9 - (2 Triples + matchingTwin) fields.
		// 		Excluded are the 2 fields where we detected the triples, columns to exclude are stored in colTriple, 
		//  	and matchingTwins fields, columns to exclude are stored in colTwin
		// 		As triples are identical triples we only need the first triple

		int col;
		List<Integer> triple = tripleList.get(0);		// geht das so?
		System.out.printf("332: removeTwinAndTripleCandidatesInRow: %d\n", row);
		System.out.println(triple);
		for (col=0; col<9; col++) {
			if ( (colTriple[col]==-1) || (colTwin[col]==-1) ) {		// -1 || 0..9
				candidates[row][col][(triple.get(TRIPLE_ONE))-1]=0;			// triple.get(0) = 4; candidate[row][col][4-1) = 0;
				candidates[row][col][(triple.get(TRIPLE_TWO))-1]=0;			// triple.get(1) = 7; candidate[row][col][7-1) = 0;
				candidates[row][col][(triple.get(TRIPLE_THREE))-1]=0;		// triple.get(2) = 9; candidate[row][col][9-1) = 0;
			}
		}
	}

	private static void removeTripleAndTwinCandidatesInRow(int[][][] candidates, int row, List<Integer> tmpTriple, int exclColTriple,
			List<List<Integer>> twinList, int[] colTwin) {
		/*	322: 1 triple and 2 or more matching twins,
		 * 		 remove triple and twin candidates, except for those fields where we found the triple or the twins
		 */
		int col;
		System.out.printf("322: removeTripleAndTwinCandidatesInRow %d\n", row);
		System.out.println(tmpTriple);
		for (col=0; col<9; col++) {
			if ( (col==exclColTriple) || (colTwin[col]==-1) ) {		// -1 || 0..9
				candidates[row][col][(tmpTriple.get(TRIPLE_ONE))-1]=0;			// triple.get(0) = 4; candidate[row][col][4-1) = 0;
				candidates[row][col][(tmpTriple.get(TRIPLE_TWO))-1]=0;			// triple.get(1) = 7; candidate[row][col][7-1) = 0;
				candidates[row][col][(tmpTriple.get(TRIPLE_THREE))-1]=0;		// triple.get(2) = 9; candidate[row][col][9-1) = 0;
			}
		}
	}

	private static void removeFinalTripleInRow(int[][][] candidates, int row, List<Integer> finalTriple,
			List<List<Integer>> twinList, int[] exclColTwin) {
		/*
		 * 	222:	finalTriple built from 3 twins, remove triple candidates from remaining 6 fields
		 */
		int col;
		System.out.printf("222: removeFinalTripleInRow %d: ", row);
		System.out.println(finalTriple);
		for (col=0; col<9; col++) {
			if (exclColTwin[col]==-1) {
				for (int i=0; i<9; i++) {
					candidates[row][col][finalTriple.get(TRIPLE_ONE)-1]=0;
					candidates[row][col][finalTriple.get(TRIPLE_TWO)-1]=0;
					candidates[row][col][finalTriple.get(TRIPLE_THREE)-1]=0;
				}
			}
		}
	}

	//	C O L U M N S

	/*
	 *	checkColumn4Drilline 
	 * 
	 */
	public static boolean checkColumn4Drillinge( SudokuPuzzle puzzle, int col, int[][][] candidates, int[] rowTriple) {

		List<Integer> finalTriple = new ArrayList<>();

		List<List<Integer>> tripleList = new ArrayList<List<Integer>>();		
		List<List<Integer>> twinList =   new ArrayList<List<Integer>>();

		int[] candidateCount = {0, 0, 0, 0, 0, 0, 0, 0, 0};	// no. of twins in a row

		// boolean[] foundTriple =	{ false, false, false, false };				// handle max 4 triples
		// boolean[] foundTwin =	{ false, false, false, false, false };		// handle max 5 twins

		int[] rowTwin	= { -1, -1, -1, -1, -1, -1, -1, -1, -1 };			// -1 = no (matching) twin
		//  0..8 = (matching) twin at row 0..8 
		int matchTwins=0;

		int colTriples=0;		// no. of triples found in column
		int colTwins=0;			// no. of twins found in coumn

		finalTriple.clear();

		int row;
		int c;
		int i, j;

		boolean found333 = false;
		boolean found332 = false;
		boolean found322 = false;
		boolean found222 = false;

		// Count candidates for each field in column
		puzzle.countCandidatesColumn(candidates, col, candidateCount);

		// Check for triples and twins in column, column=fix
		for (row=0; row<9; row++) {
			// System.out.println(candidateCount[row]);

			switch (candidateCount[row]) {

			case TWIN:
				twinList.add(new ArrayList<Integer>());		// Neue Liste anlegen und Zwillinge eintragen	
				rowTwin[colTwins]=row;						// store row# where we found twin
				colTwins++;
				System.out.printf("Found twin candidate#%d in row %d, col %d: ", colTwins, row, col);
				for (i=0; i<9; i++) {
					if (candidates[row][col][i] != 0) {
						twinList.get(colTwins-1).add(candidates[row][col][i]);	// add twin candidates to twinList
					}
				}

				System.out.println(twinList.get(colTwins-1));
				System.out.printf("twinList.get(colTwins-1).size())=%d\n", twinList.get(colTwins-1).size());
				System.out.printf("twinList.size()=%d\n", twinList.size());
				break;

			case TRIPLE:
				tripleList.add(new ArrayList<Integer>());		// Neue Liste anlegen und Drilling eintragen	
				rowTriple[colTriples]=row;						// store row# where we found triple 
				colTriples++;	
				System.out.printf("Found triple candidate#%d in row %d, col %d: ", colTriples, row, col);
				for (i=0; i<9; i++) {
					if (candidates[row][col][i] != 0) {
						tripleList.get(colTriples-1).add(candidates[row][col][i]);	// add triple to tripleList
					}
				}
				System.out.println(tripleList.get(colTriples-1));
				System.out.printf("tripleList.get(colTriples-1).size())=%d\n", tripleList.get(colTriples-1).size());
				System.out.printf("tripleList.size()=%d\n", tripleList.size());
				break;

			default:
				break;
			}
		}

		System.out.printf("Found %d triples in col %d\n", colTriples, col);
		for (i=0; i<colTriples; i++) {
			System.out.printf("Triple#%d in row#%d ", i, rowTriple[i]);
			System.out.println(tripleList.get(i));
		}

		System.out.printf("Found %d twins in col %d\n", colTwins, col);
		for (i=0; i<colTwins; i++) {
			System.out.printf("Twins#%d in row#%d ", i, rowTwin[i]);
			System.out.println(twinList.get(i));
		}

		/**
		 *	We have n triples and m twins
		 *
		 *	Possible combinations are	333	332	322	222
		 *	333		3 triples
		 *			a) 	3 triples are identical				-> removeCandidates
		 *			b)	2 of 3 triples are identical		-> 332
		 *			c)	3 unique triples, for each triple	-> 322
		 *					
		 *
		 *	332		2 triples
		 *			a) 2 triples are identical, find matching twin	-> removeCandidates
		 *				aa) no matching twin for triple		-> 322
		 *			b) 2 unique triples, for each triple 	-> 322
		 *				
		 *	322		1 triple
		 *			a)	find 2 matching twins	12-	
		 *										1-3
		 *										-23
		 *			b)	if a) does not work					-> 222
		 *						
		 *				
		 *	222		0 triples, 3 twins make up a triple
		 *			a)	build triple 123 out of 3 twins	12-
		 *												1-3
		 *												-23
		 *			
		 */


		/*
		 * 3/3/3	DAS KANN MAN DOCH BESSER PROGRAMMIEREN!
		 */
		found333=false;
		if (colTriples==3) {
			System.out.println("333: 3 TRIPLES");
			if (identicalTriples333(tripleList)==true) {
				System.out.println("333a: triple1, 2 and 3 are identical");
				System.out.println(tripleList.get(TRIPLE_ONE));
				System.out.println(tripleList.get(TRIPLE_TWO));
				System.out.println(tripleList.get(TRIPLE_THREE));
				found333=true;
				System.out.println("333: removeTripleCandidates");
				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
				// removeTripleCandidatesInRow(candidates, row, tripleList, colTriple);
				removeTripleCandidatesInColumn(candidates, col, tripleList, rowTriple);

				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
				if (puzzle.check4NackterEinerInColumn( candidates, col )==true) {
					puzzle.check4NackterEinerInRow(candidates, rowTriple[TRIPLE_ONE]);		
					puzzle.check4NackterEinerInRow(candidates, rowTriple[TRIPLE_TWO]); 		
					puzzle.check4NackterEinerInRow(candidates, rowTriple[TRIPLE_THREE]); 	
				}
				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
				return true;

			} else {
				System.out.println("333: triple1, 2 and 3 are NOT identical");

				if (tripleList.get(TRIPLE_ONE).equals(tripleList.get(TRIPLE_TWO))==true) {
					System.out.println("333b: triple1 and 2 are identical");
					tripleList.remove(TRIPLE_THREE);		// delete triple3
					rowTriple[TRIPLE_THREE]=-1;				// delete row# of 3rd triple
					colTriples--;							// rowTriples = 2
					System.out.println(tripleList.get(TRIPLE_ONE));
					System.out.println(tripleList.get(TRIPLE_TWO));
					System.out.println("333b: --> 332");
					// break label332;

				} else {

					if (tripleList.get(TRIPLE_ONE).equals(tripleList.get(TRIPLE_THREE))==true) {
						System.out.println("333b: triple1 and 3 are identical");
						tripleList.remove(TRIPLE_TWO);		// delete triple2, triple3 becomes triple2?
						rowTriple[TRIPLE_TWO]=rowTriple[TRIPLE_THREE];		
						rowTriple[TRIPLE_THREE]=-1;				// delete row# of 3rd triple
						colTriples--;							// must be 2 now
						System.out.println(tripleList.get(TRIPLE_ONE));
						System.out.println(tripleList.get(TRIPLE_TWO));
						System.out.println("333b: --> 332");
						// break label332;

					} else {

						if (tripleList.get(TRIPLE_TWO).equals(tripleList.get(TRIPLE_THREE))==true) {
							System.out.println("333b: triple2 and 3 are identical");
							tripleList.remove(TRIPLE_ONE);		// delete triple1, triple2 and 3 become triple1 and 2?
							rowTriple[TRIPLE_ONE]=rowTriple[TRIPLE_TWO];
							rowTriple[TRIPLE_TWO]=rowTriple[TRIPLE_THREE];
							rowTriple[TRIPLE_THREE]=-1;				// delete row# of 3rd triple
							colTriples--;							// must be 2 now
							System.out.println(tripleList.get(TRIPLE_ONE));
							System.out.println(tripleList.get(TRIPLE_TWO));
							System.out.println("333b: --> 332");
							// break label332;

						} else {
							System.out.printf("333b: We have 3 unique triples, colTriples=%d\n", colTriples);
							found332=false;
							found322=false;
							System.out.println("333b: for each unique triple try --> 322");
							colTriples=3;		// TEST TEST TEST
							// break label322;
						}
					}
				} 
			}
		}


		/*
		 * 3/3/2
		 */
		label332:

			found332=false;
		if (colTriples==2) {
			System.out.println("332: 2 TRIPLES");
			if (identicalTriples332(tripleList)==true) {
				System.out.println("332: triple1 and 2 are identical");
				System.out.println(tripleList.get(TRIPLE_ONE));
				System.out.println(tripleList.get(TRIPLE_TWO));
				found332=true;
				int matchingTwins=0;
				if ( (matchingTwins=twinMatchesTriples332(tripleList, twinList, rowTwin)) >=1 ) {
					System.out.println("332: %d twin(s) match triple1");
					puzzle.showArray(rowTwin);
					System.out.println("332: removeTripleAndTwinCandidates");
					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates

					// removeTwinAndTripleCandidatesInRow(candidates, row, tripleList, colTriple, twinList, colTwin );	
					removeTwinAndTripleCandidatesInColumn(candidates, col, tripleList, rowTriple, twinList, rowTwin );	

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
					if (puzzle.check4NackterEinerInColumn( candidates, col )==true) {
						puzzle.check4NackterEinerInRow(candidates, rowTriple[TRIPLE_ONE]);			
						puzzle.check4NackterEinerInRow(candidates, rowTriple[TRIPLE_TWO]); 			
						for (row=0; row<9; row++) {													
							if (rowTwin[row]!=-1) {													
								puzzle.check4NackterEinerInRow(candidates, rowTwin[row]);			
							}
						}
					}
					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
					return true;

				} else {
					System.out.println("332: no matching twin found, try '2/2/2'");
					// Wenn bei 332 kein twin passt, entf�llt 3/2/2, aber 2/2/2 ginge noch
					// break label222;

				}


			} else {
				System.out.println("332: triple1 and 2 are not identical, try 3/2/2 for both triples!");
				System.out.println(tripleList.get(TRIPLE_ONE));
				System.out.println(tripleList.get(TRIPLE_TWO));
				found332=false;
				// break label322;

			}
		}

		/*
		 * 3/2/2
		 */
		found322=false;

		if (colTriples > 1) {
			System.out.printf("colTriples=%d, will run 322 for each TRIPLE!\n", colTriples);
		}

		int match=0;
		int[]rowTwinBackup = new int[9];
		// Check each triple r for matching twins
		for (c=0; c<colTriples; c++) {
			List<Integer> tmpTriple=new ArrayList<>();
			tmpTriple.clear();
			tmpTriple.addAll(tripleList.get(c));		// geht das??
			System.out.println(tmpTriple);

			for (i=0; i<rowTwin.length; i++) {
				rowTwinBackup[i]=rowTwin[i];		// geht bestimmt einfacher!!
			}

			System.out.println("322: 1 TRIPLE");
			// once again: rowTwin contains row numbers of twins found in col
			if ( (matchTwins=twinsMatchTriple(twinList, rowTwin, tmpTriple)) >= 2) {
				match++;
				System.out.printf("322: %d twin(s) match(es) triple\n", matchTwins);
				puzzle.showArray(rowTwin);
				System.out.println("322: removeTripleAndTwinCandidatesInColumn");
				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
				System.out.println(col);
				System.out.println(tmpTriple);
				System.out.println(rowTriple[c]);
				puzzle.showArray(rowTwin);

				// removeTripleAndTwinCandidatesInRow(candidates, row, tmpTriple, colTriple[r], twinList, colTwin);
				removeTripleAndTwinCandidatesInColumn(candidates, col, tmpTriple, rowTriple[c], twinList, rowTwin);

				if (puzzle.check4NackterEinerInColumn(candidates, col )==true) {
					puzzle.check4NackterEinerInRow(candidates, rowTriple[c]);		
					for (row=0; row<9; row++) {
						if (rowTwin[row]!=-1) {
							puzzle.check4NackterEinerInRow(candidates, rowTwin[row]);
						}
					}
				}

				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates



			} 
			else {
				System.out.printf("322: number of matching twins: %d, try next triple ...\n", matchTwins);

				// RESTORE rowTwin which may have been corrupted by previous twinsMatchTriple run
				System.out.println("322: RESTORE rowTwin which may have been corrupted by previous twinsMatchTriple run");
				for (i=0; i<rowTwin.length; i++) {
					rowTwin[i]=rowTwinBackup[i];		// geht bestimmt einfacher!!
				}
			}

			// All (>=1) Triples have been checked for matching twins

			if (match==0) {
				System.out.println("322: no matching twins found, try '2/2/2'");
				// Wenn bei 322 keine 2 twins passen, kann 2/2/2 noch funktionieren
				// break label222;
			}
			else {
				System.out.printf("322: found matching twins for %d triple(s)\n", match);
				return true;
			}
		}

		/*
		 * 2/2/2		TODO �berarbeiten, was ist bei mehr als 3 twins?
		 */
		label222:


			if ( colTwins<3 ) {
				System.out.printf("222: Invalid 2/2/2 configuration, not enough twins (%d)\n", colTwins);
				return false;
			} else {
				System.out.printf("222: %d TWINS, try to build a TRIPLE\n", colTwins);
				/*
				 * 	convertTwins2Triple	PR�FEN !!! Mehr als 3 Twins ???
				 */

				if (colTwins==3) {

					if (convertTwins2Triple( twinList, rowTwin, finalTriple)==true) {
						System.out.println("222: Valid 2/2/2 configuration");
						puzzle.showArray(rowTwin);
						System.out.println(finalTriple);
						System.out.println("222: removeTripleCandidates");

						System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
						removeFinalTripleInColumn(candidates, col, finalTriple, twinList, rowTwinBackup);
						checkColumnAndRows( col, rowTwinBackup, puzzle, candidates );
						System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

						return true;

					} else {
						System.out.println("222: Can't build triple");
						return false;
					}
				} else {
					System.out.printf("222: %d TWINS (more than 3), try to build a TRIPLE\n", colTwins);
					// Only handle 4 triples
					if (colTwins>3) colTwins=4;		// can't hand�e more than 4 twins 

					// Geht das so???

					List<Integer> twin1 = twinList.get(0);
					List<Integer> twin2 = twinList.get(1);
					List<Integer> twin3 = twinList.get(2);
					List<Integer> twin4 = twinList.get(3);

					finalTriple.clear();
					if (convert3Twins2Triple(twin1, twin2, twin3, finalTriple)==true) {
						System.out.println("222: Valid 2/2/2 configuration (123)");
						System.out.println("222: (123) removeTripleCandidates");

						System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
						removeFinalTripleInColumn(candidates, col, finalTriple, twinList, rowTwinBackup);
						checkColumnAndRows( col, rowTwinBackup, puzzle, candidates );
						System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

						//	twin1,2,3: exclude colTwin 0 1 2 

						return true;
					}
					finalTriple.clear();
					if (convert3Twins2Triple(twin1, twin2, twin4, finalTriple)==true) {
						System.out.println("222: Valid 2/2/2 configuration (124)");
						System.out.println("222: (124) removeTripleCandidates");

						System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
						removeFinalTripleInColumn(candidates, col, finalTriple, twinList, rowTwinBackup);
						checkColumnAndRows( col, rowTwinBackup, puzzle, candidates );
						System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

						//	twin1,2,4: exclude colTwin 0 1 3 

						return true;
					}

					finalTriple.clear();
					if (convert3Twins2Triple(twin1, twin3, twin4, finalTriple)==true) {
						System.out.println("222: Valid 2/2/2 configuration (134)");
						System.out.println("222: (134) removeTripleCandidates");

						System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
						removeFinalTripleInColumn(candidates, col, finalTriple, twinList, rowTwinBackup);
						checkColumnAndRows( col, rowTwinBackup, puzzle, candidates );
						System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

						//	twin1,3,4: exclude colTwin 0 2 3 

						return true;
					}

					finalTriple.clear();
					if (convert3Twins2Triple(twin2, twin3, twin4, finalTriple)==true) {
						System.out.println("222: Valid 2/2/2 configuration (234)");
						System.out.println("222: (234) removeTripleCandidates");

						System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
						removeFinalTripleInColumn(candidates, col, finalTriple, twinList, rowTwinBackup);
						checkColumnAndRows( col, rowTwinBackup, puzzle, candidates );
						System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	
						//	twin2,3,4: exclude colTwin 1 2 3 


						return true;
					}
				}
			}
		return false;
	}	



	private static void checkColumnAndRows(int col, int[] rowTwinBackup, SudokuPuzzle puzzle, int[][][] candidates) {
		/*
		 * Candidates were removed now
		 * 	check for 'nackter Einer' in column
		 * 		if 'nackter Einer' was found, also check the rows where 3 twins were detected and
		 * 		possibly 1 or more 'nackter Einer' were found (and thus a field was solved)-
		 * 		Or would it be better to check all rows for 'nackte Einer'???
		 */
		if (puzzle.check4NackterEinerInColumn(candidates, col)==true) {
			for (int i=0; i<rowTwinBackup.length; i++ ) {
				if (rowTwinBackup[i]!=-1) {
					puzzle.check4NackterEinerInRow(candidates, rowTwinBackup[i]);
				}
			}
		}
	}



	private static void removeFinalTripleInColumn(int[][][] candidates, int col, List<Integer> finalTriple,
			List<List<Integer>> twinList, int[] rowTwinBackup) {
		/*
		 * 	222:	finalTriple built from 3 twins, remove triple candidates from remaining 6 fields
		 */
		int row;
		System.out.printf("222: removeFinalTripleInColumn %d: ", col);
		System.out.println(finalTriple);
		for (row=0; row<9; row++) {
			if (rowTwinBackup[row]==-1) {
				for (int i=0; i<9; i++) {
					candidates[row][col][finalTriple.get(TRIPLE_ONE)-1]=0;
					candidates[row][col][finalTriple.get(TRIPLE_TWO)-1]=0;
					candidates[row][col][finalTriple.get(TRIPLE_THREE)-1]=0;
				}
			}
		}
	}

	private static void removeTwinAndTripleCandidatesInColumn(int[][][] candidates, int col,
			List<List<Integer>> tripleList, int[] rowTriple, List<List<Integer>> twinList, int[] rowTwin) {
		// Remove triples from candidates in column for remaining 9 - (2 Triples + matchingTwin) fields.
		// Excluded are the 2 fields where we detected the triples, rows to exclude are stored in rowTriple, 
		//  and matchingTwins fields, rows to exclude are stored in rowTwin
		// As triples are identical triples we only need the first triple

		int row;
		List<Integer> triple = tripleList.get(0);		// geht das so?
		System.out.printf("removeTwinAndTripleCandidatesInColumn: ");
		System.out.println(triple);
		for (row=0; row<9; row++) {
			if ( (rowTriple[row]==-1) || (rowTwin[row]==-1) ) {		// -1 || 0..9
				candidates[row][col][(triple.get(TRIPLE_ONE))-1]=0;			// triple.get(0) = 4; candidate[row][col][4-1) = 0;
				candidates[row][col][(triple.get(TRIPLE_TWO))-1]=0;			// triple.get(1) = 7; candidate[row][col][7-1) = 0;
				candidates[row][col][(triple.get(TRIPLE_THREE))-1]=0;		// triple.get(2) = 9; candidate[row][col][9-1) = 0;
			}
		}
	}



	private static void removeTripleCandidatesInColumn(int[][][] candidates, int col, List<List<Integer>> tripleList,
			int[] exclRowTriple) {
		/*
		 * 	Remove 3 triples from candidates in column for remaining 6 fields,
		 *  excluded are the 3 fields where we detected the triples, rows to exclude are stored in exclRowTriple,
		 *  and as triples are identical triples we only need the values of the first triple
		 */
		int row;
		List<Integer> triple = tripleList.get(0);		// geht das so?
		System.out.printf("removeTripleCandidatesInColumn: ");
		System.out.println(triple);

		for (row=0; row<9; row++) {
			if (exclRowTriple[row]==-1) {		// -1 || 0..9
				candidates[row][col][(triple.get(TRIPLE_ONE))-1]=0;			// triple.get(0) = 4; candidate[row][col][4-1) = 0;
				candidates[row][col][(triple.get(TRIPLE_TWO))-1]=0;			// triple.get(1) = 7; candidate[row][col][7-1) = 0;
				candidates[row][col][(triple.get(TRIPLE_THREE))-1]=0;		// triple.get(2) = 9; candidate[row][col][9-1) = 0;
			}
		}
	}

	private static void removeTripleAndTwinCandidatesInColumn(int[][][] candidates, int col, List<Integer> tmpTriple, int exclRowTriple,
			List<List<Integer>> twinList, int[] rowTwin) {
		/*  
		 * 	322: We have 1 triple and 2 or more matching twins
		 * 	Remove triple and twin candidates, except for those field where we found the triple or the twins
		 */

		int row;
		System.out.printf("removeTripleAndTwinCandidatesInColumn %d: ", col);
		System.out.println(tmpTriple);
		for (row=0; row<9; row++) {
			if ( (row==exclRowTriple) || (rowTwin[row]==-1) ) {		// -1 || 0..9
				candidates[row][col][(tmpTriple.get(TRIPLE_ONE))-1]=0;			// triple.get(0) = 4; candidate[row][col][4-1) = 0;
				candidates[row][col][(tmpTriple.get(TRIPLE_TWO))-1]=0;			// triple.get(1) = 7; candidate[row][col][7-1) = 0;
				candidates[row][col][(tmpTriple.get(TRIPLE_THREE))-1]=0;		// triple.get(2) = 9; candidate[row][col][9-1) = 0;
			}
		}
	}


	// BLOCK BLOCK BLOCK
	// XXX
	/*
	 *	checkBlock4Drillinge 
	 * 
	 */
	public static boolean checkBlock4Drillinge( SudokuPuzzle puzzle, int block, int[][][] candidates, int[] rowTriple, int[] colTriple) {

		List<Integer> finalTriple = new ArrayList<>();

		List<List<Integer>> tripleList = new ArrayList<List<Integer>>();		
		List<List<Integer>> twinList =   new ArrayList<List<Integer>>();

		int[] candidateCount = {0, 0, 0, 0, 0, 0, 0, 0, 0};			// no. of twins in a block
		int[] rowTwin 	= { -1, -1, -1, -1, -1, -1, -1, -1, -1 };	// -1 = no (matching) twin
		//  0..8 = (matching) twin at row 0..8 
		int[]colTwin    =  { -1, -1, -1, -1, -1, -1, -1, -1, -1 };	// -1 = no (matching) twin
		//  0..8 = (matching) twin at row 0..8 
		int matchTwins=0;

		int blockTriples=0;		// no. of triples found in column c
		int blockTwins=0;		// no. of twins found in column c

		finalTriple.clear();

		// First element of subgrid 1..9 starts at row/col...
		int[][] subgridXY = { 	
				{ 0, 0 },	
				{ 0, 3 },
				{ 0, 6 },
				{ 3, 0 },
				{ 3, 3 },
				{ 3, 6 },
				{ 6, 0 },
				{ 6, 3 },
				{ 6, 6 }
		};
		int row=subgridXY[block-1][0];
		int col=subgridXY[block-1][1];

		int r, c;
		int i, j;

		boolean found333 = false;
		boolean found332 = false;
		boolean found322 = false;
		boolean found222 = false;

		// Count candidates for each field in block
		puzzle.countCandidatesBlock(candidates, block, candidateCount);

		// Check for triples and twins in block
		int idx=0;	// idx in candidateCount					
		for (r=row; r<(row+3); r++) {
			for (c=col; c<(col+3); c++) {

				// System.out.println(candidateCount[idx]);

				switch (candidateCount[idx]) {

				case TWIN:
					twinList.add(new ArrayList<Integer>());		// Neue Liste anlegen und Zwillinge eintragen	
					rowTwin[blockTwins]=r;						// store row# where we found twin
					colTwin[blockTwins]=c;						// store col# where we found twin
					System.out.printf("Found twin candidate#%d in row %d, col %d: ", blockTwins, r, c);
					blockTwins++;
					for (i=0; i<9; i++) {
						if (candidates[r][c][i] != 0) {
							twinList.get(blockTwins-1).add(candidates[r][c][i]);	// add twin candidates to twinList
						}
					}
					System.out.println(twinList.get(blockTwins-1));
					System.out.printf("twinList.get(blockTwins-1).size())=%d\n", twinList.get(blockTwins-1).size());
					System.out.printf("twinList.size()=%d\n", twinList.size());
					break;

				case TRIPLE:
					tripleList.add(new ArrayList<Integer>());		// Neue Liste anlegen und Drilling eintragen	
					rowTriple[blockTriples]=r;						// store row# where we found triple 
					colTriple[blockTriples]=c;						// store col# where we found triple 
					System.out.printf("Found triple candidate#%d in row %d, col %d: ", blockTriples, r, c);
					blockTriples++;	
					for (i=0; i<9; i++) {
						if (candidates[r][c][i] != 0) {
							tripleList.get(blockTriples-1).add(candidates[r][c][i]);	// add triple to tripleList
						}
					}
					System.out.println(tripleList.get(blockTriples-1));
					System.out.printf("tripleList.get(blockTriples-1).size())=%d\n", tripleList.get(blockTriples-1).size());
					System.out.printf("tripleList.size()=%d\n", tripleList.size());
					break;

				default:
					break;
				}
				idx++;
			}
		}

		System.out.printf("Found %d triples in block %d\n", blockTriples, block);
		for (i=0; i<blockTriples; i++) {
			System.out.printf("Triple#%d in row %d, col %d ", i, rowTriple[i], colTriple[i]);
			System.out.println(tripleList.get(i));
		}
		puzzle.showArray(candidateCount);

		System.out.printf("Found %d twins in block %d\n", blockTwins, block);
		for (i=0; i<blockTwins; i++) {
			System.out.printf("Twin#%d in row %d, col %d ", i, rowTwin[i], colTwin[i]);
			System.out.println(twinList.get(i));
		}
		puzzle.showArray(candidateCount);

		/**
		 *	We have n triples and m twins
		 *
		 *	Possible combinations are	333	332	322	222
		 *	333		3 triples
		 *			a) 	3 triples are identical				-> removeCandidates
		 *			b)	2 of 3 triples are identical		-> 332
		 *			c)	3 unique triples, for each triple	-> 322
		 *					
		 *
		 *	332		2 triples
		 *			a) 2 triples are identical, find matching twin	-> removeCandidates
		 *				aa) no matching twin for triple		-> 322
		 *			b) 2 unique triples, for each triple 	-> 322
		 *				
		 *	322		1 triple
		 *			a)	find 2 matching twins	12-	
		 *										1-3
		 *										-23
		 *			b)	if a) does not work					-> 222
		 *						
		 *				
		 *	222		0 triples, 3 twins make up a triple
		 *			a)	build triple 123 out of 3 twins	12-
		 *												1-3
		 *												-23
		 *			
		 */


		/*
		 * 3/3/3	DAS KANN MAN DOCH BESSER PROGRAMMIEREN!
		 */
		found333=false;
		if (blockTriples==TRIPLE) {
			System.out.println("333: 3 TRIPLES");
			if (identicalTriples333(tripleList)==true) {
				System.out.println("333a: triple1, 2 and 3 are identical");
				System.out.println(tripleList.get(TRIPLE_ONE));
				System.out.println(tripleList.get(TRIPLE_TWO));
				System.out.println(tripleList.get(TRIPLE_THREE));
				found333=true;
				System.out.println("333: removeTripleCandidates");
				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates

				// removeTripleCandidatesInColumn(candidates, col, tripleList, rowTriple);
				removeTripleCandidatesInBlock333(candidates, block, tripleList, rowTriple, colTriple);

				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
				if (puzzle.check4NackterEinerInBlock( candidates, col )==true) {
					// puzzle.check4NackterEinerInRow(candidates, rowTriple[TRIPLE_ONE]);		
					// puzzle.check4NackterEinerInRow(candidates, rowTriple[TRIPLE_TWO]); 		
					// puzzle.check4NackterEinerInRow(candidates, rowTriple[TRIPLE_THREE]); 	
				}
				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
				return true;

			} else {
				System.out.println("333: triple1, 2 and 3 are NOT identical");

				if (tripleList.get(TRIPLE_ONE).equals(tripleList.get(TRIPLE_TWO))==true) {
					System.out.println("333b: triple1 and 2 are identical");
					tripleList.remove(TRIPLE_THREE);		// delete triple3
					rowTriple[TRIPLE_THREE]=-1;				// delete row# of 3rd triple
					colTriple[TRIPLE_THREE]=-1;				// delete col# of 3rd triple
					blockTriples--;							// blockTriples = 2
					System.out.println(tripleList.get(TRIPLE_ONE));
					System.out.println(tripleList.get(TRIPLE_TWO));
					System.out.println("333b: --> 332");
					// break label332;

				} else {

					if (tripleList.get(TRIPLE_ONE).equals(tripleList.get(TRIPLE_THREE))==true) {
						System.out.println("333b: triple1 and 3 are identical");
						tripleList.remove(TRIPLE_TWO);		// delete triple2, triple3 becomes triple2?
						rowTriple[TRIPLE_TWO]=rowTriple[TRIPLE_THREE];	
						colTriple[TRIPLE_TWO]=colTriple[TRIPLE_THREE];	
						rowTriple[TRIPLE_THREE]=-1;				// delete row# of 3rd triple
						colTriple[TRIPLE_THREE]=-1;	
						blockTriples--;							// must be 2 now
						System.out.println(tripleList.get(TRIPLE_ONE));
						System.out.println(tripleList.get(TRIPLE_TWO));
						System.out.println("333b: --> 332");
						// break label332;

					} else {

						if (tripleList.get(TRIPLE_TWO).equals(tripleList.get(TRIPLE_THREE))==true) {
							System.out.println("333b: triple2 and 3 are identical");
							tripleList.remove(TRIPLE_ONE);		// delete triple1, triple2 and 3 become triple1 and 2?
							rowTriple[TRIPLE_ONE]=rowTriple[TRIPLE_TWO];
							colTriple[TRIPLE_ONE]=colTriple[TRIPLE_TWO];

							rowTriple[TRIPLE_TWO]=rowTriple[TRIPLE_THREE];
							colTriple[TRIPLE_TWO]=colTriple[TRIPLE_THREE];

							rowTriple[TRIPLE_THREE]=-1;				// delete row# of 3rd triple
							colTriple[TRIPLE_THREE]=-1;				// delete col# of 3rd triple

							blockTriples--;							// must be 2 now
							System.out.println(tripleList.get(TRIPLE_ONE));
							System.out.println(tripleList.get(TRIPLE_TWO));
							System.out.println("333b: --> 332");
							// break label332;

						} else {
							System.out.printf("333b: We have 3 unique triples, blockTriples=%d\n", blockTriples);
							found332=false;
							found322=false;
							System.out.println("333b: for each unique triple try --> 322");
							blockTriples=3;		// TEST TEST TEST
							// break label322;
						}
					}
				} 
			}
		}

		/*
		 * 3/3/2	muss noch angepasst werden
		 */
		label332:


			found332=false;
		if (blockTriples==TWIN) {
			System.out.println("332: 2 TRIPLES");
			if (identicalTriples332(tripleList)==true) {
				System.out.println("332: triple1 and 2 are identical");
				System.out.println(tripleList.get(TRIPLE_ONE));
				System.out.println(tripleList.get(TRIPLE_TWO));
				found332=true;
				int matchingTwins;
				if ( (matchingTwins=twinMatchesTriples332(tripleList, twinList, rowTwin)) >=1 ) {
					System.out.println("332: %d twin(s) match triple1");
					puzzle.showArray(rowTwin);
					System.out.println("332: removeTripleAndTwinCandidates");
					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
					puzzle.showCandidatesBlock(candidates, block);
					if (removeTwinAndTripleCandidatesInBlock(candidates, block, tripleList, rowTriple, colTriple, 
							twinList, rowTwin, colTwin )==true) {

						puzzle.showCandidatesBlock(candidates, block);
						System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
						if (puzzle.check4NackterEinerInBlock( candidates, block )==true) {
							// ??? puzzle.check4NackterEinerInRow(candidates, rowTriple[TRIPLE_ONE]);			
							// ??? puzzle.check4NackterEinerInRow(candidates, rowTriple[TRIPLE_TWO]); 			
							//for (row=0; row<9; row++) {													
							//	if (rowTwin[row]!=-1) {													
							//		puzzle.check4NackterEinerInRow(candidates, rowTwin[row]);			
							//	}
							//}
							System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
						}

					}
					return true;

				} else {
					System.out.println("332: no matching twin found, try '2/2/2'");
					// Wenn bei 332 kein twin passt, entf�llt 3/2/2, aber 2/2/2 ginge noch
					// break label222;
				}

			} else {
				System.out.println("332: triple1 and 2 are not identical, try 3/2/2 for both triples!");
				System.out.println(tripleList.get(TRIPLE_ONE));
				System.out.println(tripleList.get(TRIPLE_TWO));
				found332=false;
				// break label322;
			}
		}

		/*
		 * 3/2/2		in Arbeit
		 */
		found322=false;
		int[] rowTwinBackup = new int[9];
		int [] colTwinBackup =  new int[9];

		if (blockTriples > 1) {
			System.out.printf("blockTriples=%d, will run 322 for each TRIPLE!\n", blockTriples);
		}

		int match=0;
		int[]blockTwinBackup = new int[9];
		// Check each triple trp for matching twins
		for (int trp=0; trp<blockTriples; trp++) {
			List<Integer> tmpTriple=new ArrayList<>();
			tmpTriple.clear();
			tmpTriple.addAll(tripleList.get(trp));		// geht das??
			System.out.println(tmpTriple);

			/*
			 * 	removeTwinAndTripleCandidatesInBlock modifies rowTwin and colTwin (row/col of Twins found in block) if
			 * 	twins does not match triple. But twins may match another triple (if 2 or more unique triples were found),
			 * 	so we need a backup of the original rowTwin/colTwin. Understood??
			 */
			// backup colTwin and rowTwin
			for (i=0; i<rowTwin.length; i++) {
				rowTwinBackup[i]=rowTwin[i];		// geht bestimmt einfacher!!
				colTwinBackup[i]=colTwin[i];		// geht bestimmt einfacher!!
			}

			System.out.println("322: 1 TRIPLE");
			// once again: rowTwin contains row numbers of twins found in col
			if ( (matchTwins=twinsMatchTripleInBlock(block, twinList, rowTwin, colTwin, tmpTriple)) >= 2) {
				match++;
				System.out.printf("322: %d twin(s) match(es) triple\n", matchTwins);
				puzzle.showArray(rowTriple);
				puzzle.showArray(colTriple);
				puzzle.showArray(rowTwin);
				puzzle.showArray(colTwin);
				System.out.println("322: removeTripleAndTwinCandidatesInBlock");
				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
				System.out.println(block);
				System.out.println(tmpTriple);

				if (removeTwinAndTripleCandidatesInBlock(candidates, block, tripleList, rowTriple, colTriple, 
						twinList, rowTwinBackup, colTwinBackup)==true) {
					if (puzzle.check4NackterEinerInBlock(candidates, block )==true) {
						/*
						 * TODO
						 *  Auch row und col (des ganzen Puzzles nicht nur des Blocks) pr�fen?
						// 	besser w�re es, wenn check4NackterEinerInBlock -1 oder 1..9 zur�ckgibt statt true/false
						 */
						;
					}
				}															
				System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
			} 
			else {
				System.out.printf("322: number of matching twins: %d, try next triple ...\n", matchTwins);

				// RESTORE rowTwin and colTwin which may have been corrupted by previous twinsMatchTripleInBlock run

				System.out.println("322: ***restore*** rowTwin/colTwin which may have been corrupted by previous twinsMatchTripleInBlock run");
				for (i=0; i<rowTwin.length; i++) {
					rowTwin[i]=rowTwinBackup[i];		// geht bestimmt einfacher!!
				}
				for (i=0; i<colTwin.length; i++) {
					colTwin[i]=colTwinBackup[i];		// geht bestimmt einfacher!!
				}
			}

			// All (>=1) Triples have been checked for matching twins

			if (match==0) {
				System.out.println("322: no matching twins found, try '2/2/2'");
				// Wenn bei 322 keine 2 twins passen, kann 2/2/2 noch funktionieren
				// break label222;
			}
			else {
				System.out.printf("322: found matching twins for %d triple(s)\n", match);
				return true;
			}
		}
		/*
		 * 2/2/2		TODO �berarbeiten, was ist bei mehr als 3 twins?
		 */
label222:


		if ( blockTwins<3 ) {
			System.out.printf("222: Invalid 2/2/2 configuration, not enough twins (%d)\n", blockTwins);
			return false;
		} else {
			System.out.printf("222: %d TWINS, try to build a TRIPLE\n", blockTwins);
			/*
			 * 	convertTwins2Triple	PR�FEN !!! Mehr als 3 Twins ???
			 */

			if (blockTwins==3) {
				finalTriple.clear();	
				if (convertTwins2Triple( twinList, rowTwin, finalTriple)==true) {
					System.out.println(finalTriple);
					System.out.println("222: Valid 2/2/2 configuration");
					puzzle.showArray(rowTwin);
					puzzle.showArray(colTwin);
					System.out.println(finalTriple);
					System.out.println("222: removeTripleCandidates");

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
					
					removeTripleCandidatesInBlock(candidates, block, finalTriple, rowTriple, colTriple, twinList, rowTwin, colTwin);
					
					
					// checkColumnAndRows( col, rowTwinBackup, puzzle, candidates );
					
					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

					return true;

				} else {
					System.out.println("222: Can't build triple");
					return false;
				}
			} else {
				System.out.printf("222: %d TWINS (more than 3), try to build a TRIPLE\n", blockTwins);
				// Only handle 4 triples
				if (blockTwins>3) blockTwins=4;		// can't hand�e more than 4 twins 

				// Geht das so???

				List<Integer> twin1 = twinList.get(0);
				List<Integer> twin2 = twinList.get(1);
				List<Integer> twin3 = twinList.get(2);
				List<Integer> twin4 = twinList.get(3);

				finalTriple.clear();
				if (convert3Twins2Triple(twin1, twin2, twin3, finalTriple)==true) {
					System.out.println("222: Valid 2/2/2 configuration (123)");
					System.out.println("222: (123) removeTripleCandidates");

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
					// removeFinalTripleInColumn(candidates, col, finalTriple, twinList, rowTwinBackup);
					
					removeTripleCandidatesInBlock(candidates, block, finalTriple, rowTriple, colTriple, twinList, rowTwin, colTwin);
					
					// checkColumnAndRows( col, rowTwinBackup, puzzle, candidates );
					
					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

					//	twin1,2,3: exclude colTwin 0 1 2 

					return true;
				}
				finalTriple.clear();
				if (convert3Twins2Triple(twin1, twin2, twin4, finalTriple)==true) {
					System.out.println("222: Valid 2/2/2 configuration (124)");
					System.out.println("222: (124) removeTripleCandidates");

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
					// removeFinalTripleInColumn(candidates, col, finalTriple, twinList, rowTwinBackup);
					
					removeTripleCandidatesInBlock(candidates, block, finalTriple, rowTriple, colTriple, twinList, rowTwin, colTwin);
										
					// checkColumnAndRows( col, rowTwinBackup, puzzle, candidates );
					
					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

					//	twin1,2,4: exclude colTwin 0 1 3 

					return true;
				}

				finalTriple.clear();
				if (convert3Twins2Triple(twin1, twin3, twin4, finalTriple)==true) {
					System.out.println("222: Valid 2/2/2 configuration (134)");
					System.out.println("222: (134) removeTripleCandidates");

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
					// removeFinalTripleInColumn(candidates, col, finalTriple, twinList, rowTwinBackup);
					removeTripleCandidatesInBlock(candidates, block, finalTriple, rowTriple, colTriple, twinList, rowTwin, colTwin);
					// checkColumnAndRows( col, rowTwinBackup, puzzle, candidates );
					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	

					//	twin1,3,4: exclude colTwin 0 2 3 

					return true;
				}

				finalTriple.clear();
				if (convert3Twins2Triple(twin2, twin3, twin4, finalTriple)==true) {
					System.out.println("222: Valid 2/2/2 configuration (234)");
					System.out.println("222: (234) removeTripleCandidates");

					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates
					//removeFinalTripleInColumn(candidates, col, finalTriple, twinList, rowTwinBackup);
					
					removeTripleCandidatesInBlock(candidates, block, finalTriple, rowTriple, colTriple, twinList, rowTwin, colTwin);
					
					//checkColumnAndRows( col, rowTwinBackup, puzzle, candidates );
					System.out.println(puzzle.candidateCount(candidates));	// Show remaining number of candidates	
					//	twin2,3,4: exclude colTwin 1 2 3 


					return true;
				}
			}
		}		

		return true;
	}

	private static boolean removeTripleCandidatesInBlock(int[][][] candidates, int block, List<Integer> triple,
			int[] rowTriple, int[] colTriple, List<List<Integer>> twinList, int[] rowTwin, int[] colTwin) {
		// TODO Auto-generated method stub
		/*
		 * 322:	remove 1 triple and 2 twin candidates in block
		 */
		int r, row;
		int c, col;
		boolean removedCandidates=false;

		// First element of subgrid 1..9 starts at row/col...
		int[][] subgridXY = { 	
				{ 0, 0 },	
				{ 0, 3 },
				{ 0, 6 },
				{ 3, 0 },
				{ 3, 3 },
				{ 3, 6 },
				{ 6, 0 },
				{ 6, 3 },
				{ 6, 6 }
		};
		row=subgridXY[block-1][0];
		col=subgridXY[block-1][1];

		System.out.printf("222: removeTripleCandidatesInBlock %d\n", block);

		int idx=0;
		for (r=row; r<(row+3); r++) {
			for(c=col; c<(col+3); c++) {
				if ( (rowTriple[idx]==-1 && colTriple[idx]==-1) || 
						(rowTwin[idx]==-1 && colTwin[idx]==-1) ) {

					candidates[r][c][(triple.get(TRIPLE_ONE))-1]=0;		// triple.get(0) = 4; candidate[row][col][4-1) = 0;
					candidates[r][c][(triple.get(TRIPLE_TWO))-1]=0;		// triple.get(1) = 7; candidate[row][col][7-1) = 0;
					candidates[r][c][(triple.get(TRIPLE_THREE))-1]=0;		// triple.get(2) = 9; candidate[row][col][9-1) = 0;
					removedCandidates=true;
				}
			}
			idx++;
		}
		return removedCandidates;
		
	}



	private static boolean removeTwinAndTripleCandidatesInBlock(int[][][] candidates, int block,
			List<List<Integer>> tripleList, int[] rowTriple, int[] colTriple, List<List<Integer>> twinList,
			int[] rowTwin, int[] colTwin) {
		/*
		 * 322:	remove 1 triple and 2 twin candidates in block
		 */
		int r, row;
		int c, col;

		List<Integer> triple = tripleList.get(TRIPLE_ONE); 	

		// First element of subgrid 1..9 starts at row/col...
		int[][] subgridXY = { 	
				{ 0, 0 },	
				{ 0, 3 },
				{ 0, 6 },
				{ 3, 0 },
				{ 3, 3 },
				{ 3, 6 },
				{ 6, 0 },
				{ 6, 3 },
				{ 6, 6 }
		};
		row=subgridXY[block-1][0];
		col=subgridXY[block-1][1];

		System.out.printf("322: removeTwinAndTripleCandidatesInBlock %d\n", block);

		int idx=0;
		boolean rmCandidates=false;
		for (r=row; r<(row+3); r++) {
			for(c=col; c<(col+3); c++) {
				if ( (rowTriple[idx]==-1 && colTriple[idx]==-1) || 
						(rowTwin[idx]==-1 && colTwin[idx]==-1) ) {

					candidates[r][c][(triple.get(TRIPLE_ONE))-1]=0;		// triple.get(0) = 4; candidate[row][col][4-1) = 0;
					candidates[r][c][(triple.get(TRIPLE_TWO))-1]=0;		// triple.get(1) = 7; candidate[row][col][7-1) = 0;
					candidates[r][c][(triple.get(TRIPLE_THREE))-1]=0;		// triple.get(2) = 9; candidate[row][col][9-1) = 0;
					rmCandidates=true;
				}
			}
			idx++;
		}
		return rmCandidates;
	}


	private static int twinsMatchTripleInBlock(int block, List<List<Integer>> twinList, int[] rowTwin, int[] colTwin,
			List<Integer> tmpTriple) {
		/*
		 * 322	check and return number of twins that match triple in block
		 */
		int i;
		int matchingTwins=0;

		System.out.println(twinList.size());
		for (i=0; i<twinList.size(); i++) {
			if (tmpTriple.containsAll(twinList.get(i))) {
				System.out.printf("322: Twin#%d matches triple\n", i);
				matchingTwins++;
			} else {
				System.out.printf("322: Twin#%d does not match triple\n", i);
				rowTwin[i]=-1;			// delete row and column# of non-matching twin
				colTwin[i]=-1;
			}
		}
		return matchingTwins;
	}





	private static void removeTripleCandidatesInBlock333(int[][][] candidates, int block, List<List<Integer>> tripleList,
			int[] rowTriple, int[] colTriple) {
		/*
		 * 	333:	3 triples	
		 * 	Remove 3 triples from candidates in block for remaining 6 fields,
		 *  excluded are the 3 fields where we detected the triples, rows and cols to exclude are stored in exclRowTriple,
		 *  and exclColTriple
		 *  and as triples are identical triples we only need the values of the first triple
		 */
		// First element of subgrid 1..9 starts at row/col...
		int r, row;
		int c, col;

		int[][] subgridXY = { 	
				{ 0, 0 },	
				{ 0, 3 },
				{ 0, 6 },
				{ 3, 0 },
				{ 3, 3 },
				{ 3, 6 },
				{ 6, 0 },
				{ 6, 3 },
				{ 6, 6 }
		};
		row=subgridXY[block-1][0];
		col=subgridXY[block-1][1];

		List<Integer> triple = tripleList.get(0);		// geht das so?


		System.out.printf("removeTripleCandidatesInBlock %d\n", block);
		System.out.println(triple);

		for (r=row; r<(row+3); r++) {
			for(c=col; c<(col+3); c++) {
				if (  !	((r == rowTriple[TRIPLE_ONE]) && (c == colTriple[TRIPLE_ONE])) 		&&
						((r == rowTriple[TRIPLE_TWO]) && (c == colTriple[TRIPLE_TWO])) 		&&
						((r == rowTriple[TRIPLE_THREE]) && (c == colTriple[TRIPLE_THREE])) ) {

					candidates[r][c][(triple.get(TRIPLE_ONE))-1]=0;		// triple.get(0) = 4; candidate[row][col][4-1) = 0;
					candidates[r][c][(triple.get(TRIPLE_TWO))-1]=0;		// triple.get(1) = 7; candidate[row][col][7-1) = 0;
					candidates[r][c][(triple.get(TRIPLE_THREE))-1]=0;		// triple.get(2) = 9; candidate[row][col][9-1) = 0;
				}
			}
		}
	}

	/*
	 * 	IDENTICAL, MATCH, CONVERT, IDENTICAL, ...
	 */
	private static boolean identicalTriples333(List<List<Integer>> tripleList) {
		/**
		 * Check if three triples are identical
		 */
		return  ( tripleList.get(TRIPLE_ONE).equals(tripleList.get(TRIPLE_TWO)) && 
				tripleList.get(TRIPLE_TWO).equals(tripleList.get(TRIPLE_THREE)) ) ; 
	}

	private static boolean identicalTriples332(List<List<Integer>> tripleList) {
		/**
		 * Check if two triples are identical
		 */
		return ( tripleList.get(TRIPLE_ONE).equals(tripleList.get(TRIPLE_TWO)) );
	}

	private static int twinsMatchTriple(List<List<Integer>> twinList, int[] colTwin, List<Integer> tmpTriple) {
		/*
		 * 322:	1 triple, check for 2 matching twins
		 */
		int i;
		int matchingTwins=0;
		System.out.println(twinList.size());
		for (i=0; i<twinList.size(); i++) {
			if (tmpTriple.containsAll(twinList.get(i))) {
				System.out.printf("322: Twin#%d matches triple\n", i);
				matchingTwins++;
			} else {
				System.out.printf("322: Twin#%d does not match triple\n", i);
				colTwin[i]=-1;
				/*
				 *	delete non-matching twin. 	But if this twins matches another triple???
				 *	???????????????????????????????????????????????????????????????????????
				 */	 
			}
		}
		return matchingTwins;
	}

	private static boolean twinsMatchTriple322(List<List<Integer>> tripleList, List<List<Integer>> twinList, int[] colTwin) {
		/**
		 * 322:	1 triple needs 2 or more matching twins
		 */
		boolean match=false;
		int i;
		int twins=0;
		for (i=0; i<twinList.size(); i++) {
			if (tripleList.get(TRIPLE_ONE).containsAll(twinList.get(i))) {
				System.out.printf("322: Twin#%d matches TRIPLE_ONE\n", i);
				twins++;
				match=true;
			} else {
				System.out.printf("322: Twin#%d does not match TRIPLE_ONE\n", i);
				colTwin[i]=-1;		// delete non-matching twin
			}
		}
		return (match && (twins>=2));
	}	


	private static boolean convertTwins2Triple(List<List<Integer>> twinList, int[] colTwin, List<Integer> finalTriple) {
		/*
		 * 	Try to build a valid triple out of 3 (or more?) twins
		 * 	
		 */
		int i;
		System.out.printf("convertTwins2Triple: 222: add twins to triple ...\n");
		System.out.println(twinList.size());
		for (i=0; i<twinList.size(); i++) {
			System.out.println(twinList.get(i));
			finalTriple.addAll(twinList.get(i));
		}
		Collections.sort(finalTriple);
		System.out.println(finalTriple);

		finalTriple=Uniques.getUniques(finalTriple);
		System.out.println(finalTriple.size());
		if (finalTriple.size() != TRIPLE ) {
			System.out.printf("convertTwins2Triple: 222: Invalid configuration (finalTriple.size()=%d), can not build triple of twins\n", finalTriple.size());
		} else {
			System.out.println("convertTwins2Triple: 222: Valid configuration!");
			System.out.println(finalTriple);
			return true;
		}
		return false;
	}

	private static boolean convert3Twins2Triple(List<Integer> twin1, List<Integer> twin2, List<Integer> twin3, List<Integer> finalTriple) {
		/*
		 * 	222:	Try to build a valid triple out of exact 3 twins
		 */
		// List<Integer> tmpTriple = new ArrayList<>();
		// tmpTriple.clear();
		finalTriple.clear();

		System.out.printf("222: convert3Twins2Triple: 222: add 3 twins to triple ...\n");
		System.out.println(twin1);
		System.out.println(twin2);
		System.out.println(twin3);

		finalTriple.addAll(twin1);
		finalTriple.addAll(twin2);
		finalTriple.addAll(twin3);
		
		Collections.sort(finalTriple);
		System.out.println(finalTriple);
		finalTriple=Uniques.getUniques(finalTriple);
		System.out.println(finalTriple);

		if (finalTriple.size() == TRIPLE ) {
			System.out.println("222: Valid configuration!");
			return true;

		} else {
			System.out.printf("222: Invalid configuration (triple.size()=%d), can not build triple of 3 twins\n", finalTriple.size());	
		}
		return false;
	}

	private static int twinMatchesTriples332(List<List<Integer>> tripleList, List<List<Integer>> twinList, int[] colTwin) {
		/**
		 * 332:	2 identical triples and 1 or more twins
		 * 	Check if 1 (or more) twins match triple
		 * 	return number of matching twins
		 * 	modifies colTwin/rowTwin
		 */
		int i;
		int matchingTwins=0;
		for (i=0; i<twinList.size(); i++) {
			if (tripleList.get(TRIPLE_ONE).containsAll(twinList.get(i))) {
				System.out.printf("332: Twin#%d matches TRIPLE_ONE\n", i);
				matchingTwins++;
			} else {
				System.out.printf("332: Twin#%d does not match TRIPLE_ONE\n", i);
				colTwin[i]=-1;		// delete non-matching twin
			}
		}
		return matchingTwins;
	}

	private static void subgridXY() {		// First element of subgrid 1..9 starts at row/col...
		int[][] subgridXY = { 	
				{ 0, 0 },	
				{ 0, 3 },
				{ 0, 6 },
				{ 3, 0 },
				{ 3, 3 },
				{ 3, 6 },
				{ 6, 0 },
				{ 6, 3 },
				{ 6, 6 }
		};
	}
}
