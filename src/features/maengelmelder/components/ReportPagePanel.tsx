import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import NumbersIcon from '@mui/icons-material/Numbers';
import Star from '@mui/icons-material/Star';
import StarOutline from '@mui/icons-material/StarOutline';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Data } from "../maengelmelderAPI";
import { addBookmark, removeBookmark, selectMaengelmelder, setReportId, setReportPageOpen } from '../maengelmelderSlice';



interface ReportPagePanelProps {
    data: Data
}

export default function ReportPagePanel(props: ReportPagePanelProps): ReturnType<React.FC> {

    const store = useAppSelector(selectMaengelmelder);
    const dispatch = useAppDispatch();

    const [bookmark, setBookmark] = useState<boolean>(false);
    const [hasImageLoaded, setHasImageLoaded] = useState(false);

    useEffect(() => {
        // on first render check bookmark status
        setBookmark(store.bookmarks.includes(props.data.id));
    }, [props.data.id, store.bookmarks])


    /**
     * A function that is called when the user clicks on the bookmark icon. Toggles bookmark status.
     * 
     * @function
     * @name handleBookmark
     * @kind variable
     * @memberof ReportPageShort
     * @returns {void}
     */
    const handleBookmark = () => {
        console.log(store.bookmarks)
        if (bookmark) {
            dispatch(removeBookmark(props.data.id));
        } else {
            dispatch(addBookmark(props.data.id));
        }
    }

    const handleCardClick = () => {
        dispatch(setReportId(props.data.id));
        dispatch(setReportPageOpen(true));
    }

    const creationDate = props.data.created ? new Date(props.data.created) : undefined;
    const creationDateString: string = creationDate
        ? `${creationDate.toLocaleDateString()} ${creationDate.toLocaleTimeString()}`
        : "Datum und Uhrzeit nicht bekannt";

    return (
        <>
            <Card sx={{ height: '600px', width: '400px', minWidth:'400px', display: 'flex', justifyContent: 'start', flexDirection: 'column' }}>
                <CardHeader
                    sx={{ height: '15%' }}
                    avatar={
                        <Avatar src={props.data.responsible?.avatar_uri} alt='Avatar' sx={{ bgcolor: 'grey' }} />
                    }
                    action={
                        <Tooltip title={bookmark ? 'Meldung nicht mehr merken' : 'Meldung merken'}>
                        <IconButton onClick={handleBookmark}>
                            {bookmark
                                ? <Star sx={{ color: 'orange' }} />
                                : <StarOutline/>
                            }
                        </IconButton>
                        </Tooltip>
                    }
                    title={
                        <Typography variant='h5' style={{ color: '#192a2c', fontWeight: 'bold' }}>
                            {`${props.data.responsible?.internal_name_long
                                ?? props.data.responsible?.internal_name
                                ?? props.data.responsible?.public_name
                                ?? "Unbekannt"
                                }`}
                        </Typography>
                    }
                    subheader={creationDateString}
                />
                <CardActionArea
                    onClick={handleCardClick}
                    sx={{ height: '85%', display: 'flex', justifyContent: 'start', flexDirection: 'column' }}>
                    {/* Everything in this element is one big clickable area */}
                    {props.data?.attachments?.length
                        ? <>
                            <CardMedia
                                component="img"
                                height={hasImageLoaded ? "250" : "0"}
                                image={(props.data.attachments[0] ?? undefined).thumbnails.w256}
                                onLoad={() => setHasImageLoaded(true)}

                                sx={{ display: 'flex', alignItems: 'center', minHeight: `${hasImageLoaded ? '250px' : '0'}` }}
                            />
                            {!hasImageLoaded &&
                                <div style={{ minHeight: '250px', display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress sx={{ margin: 'auto', height: '100%', fontSize: 40 }} />
                                </div>}
                        </>
                        : <CardMedia sx={{ display: 'flex', alignItems: 'center', minHeight: '250px' }}>
                            <NoPhotographyIcon sx={{ margin: 'auto', fontSize: 40, alignItems: 'center' }} />
                        </CardMedia>
                    }
                    <CardContent sx={{ width: '100%', height: '100%' }}>
                        <Grid container spacing={1} padding={3} sx={{ display: 'contents' }}>
                            <Grid item xs={12} style={{ padding: 2 }}>
                                <div style={{ height: '25%', display: 'flex' }}>
                                    <NumbersIcon htmlColor='#192a2c' style={{ marginTop: 'auto' }} />
                                    <Typography
                                        variant="subtitle1"
                                        style={{ marginLeft: 4, marginTop: 'auto', textAlign: 'left', fontWeight: 'bolder', color: '#192a2c' }}
                                    >{props.data.id}</Typography>
                                </div>
                                <div style={{ height: '25%', display: 'flex' }}>
                                    <CategoryIcon htmlColor='darkblue' style={{ marginTop: 0 }} />
                                    <Typography
                                        variant="subtitle2"
                                        style={{ marginLeft: 4, marginTop: 'auto', fontWeight: 'bolder', textAlign: 'left', textDecorationLine: 'underline' }}
                                    >
                                        {props.data.message_type?.name}
                                    </Typography>
                                </div>
                                <div style={{ height: '50%', display: 'flex' }}>
                                    {/* <Link target={'_blank'} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.data.address ?? '')}`}> */}
                                    <LocationOnIcon htmlColor='darkred' style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                                    <Typography
                                        variant="subtitle2"
                                        style={{ marginLeft: 4, textAlign: 'left', fontWeight: 'bolder', color: '#192a2c' }}
                                    >
                                        {props.data.address}
                                    </Typography>
                                    {/* </Link> */}
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" style={{
                                    textAlign: 'left',
                                }}>
                                    {/* In case text is empty */}
                                    {(props.data.text ?? '').length < 150
                                        ? props.data.text
                                        // cut off lengthy text at "space" char
                                        : `${props.data.text?.substring(0, props.data.text?.lastIndexOf(' ', 150))}...`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )
}