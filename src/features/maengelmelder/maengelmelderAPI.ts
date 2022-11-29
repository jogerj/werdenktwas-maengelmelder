
import { API_URL } from "../../config";
import axios from 'axios';


export const DEFAULT_FIELDS: Set<string> = new Set(['id', 'title', 'text', 'created', 'address', 'thumbnail_sq64', 'attachments', 'responsible', 'message_type'])
export const DEFAULT_STYLE: string = 'default';
export const DEFAULT_SORT: string = '-created';

export interface Attachment {
    thumbnails: {
        sq128: string;
        res400: string;
        sq256: string;
        w256: string;
        w800: string;
        res800: string;
    };
    content_type: string;
    title?: any;
    type: string;
    public: number;
    url: string;
    id: number;
}

export interface Data {
    id: number;
    thumbnail_sq64?: string;
    attachments?: Attachment[];
    message_type?: {
        ordering: number;
        id: number;
        description: string;
        name: string;
    };
    created?: string;
    address?: string;
    responsible?: {
        links: {
            self: {
                href: string;
            }
        };
        virtual: number;
        public_name: string;
        id: number;
        avatar_uri: string;
        internal_name_long?: string;
        email?: string;
        internal_name?: string;
    };
    text?: string;
    title?: any;
};

export interface Pager {
    entries_per_page: number;
    total_entries: number;
    current_page: number;
}

export interface MultiReports {
    data: Data[];
    success: boolean;
    pager: Pager;
}

export interface Report {
    success: boolean;
    data: Data;
}


/**
 * Fetch all reports from the API. The API URL is defined by {@link API_URL}. 
 * 
 * @function
 * @name fetchReports
 * @kind variable
 * @param {string} sort
 * @param {Set<string>} fields The field 'id' will always be included.
 * @param {string} style?
 * @returns {Promise<{ data: MultiReports; }>}
 * @exports
 */
export const fetchReports = (sort: string = DEFAULT_SORT, fields: Set<string> = DEFAULT_FIELDS, style: string = DEFAULT_STYLE) => {
    return new Promise<{ data: MultiReports }>((resolve, reject) => {
        // add 'id' in case not included already
        fields.add('id');
        axios.get(`${API_URL}/message?sort=${sort}&fields=${Array.from(fields).join(',')}&style=${style}`)
            .then((response) => {
                resolve(response);
            }).catch((err) => {
                reject(err);
            })
    });
}

/**
 * Fetch a single report with id from the API. The API URL is defined by {@link API_URL}.
 * 
 * @function
 * @name fetchReport
 * @kind variable
 * @param {number} id
 * @param {Set<string>} fields The field 'id' will always be included.
 * @param {string} style?
 * @returns {Promise<{ data: Report; }>}
 * @exports
 */
export const fetchReport = (id: number, fields: Set<string> = DEFAULT_FIELDS, style: string = DEFAULT_STYLE) => {
    return new Promise<{ data: Report }>((resolve, reject) => {
        // 'id' must always be present
        fields.add('id');
        axios.get(`${API_URL}/message/${id}?&fields=${Array.from(fields).join(',')}&style=${style}`)
            .then((response) => {
                resolve(response);
            }).catch((err) => {
                reject(err);
            })
    });
}
