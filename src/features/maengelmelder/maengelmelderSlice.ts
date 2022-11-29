import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchReports, fetchReport, Data, DEFAULT_SORT, DEFAULT_FIELDS, DEFAULT_STYLE } from './maengelmelderAPI';




export interface MaengelmelderState {
  data: { [id: number]: Data };
  status: 'idle' | 'loading' | 'failed';
  bookmarks: number[];
  reportId: number;
  reportPageOpen: boolean;
}

const initialState: MaengelmelderState = {
  data: {},
  status: 'idle',
  bookmarks: [],
  reportId: -1,
  reportPageOpen: false,
};


/**
 * Creates a thunk for fetching multiple data entries.
 * 
 * @constant
 * @name refreshAllAsync
 * @kind variable
 * @type {AsyncThunk<MultiReports, { sort: string; fields: Set<string>; style: string; } | undefined, AsyncThunkConfig>}
 * @exports
 */
export const refreshAllAsync = createAsyncThunk(
  'maengelmelder/fetchReports',
  async (params:
    { sort: string, fields: Set<string>, style: string } = {
      sort: DEFAULT_SORT,
      fields: DEFAULT_FIELDS,
      style: DEFAULT_STYLE
    }) => {
    const response = await fetchReports(params.sort, params.fields, params.style);
    return response.data;
  }
);


/**
 * Creates a thunk for fetching single data entries.
 * 
 * @constant
 * @name refreshSingleAsync
 * @kind variable
 * @type {AsyncThunk<Report, { id: number; fields: Set<string>; style: string; }, AsyncThunkConfig>}
 * @exports
 */
export const refreshSingleAsync = createAsyncThunk(
  'maengelmelder/fetchReport',
  async (params: { id: number, fields: Set<string>, style: string }) => {
    if (params.fields.size === 0) {
      // set defaults
      params.fields = DEFAULT_FIELDS;
    }
    const response = await fetchReport(params.id, params.fields, params.style);
    return response.data;
  }
);

export const maengelmelderSlice = createSlice({
  name: 'maengelmelder',
  initialState,
  reducers: {
    /**
     * Add am item to bookmark if it does not already exist in the store array.
     * 
     * @property
     * @name addBookmark
     * @kind method
     * @memberof maengelmelderSlice.reducers
     * @type {function}
     * @param {WritableDraft<MaengelmelderState>} state
     * @param {PayloadAction<number>} action
     * @returns {void}
     */
    addBookmark: (state, action: PayloadAction<number>) => {
      console.log(`Add ID: ${action.payload} to bookmarks`)
      if (!state.bookmarks.includes(action.payload)) {
        state.bookmarks.push(action.payload);
      }
    },
    /**
     * Remove item from bookmarks in store array if it exists.
     * 
     * @property
     * @name removeBookmark
     * @kind method
     * @memberof maengelmelderSlice.reducers
     * @type {function}
     * @param {WritableDraft<MaengelmelderState>} state
     * @param {PayloadAction<number>} action
     * @returns {void}
     */
    removeBookmark: (state, action: PayloadAction<number>) => {
      console.log(`Remove ID: ${action.payload} to bookmarks`)
      let index = state.bookmarks.indexOf(action.payload);
      if (index > -1) {
        state.bookmarks.splice(index, 1);
      }
    },
    /**
     * Set the open report id used in [ReportPage](./components/ReportPage.tsx).
     * 
     * @property
     * @name setReportId
     * @kind method
     * @memberof maengelmelderSlice.reducers
     * @type {function}
     * @param {WritableDraft<MaengelmelderState>} state
     * @param {PayloadAction<number>} action
     * @returns {void}
     */
    setReportId: (state, action: PayloadAction<number>) => {
      console.log(`Set report page number ${action.payload}`);
      state.reportId = action.payload;
    },
    /**
     * Set the visibility of [ReportPage](./components/ReportPage.tsx). Should be visible if set to true.
     * 
     * @property
     * @name setReportPageOpen
     * @kind method
     * @memberof maengelmelderSlice.reducers
     * @type {function}
     * @param {WritableDraft<MaengelmelderState>} state
     * @param {PayloadAction<boolean>} action
     * @returns {void}
     */
    setReportPageOpen: (state, action: PayloadAction<boolean>) => {
      console.log(`${action.payload ? "Open" : "Close"} report page ${state.reportId}`);
      state.reportPageOpen = action.payload;
    }
  },
  // add the thunks in
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

export const { addBookmark, removeBookmark, setReportId, setReportPageOpen } = maengelmelderSlice.actions;

export const selectMaengelmelder = (state: RootState) => state.maengelmelder;

export default maengelmelderSlice.reducer;