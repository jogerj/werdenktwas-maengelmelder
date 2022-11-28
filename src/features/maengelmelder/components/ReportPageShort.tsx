import { Data } from "../maengelmelderAPI";
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { addBookmark, removeBookmark, selectMaengelmelder } from '../maengelmelderSlice';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { useEffect, useState } from "react";
import { Button } from "@mui/material";


interface ReportPageShortProps {
    data: Data
}

export default function ReportPageShort(props: ReportPageShortProps): ReturnType<React.FC> {

    const store = useAppSelector(selectMaengelmelder);
    const dispatch = useAppDispatch();

    const [bookmark, setBookmark] = useState<boolean>(false);
    
    useEffect(() => {
        // on first render check bookmark status
        setBookmark(store.bookmarks.includes(props.data.id));
    }, [props.data.id, store.bookmarks])

    const handleBookmark = () => {
        console.log(store.bookmarks)
        if (bookmark) {
            dispatch(removeBookmark(props.data.id));
        } else {
            dispatch(addBookmark(props.data.id));
        }
    }

    return (
        <>
            <Card style={{ height: '320px' }}>
                <Grid container spacing={1} padding={2}>
                    <Grid item xs={4}>
                        {props.data.thumbnail_sq64 ?
                            <img src={props.data.thumbnail_sq64} alt='thumbnail' />
                            :
                            <NoPhotographyIcon style={{ alignItems: 'center' }} />
                        }
                    </Grid>
                    <Grid item xs={8}>
                        <div style={{ height: '25%' }}>
                            <Typography
                                variant="subtitle1"
                                style={{ textAlign: 'left' }}

                            >{`#${props.data.id}`}</Typography>
                        </div>
                        <div style={{ height: '25%' }}>
                            <Typography
                                variant="subtitle2"
                                style={{ textAlign: 'left' }}

                            >
                                {`${props.data.message_type.name}`}
                            </Typography>
                        </div>
                        <div style={{ height: '50%' }}>
                            <Typography
                                variant="subtitle2"
                                style={{ textAlign: 'left', fontWeight: 'bold' }}
                            >
                                {`${props.data.responsible.public_name}`}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" style={{
                            textAlign: 'left',
                        }}>
                            {props.data.text.length < 100
                                ? props.data.text
                                // cut off lengthy text at "space" char
                                : `${props.data.text.substring(0, props.data.text.lastIndexOf(' ', 100))}...`}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained"
                        color={ bookmark ? "error" : "success"}
                        onClick={handleBookmark}
                        >
                            <Typography variant='button' fontSize={'smaller'}>
                                {bookmark ? "Remove Bookmark" : "Add Bookmark"}
                            </Typography>
                        </Button>
                    </Grid>

                </Grid>
            </Card>
        </>
    )
}