export const ROUTES = {
    HOME: '#home',
    ARTICLE: '#article',
    CATEGORY: '#category',
    SEARCH: '#search',
    LOGIN: '#login',
    REGISTER: '#register',
    LOGOUT: '#logout',
    NEWSTORY: '#newstory'
};

const API_BASE = '/api/dailybugle';

export const API_ROUTES = {
    ARTICLE: API_BASE + '/articles/',
    AUTH: API_BASE + '/auth/',
    AD: API_BASE + '/ads/',
    COMMENT: API_BASE + '/comments/'
}