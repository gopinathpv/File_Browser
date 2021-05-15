# File Browser

File Browser is intended to provide a user a simple UI to explore a file system. The server exposes a GraphQL API that allows the front end application to read the file system entries and their metadata so that it can be displayed to the user.

# Implementation 
1.  App Support filtering by 
    -  File size ( max) - filter by adding number 
    -  Entry Name - Filter by text 
    -  Entry Type - filter by dropdown
2. Added Loading and error States
3. Filter Working through all the directories 
4. On clicking the file types the file will be downloaded.
5. Tried improving filter designs.

# Changes on server Side
1. Changed where.name_contains to where.name_contains.toLowerCase() for filtering. 
    - (!tmpEntry?.name.toLowerCase().includes(where.name_contains.toLowerCase()))



