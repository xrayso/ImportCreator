# Import Creator

A static, privacy-first questionnaire for producing an Epic EMP INI text file.
Responses remain in the visitor's browser and are never submitted to a server.

The export begins with `##INI=EMP`, uses `item,value` rows, automatically adds
the required blank template companion rows, and writes each multi-value job
field on a single row: the number of entries followed by every value, all
joined by Control-A separators (e.g. `19611,3␁2␁1␁2` holds three entries).

## GitHub Pages

Publish this repository from the `main` branch and the repository root. No
build step is required.
