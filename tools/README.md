# bulk-add-games

This tool adds games to the database using CSV files containing game
information. 

## Usage 

1.  Create a base directory to store your CSV files
2.  Inside the base directory, create a directory for each console, using the
    console's **shortname**.
3.  Place CSV files containing all the games in this directory

An example directory structure is below:

```
.
├── PS2
│   └── gameslist.csv
└── WIN
    ├── A.csv
    ├── B.csv
    └── C.csv
```

After creating the directory structure, you can import your games.

    node ./tools/bulk-add-games.js /path/to/basedir/

NOTE: In order for the tool to connect to the database, you must run this tool
from the base directory (the one containing .env)

## CSV file requirements

CSV files contain the following data: `Title,Released,Developer`

Each game line should look similar to `Half-Life,1998,Valve`


## How to create the CSV files

1.  Go to Wikipedia. Look for a list, such as "[List of Windows Games][0]"

2.  Use the [Wikitable2csv][1] tool and download the resulting csv data

3.  Open the csv file in Excel

4.  In Excel, delete ALL columns other than Title/Name, Release Date, and
    Developer

5.  Make sure the columns are in this order: TITLE, RELEASE DATE, DEVELOPER
    * Likewise, ensure the columns use the header structure as shown above.

6.  If there is more than one header, delete them. Only the first line should
    be a header. Every line past the first line should be a game.

7.  Delete any lines that don't contain a release date.
    Examples: N/A, Unreleased, TBA

8.  Remove the exact date so it only goes by a release year 
    1. Right click the "Released" column, and select "Format Cells"
    2. Under Category, select "Custom"
    3. In the "Type" box, type in "yyyy"
    4. Click OK

9.  Save the file as CSV

10. Add the CSV file to the corresponding device's directory

[0]:https://en.wikipedia.org/wiki/Index_of_Windows_games
[1]:https://wikitable2csv.ggor.de/
