# Import Creator

A static, privacy-first questionnaire for producing an Epic EMP INI text file.
Responses remain in the visitor's browser and are never submitted to a server.

The export begins with `##INI=EMP`, uses `item,value` rows, automatically adds
the required blank template companion rows, and writes each multi-value job
entry as its own row: the row number and value joined by a Control-A separator
(e.g. `19611,1␁2` means row 1 has the value 2).

## GitHub Pages

Publish this repository from the `main` branch and the repository root. No
build step is required.
