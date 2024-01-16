import {Dialog, DialogTitle, DialogContent, Button, TextField, DialogActions, Snackbar, Alert} from "@mui/material";
import {Api} from "../api.ts";
import {useEffect, useState} from "react";
import {Blog} from "../types.ts";

export default function BlogDialog({ id, open, onClose } : { id: number, open: boolean, onClose?: (b?: boolean) => void }) {
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(false);
    const [noti, setNoti] = useState('');

    useEffect(() => {
        if (!id) {
            setBlog({ id: 0, userId: 0, body: '', title: 'Post title' })
            return;
        }
        const api = new Api<Blog>();
        api.get(id).then(rs => setBlog(rs));
    }, [id, open])

    return (
        <>
            <Snackbar open={!!noti} message={noti} autoHideDuration={5000}
                      onClose={() => setNoti('')}>
                <Alert onClose={() => setNoti('')} severity="success" sx={{ width: '100%' }}>
                    {noti}
                </Alert>
            </Snackbar>
            <Dialog open={open} onClose={() => onClose?.()}>
                <DialogTitle>
                    {blog?.title}
                </DialogTitle>
                <DialogContent>
                    <div style={{ paddingTop: '2rem' }}>
                        <TextField
                            fullWidth
                            label="Body"
                            multiline
                            value={blog?.body || ''}
                            onChange={v => blog ? setBlog({ ...blog, body: v.target.value }) : void 0}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={() => onClose?.()} disabled={loading}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={() => {
                        setLoading(true);
                        const api = new Api<Blog>();
                        const p = id ? api.put(blog!.id,blog) : api.post(blog);
                        p
                            .then(() => {
                                onClose?.();
                            })
                            .catch(console.log)
                            .finally(() => {
                                setLoading(false);
                                onClose?.(true);
                                setNoti('Updated!')
                            })
                    }} disabled={loading}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
