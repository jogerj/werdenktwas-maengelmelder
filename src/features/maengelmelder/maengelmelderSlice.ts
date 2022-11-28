import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchReports, fetchReport, Data } from './maengelmelderAPI';


export interface MaengelmelderState {
  data: { [id: number]: Data };
  status: 'idle' | 'loading' | 'failed';
  bookmarks: number[];
}

const initialState: MaengelmelderState = {
  data: {},
  status: 'idle',
  bookmarks: [],
};

export const refreshAllAsync = createAsyncThunk(
  'maengelmelder/fetchReports',
  async (params:
    { sort: string, fields: string[], style: string } = {
      sort: '-created',
      fields: ['id', 'title', 'text', 'thumbnail_sq64', 'responsible', 'message_type'],
      style: 'default'
    }) => {
    const response = await fetchReports(params.sort, params.fields, params.style);
    return response.data;
  }
);

export const refreshSingleAsync = createAsyncThunk(
  'maengelmelder/fetchReport',
  async (params: { id: number, fields: string[], style: string }) => {
    const response = await fetchReport(params.id, params.fields, params.style);
    return response.data;
  }
);

export const maengelmelderSlice = createSlice({
  name: 'maengelmelder',
  initialState,
  reducers: {
    addBookmark: (state, action: PayloadAction<number>) => {
      console.log(`Add ID: ${action.payload} to bookmarks`)
      if (!state.bookmarks.includes(action.payload)) {
        state.bookmarks.push(action.payload);
      }
    },
    removeBookmark: (state, action: PayloadAction<number>) => {
      console.log(`Remove ID: ${action.payload} to bookmarks`)
      let index = state.bookmarks.indexOf(action.payload);
      if (index > -1) {
        state.bookmarks.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAllAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(refreshAllAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const freshReports: { [id: number]: Data } = {};
        if (action.payload.success) {
          action.payload.data.forEach((reportData: Data) => {
            const id: number = reportData.id;
            freshReports[id] = reportData;
          });

        }
        state.data = freshReports;

      })
      .addCase(refreshAllAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(refreshSingleAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(refreshSingleAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload.success) {
          state.data[action.payload.data.id] = action.payload.data;
        }
      })
      .addCase(refreshSingleAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addBookmark, removeBookmark } = maengelmelderSlice.actions;

export const selectMaengelmelder = (state: RootState) => state.maengelmelder;

export default maengelmelderSlice.reducer;