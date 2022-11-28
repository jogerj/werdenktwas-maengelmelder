
import { API_URL } from "../../config";
import axios from 'axios';

export interface Data {
    id: number;
    thumbnail_sq64: string;
    message_type: {
        ordering: number;
        id: number;
        description: string;
        name: string;
    };
    responsible: {
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
    text: string;
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
 * Fetch all reports from the API. The API URL is defined by {@link API_URL}
 * 
 * @function
 * @name fetchReports
 * @kind variable
 * @param {string} sort
 * @param {string[]} fields
 * @param {string} style?
 * @returns {Promise<{ data: MultiReports; }>}
 * @exports
 */
export const fetchReports = (sort: string = '-created', fields: string[] = ['id', 'title', 'text', 'thumbnail_sq64', 'responsible', 'message_type'], style: string = 'default') => {
    return new Promise<{ data: MultiReports }>((resolve, reject) => {
        axios.get(`${API_URL}/message?sort=${sort}&fields=${fields.join(',')}&style=${style}`)
            .then((response) => {
                resolve(response);
            }).catch((err) => {
                reject(err);
            })
    });
}

/**
 * Fetch a single report with id from the API. The API URL is defined by {@link API_URL}
 * 
 * @function
 * @name fetchReport
 * @kind variable
 * @param {number} id
 * @param {string[]} fields
 * @param {string} style?
 * @returns {Promise<{ data: Report; }>}
 * @exports
 */
export const fetchReport = (id: number, fields: string[] = ['id', 'title', 'text', 'thumbnail_sq64', 'responsible', 'message_type'], style: string = 'default') => {
    return new Promise<{ data: Report }>((resolve, reject) => {
        axios.get(`${API_URL}/message/${id}?&fields=${fields.join(',')}&style=${style}`)
            .then((response) => {
                resolve(response);
            }).catch((err) => {
                reject(err);
            })
    });
}
