import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import ReportPagePanel from './components/ReportPagePanel';
import styles from './Maengelmelder.module.css';
import {
    refreshAllAsync,
    selectMaengelmelder,
    setReportPageOpen
} from './maengelmelderSlice';
import ReportPage from './components/ReportPage';
import { Typography } from '@mui/material';

export function Maengelmelder(): ReturnType<React.FC> {
    const store = useAppSelector(selectMaengelmelder);
    const dispatch = useAppDispatch();

    const [grid, setGrid] = useState<any[]>([]);
    const [bookmarkPanels, setBookmarkPanels] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);


    useEffect(() => {
        // load data for first load;
        dispatch(refreshAllAsync());
    }, [dispatch])


    useEffect(() => {
        setRefreshing(false);
    }, [store.data])


    useEffect(() => {
        // generate grid when data changes
        const newGrid: any[] = [];
        for (const [index, value] of Object.entries(store.data)) {
            newGrid.push(
                <Grid item xs={12} sm={6} md={4} lg={3} xl={'auto'} key={index} sx={{
                    padding: '5px',
                    display: 'flex'
                }}>
                    <ReportPagePanel data={value} />
                </Grid>
            )
        };
        setGrid(newGrid);
    }, [store.data])

    useEffect(() => {
        // generate bookmark grid when bookmark changes
        const newBookmarkPanels: any[] = [];
        for (const [index, id] of Object.entries(store.bookmarks)) {
            newBookmarkPanels.push(
                <ReportPagePanel data={store.data[id]} key={index} />
            )
        };
        setBookmarkPanels(newBookmarkPanels);
    }, [store.bookmarks, store.data])

    return (
        <>
            <Modal
                open={store.reportPageOpen}
                onClose={() => dispatch(setReportPageOpen(false))}
            >
                <Slide timeout={400} direction="up" in={store.reportPageOpen} mountOnEnter unmountOnExit>
                    <Paper
                        elevation={20}
                        style={{
                            position: "fixed",
                            height: "90%",
                            width: "80%",
                            maxWidth: "80vw",
                            bottom: "5%",
                            top: "5%",
                            left: "5%",
                            right: "5%",
                            margin: 'auto',
                            display: "flex",
                            overflow: "auto"
                        }}
                    >
                        <ReportPage />
                    </Paper>
                </Slide>
            </Modal>
            {store.bookmarks.length
                ? <Paper sx={{
                    margin: 6,
                    padding: 3,
                    width: '90%',
                    display: 'flex',
                    backgroundColor: '#375a60'
                }}> <Grid container>
                        <Grid item xs={12}>
                            <Typography variant='h3' color={'whitesmoke'}>
                                Gemerkte Meldungen
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <div style={{ width: "100%", overflow: "auto", display: "flex" }}>
                                {bookmarkPanels.map((panel, index) =>
                                    <div style={{ margin: 12, width: 'max-content' }} key={index}>
                                        {panel}
                                    </div>
                                )}
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
                : <div />
            }
            <Paper sx={{
                margin: 6,
                padding: 3,
                minHeight: '80vh',
                width: '90%',
                height: '90%',
                display: 'flex',
                backgroundColor: '#375a60'
            }}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant='h3' color={'whitesmoke'}>
                            Alle Meldungen
                            <Tooltip title="Refresh all data">
                                <IconButton
                                    onClick={() => {
                                        dispatch(refreshAllAsync())
                                        setRefreshing(true);
                                    }}
                                    sx={{ margin: 1, padding: 1 }}
                                >
                                    <RefreshIcon fontSize='large' sx={{
                                        color: 'white',
                                        animation: `${refreshing ? 'spin 1s linear infinite' : 'none'}`,
                                        "@keyframes spin": {
                                            "0%": {
                                                transform: "rotate(0deg)",
                                            },
                                            "100%": {
                                                transform: "rotate(360deg)",
                                            }
                                        },
                                    }} />
                                </IconButton>
                            </Tooltip>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {grid.length
                            ? <Grid container className={styles.grid} spacing={'auto'} rowSpacing={3} sx={{ margin: 'auto' }}
                                direction="row"
                                justifyContent="space-around"
                                alignItems="center">
                                {grid}
                            </Grid>
                            : <CircularProgress style={{ color: 'ghostwhite', margin: 'auto' }} />
                        }</Grid>
                </Grid>
            </Paper >
        </>
    )
}