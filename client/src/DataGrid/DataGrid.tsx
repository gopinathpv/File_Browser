import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import Alert from '@material-ui/lab/Alert';
import { useListEntriesQuery } from "../generated-api";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  }
});

const tableheaders = ["Path", "Name", "Type", "Size"]
const DataGrid = () => {
  const classes = useStyles();
  const [sizeGt, setSizeGt] = React.useState(0);
  const [typeEq, setTypeEq] = React.useState('All');
  const [nameContains, setNameContains] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataContent, setDataContent] = React.useState<{ id: any, path: string, __typename: string, name: string, size: number }[]>([{
    id: '/',
    path: '/',
    __typename: '',
    name: '',
    size: 0
  }])
  const [currentPath, setCurrentPath] = React.useState('/')
  const [history, updateHistory] = React.useState<{ id: string, path: string }[]>(
    [{
      id: '/',
      path: '/',
    }]
  )
  const { data, loading, error } = useListEntriesQuery({
    variables: {
      path: currentPath,
      page,
      where: {
        type_eq: typeEq,
        size_gt: sizeGt,
        name_contains: nameContains
      }
    },
  });

  React.useEffect(() => {
    setCurrentPath(history[history.length - 1].path)
    rows()
  }, [history, data?.listEntries])

  const rows = () => {
    const dataRows = data?.listEntries?.entries ?? [] as any
    const values = [
      ...(history.length > 1
        ? [
          {
            id: history[history.length - 2].id,
            path: history[history.length - 2].path,
            name: 'UP_DIR',
            __typename: 'UP_DIR'
          }
        ]
        : []),
      ...dataRows,
    ]
    setDataContent(values)
  }

  const options = React.useMemo(() => {
    const values = ['All'] as any
    data?.listEntries?.entries.map((entry) => {
      if (!values.includes(entry?.__typename)) {
        values.push(entry?.__typename)
      }
    })
    return values
  }, [data?.listEntries?.entries])

  const handleDelete = () => {
    setSizeGt(0)
  }

  const handleNameDelete = () => {
    setNameContains("")
  }

  const handleTypeDelete = () => {
    setTypeEq('All')
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  if (loading) return <Typography color='primary' >Loading...</Typography >;
  if (error) return <Alert severity="error">This is an error  {error.message}</Alert>;
  return (
    <Box className="MainBox">
      <Box flexGrow={1}>
        <Paper>
          <Toolbar>
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Typography variant="h6">File Browser</Typography>
            </Box>
          </Toolbar>
          <TableContainer>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Box>
                      <Chip color="primary" onDelete={handleNameDelete}
                        label={<Box><input onChange={(e) => setNameContains(e.currentTarget.value)} type="text" value={nameContains} placeholder="Enter Name To Filter" /> </Box>} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Chip color="primary" onDelete={handleTypeDelete}
                        label={<Box>
                          <select value={typeEq} onChange={(e) => setTypeEq(e.currentTarget.value)}>
                            {options.map((__typename: any, index: any) => {
                              return <option key={index} value={__typename}>{__typename} </option>
                            })}
                          </select>
                        </Box>} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Chip color="primary" onDelete={handleDelete}
                        label={<Box><strong>File Size &gt;</strong>
                          <input onChange={(e) => setSizeGt(Number(e.currentTarget.value))} type="number" value={sizeGt} />
                        </Box>} />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  {tableheaders.map((item, index) => {
                    return <TableCell key={index}><strong>{item}</strong>
                    </TableCell>
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataContent.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const isUpDir = row.__typename === 'UP_DIR'
                  return (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        <Button
                          color="primary"
                          startIcon={isUpDir ? (<MoreHorizIcon />) : (row.__typename === 'File' ? null : <SubdirectoryArrowRightIcon />)}
                          onClick={() => {
                            if(row.__typename === "File"){
                              const url = window.URL.createObjectURL(new Blob(['']));
                              const link = document.createElement('a');
                              link.href = url;
                              link.setAttribute('download', row.name);
                              document.body.appendChild(link);
                              link.click();
                            }
                            if(row.__typename === "Directory" || row.__typename === 'UP_DIR'){
                            updateHistory((h) => {
                              if (isUpDir && h.length > 1) {
                                setPage(0)
                                return [...h.splice(0, h.length - 1)]
                              } else {
                                return ([...h, { id: row.path, path: row.path }])
                              }
                            })}
                          }}>
                          {!isUpDir ? row.path : ''}
                        </Button>
                      </TableCell>
                      <TableCell >{isUpDir ? '_' : row.name}</TableCell>
                      <TableCell >{isUpDir ? '_' : row.__typename}</TableCell>
                      <TableCell >{isUpDir ? '_' : row.size}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination rowsPerPageOptions={[10, 20, 50]} component="div" count={dataContent.length} rowsPerPage={rowsPerPage} page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Box>
  );
}
export default DataGrid;
