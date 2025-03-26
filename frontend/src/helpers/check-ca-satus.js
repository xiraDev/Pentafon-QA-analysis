export const checkCAStatus = (cAStatus) => {
  let icon = '';
  let color = 'default';
  let label = '';
  switch (cAStatus) {
    case 0:
      icon = 'eva:clock-outline';
      color = 'warning.main';
      label = 'ca_pending';
      break;
    case 1:
      icon = 'eva:checkmark-circle-fill';
      color = 'success.main';
      label = 'ca_finished';
      break;
    case 2:
      icon = 'icon-park-outline:turn-on';
      color = 'info.main';
      label = 'ca_in_progress';
      break;
    case 3:
      icon = 'bx:error';
      color = 'error.main';
      label = 'ca_failed';
      break;
    case 4:
      icon = 'mdi:motion-pause-outline';
      color = 'warning.main';
      label = 'ca_paused';
      break;
    case 5:
      icon = 'ix:cancelled';
      color = 'error.main';
      label = 'ca_cancelled';
      break;
    default:
      icon = 'arcticons:defaultdarktheme';
      color = 'default.main';
      label = 'ca_unknown';
      break;
  }

  return { icon, color, label };
};
