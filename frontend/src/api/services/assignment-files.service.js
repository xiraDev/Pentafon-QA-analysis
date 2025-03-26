import axios from '../../utils/axios';

export const AssignmentFilesUrl = '/api/v1/assignment-files';

export const getAll = (url) => axios.get(url).then((res) => res.data);
