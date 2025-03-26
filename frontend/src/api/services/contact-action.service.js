import axios from '../../utils/axios';

export const contactActionUrl = '/api/v1/contact-actions';

export const extendedContactActionUrl = '/api/v1/contact-actions/successful-attempts';

export const getAll = (url) => axios.get(url).then((res) => res.data);
