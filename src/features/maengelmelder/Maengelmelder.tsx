import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    refreshAllAsync,
    selectMaengelmelder
} from './maengelmelderSlice';
import ReportPageShort from './components/ReportPageShort';
import ReportPage from './components/ReportPage';

import styles from './Maengelmelder.module.css';

import Grid from '@mui/material/Grid'


export function Maengelmelder(): ReturnType<React.FC> {
    const store = useAppSelector(selectMaengelmelder);
    const dispatch = useAppDispatch();

    const [grid, setGrid] = useState<any[]>([]);

    useEffect(() => {
        // load data for first load;
        dispatch(refreshAllAsync());
    }, [dispatch])

    useEffect(() => {
        // generate grid when data changes
        const newGrid: any[] = [];
        for (const [index, value] of Object.entries(store.data)) {
            newGrid.push(
                <Grid item className={styles.gridItem} xs={6} md={3} key={index}>
                    <ReportPageShort data={value} />
                </Grid>
            )
        };
        setGrid(newGrid);
    }, [store.data])

    return (
        <div>
            <Grid container spacing={1}>
                {grid}
            </Grid>
        </div>
    )
}