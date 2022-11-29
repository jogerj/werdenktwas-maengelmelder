import maengelmelderReducer, {
    MaengelmelderState,
    addBookmark,
    removeBookmark,
    setReportPageOpen,
    setReportId,
    // refreshAllAsync,
    // refreshSingleAsync,
} from './maengelmelderSlice';

describe('maengelmelder reducer', () => {
    const initialState: MaengelmelderState = {
        data: {},
        status: 'idle',
        bookmarks: [1, 2, 3],
        reportId: -1,
        reportPageOpen: false,
    };
    it('should handle initial state', () => {
        expect(maengelmelderReducer(undefined, { type: 'unknown' })).toEqual({
            data: {},
            status: 'idle',
            bookmarks: [],
            reportId: -1,
            reportPageOpen: false,
        });
    });

    it('should handle addBookmark', () => {
        const actual = maengelmelderReducer(initialState, addBookmark(4));
        expect(actual.bookmarks).toEqual([1, 2, 3, 4]);
    });

    it('should handle removeBookmark', () => {
        const actual = maengelmelderReducer(initialState, removeBookmark(2));
        expect(actual.bookmarks).toEqual([1, 3]);
    });

    it('should open/close report page', () => {
        const actual = maengelmelderReducer(initialState, setReportPageOpen(true));
        expect(actual.reportPageOpen).toEqual(true);
    })

    it('should update report page id', () => {
        const actual = maengelmelderReducer(initialState, setReportId(123));
        expect(actual.reportId).toEqual(123);
    })
});
