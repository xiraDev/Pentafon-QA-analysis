import { isEmpty } from 'lodash';

// utilities
import { fDateTime } from '../utils/format-time-xira';

// ----------------------------------------------------------------------

export const assignmentFilesAdapter = (aFiles) => {
  const renderAssignmentFiles = [];
  if (isEmpty(aFiles)) return renderAssignmentFiles;
  aFiles.forEach((assign) => {
    renderAssignmentFiles.push(assignAdapter(assign));
  });

  return renderAssignmentFiles;
};

export const assignAdapter = (assign) => ({
  id: assign.id,
  name: assign.name,
  size: assign.size,
  mimetype: assign.mimetype,
  fileStatus: assign.fileStatus.status,
  createdAt: fDateTime(assign.createdAt),
  updatedAt: fDateTime(assign.updatedAt),
});

export const shortingAdapter = (shorting = []) => {
  if (isEmpty(shorting)) return [];

  const order = shorting[0].desc ? 'DESC' : 'ASC';
  return [[shorting[0].id, order]];
};
