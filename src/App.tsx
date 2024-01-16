import {useEffect, useState} from 'react'
import './App.css'
import {Blog} from "./types.ts";
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  Button
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import BlogDialog from "./components/blog.tsx";
import {Api} from "./api.ts";

function App() {
  const [blog, setBlogs] = useState<Blog[]>([]);
  const [id, setId] = useState<number>(0);
  const [open, setOpen] = useState(false);

  let load = () => {
    let api = new Api<Blog>();
    api.list()
        .then(rs => setBlogs(rs))
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <Button onClick={() => {
        setId(0);
        setOpen(true);
      }}>
        Create new
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>#</TableCell>
              {/*<TableCell>Title</TableCell>*/}
              <TableCell>Body</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {blog.map(b => {
              return (
                  <TableRow key={b.id}>
                    <TableCell>{b.userId}</TableCell>
                    <TableCell>{b.id}</TableCell>
                    {/*<TableCell>{b.title}</TableCell>*/}
                    <TableCell>{b.body}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => {
                        setId(b.id);
                        setOpen(true)
                      }}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <BlogDialog id={id} open={open} onClose={(e) => {
        if (e) {
          load();
        }
        setOpen(false)
      }} />
    </div>
  )
}

export default App
