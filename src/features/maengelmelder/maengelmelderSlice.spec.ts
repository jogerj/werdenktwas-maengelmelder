import maengelmelderReducer, {
    MaengelmelderState,
    addBookmark,
    removeBookmark,
    // refreshAllAsync,
    // refreshSingleAsync,
} from './maengelmelderSlice';

describe('maengelmelder reducer', () => {
    const initialState: MaengelmelderState = {
        data: {},
        status: 'idle',
        bookmarks: [1, 2, 3],
    };
    it('should handle initial state', () => {
        expect(maengelmelderReducer(undefined, { type: 'unknown' })).toEqual({
            data: {},
            status: 'idle',
            bookmarks: [],
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
});
