import CategoryIcon from '@mui/icons-material/Category';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import NumbersIcon from '@mui/icons-material/Numbers';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import Carousel from 'react-material-ui-carousel';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Attachment, Data, DEFAULT_FIELDS, DEFAULT_STYLE } from "../maengelmelderAPI";
import { refreshSingleAsync, selectMaengelmelder } from "../maengelmelderSlice";

interface ItemProps {
    item: {
        title: string,
        url?: string
    }
}

function Item(props: ItemProps) {
    const [hasImageLoaded, setHasImageLoaded] = useState<boolean>(false);

    return (
        <Paper sx={{ maxHeight: 'max-content' }}>
            {props.item.url
                ? <>
                    <img
                        src={props.item.url}
                        height={hasImageLoaded ? "100%" : "0"}
                        width={'100%'}
                        alt={props.item.title ?? 'Image'}
                        onLoad={() => setHasImageLoaded(true)}
                        style={{ display: 'flex', alignItems: 'center', objectFit: 'scale-down' }}
                    />
                    {!hasImageLoaded &&
                        <div style={{ height: '400px', display: 'flex', alignItems: 'center' }}>
                            <CircularProgress sx={{ margin: 'auto', height: '100%', fontSize: 40 }} />
                        </div>}
                </>
                : <Typography sx={{ display: 'flex', alignItems: 'center', minHeight: '400px' }}>
                    <NoPhotographyIcon sx={{ margin: 'auto', fontSize: 40, alignItems: 'center' }} />
                </Typography>
            }
        </Paper>
    )
}

export default function ReportPage() {

    const store = useAppSelector(selectMaengelmelder);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(refreshSingleAsync({ id: store.reportId, fields: DEFAULT_FIELDS, style: DEFAULT_STYLE }))
    }, [dispatch, store.reportId])

    const data: Data = store.data[store.reportId];
    const attachments: Attachment[] = data.attachments ?? [];
    const creationDate = data.created ? new Date(data.created) : undefined;
    const creationDateString: string = creationDate
        ? `${creationDate.toLocaleDateString()} ${creationDate.toLocaleTimeString()}`
        : "Datum und Uhrzeit nicht bekannt";

    return (
        <Box sx={{ margin: 4, display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column', width: '100%' }}>
            <Grid container>
                <Grid item xs={12} md={6} >
                    <Carousel
                        sx={{ margin: 2, minWidth: '90%', maxHeight: '100%' }}
                    >
                        {attachments.length
                            ? attachments.map((item, i) => <Item key={i} item={{
                                // maybe switch to thumbnail if takes too much time to load
                                // title: item.title, url: item.thumbnails.res800
                                title: item.title, url: item.url
                            }} />)
                            : <Item key={0} item={{ title: '' }} />
                        }
                    </Carousel>
                </Grid>
                <Grid item xs={12} md={6} sx={{ margin: 'auto', fontOpticalSizing: 'auto' }}>
                    <div style={{ height: 'max-content', display: 'flex' }}>
                        <Typography
                            variant="h4"
                            style={{ marginLeft: 4, textAlign: 'left' }}
                        >
                            <Avatar src={data.responsible?.avatar_uri} alt='Avatar' sx={{ bgcolor: 'grey' }} />
                            {data.responsible?.internal_name_long
                                ?? data.responsible?.internal_name
                                ?? data.responsible?.public_name
                                ?? "Unbekannt"}
                        </Typography>
                    </div>
                    <div style={{ height: 'max-content', display: 'flex' }}>
                        <Typography
                            variant="subtitle1"
                            style={{ marginLeft: 4, marginTop: 'auto', textAlign: 'left', fontWeight: 'bolder', color: '#192a2c' }}
                        >
                            <NumbersIcon htmlColor='#192a2c' style={{ marginTop: 'auto' }} />
                            {data.id}
                        </Typography>
                    </div>
                    <div style={{ height: 'max-content', display: 'flex' }}>
                        <Typography
                            variant="subtitle2"
                            style={{ marginLeft: 4, marginTop: 'auto', fontWeight: 'bold', textAlign: 'left' }}
                        >
                            <EventIcon htmlColor='crimson' style={{ marginTop: 0 }} />
                            {creationDateString}
                        </Typography>
                    </div>
                    <div style={{ height: 'max-content', display: 'flex' }}>
                        <Typography
                            variant="subtitle2"
                            style={{ marginLeft: 4, marginTop: 'auto', fontWeight: 'bold', textAlign: 'left' }}
                        >
                            <CategoryIcon htmlColor='darkblue' style={{ marginTop: 0 }} />
                            {/* TODO Link these category to pages where filtered by this category */}
                            {data.message_type?.name}
                        </Typography>
                    </div>
                    <div style={{ fontSize: 'medium', height: 'max-content', display: 'flex' }}>
                        <Link target={'_blank'} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address ?? '')}`}>
                            <Typography
                                variant="subtitle2"
                                style={{ marginLeft: 4, textAlign: 'left', fontWeight: 'bolder', color: '#192a2c' }}
                            >
                                <LocationOnIcon htmlColor='darkred' style={{}} />
                                {data.address}
                            </Typography>
                        </Link>
                    </div>
                    {data.responsible?.email
                        ? <div style={{ height: 'max-content', display: 'flex' }}>
                            <Link target={'_blank'} href={`mailto:${encodeURIComponent(data.responsible.email ?? '')}`}>
                                <Typography
                                    variant="subtitle2"
                                    style={{ marginLeft: 4, textAlign: 'left', fontWeight: 'bolder', color: '#192a2c' }}
                                >
                                    <EmailIcon htmlColor='darkcyan' style={{}} />
                                    {data.responsible.email}
                                </Typography>
                            </Link>
                        </div>
                        : <div />
                    }
                    <div style={{ height: 'max-content', display: 'flex' }}>
                        <Typography
                            variant="body1"
                            style={{ marginLeft: 4, textAlign: 'justify' }}
                        >
                            {data.text}
                        </Typography>
                    </div>

                </Grid>
            </Grid>
        </Box >
    )
}