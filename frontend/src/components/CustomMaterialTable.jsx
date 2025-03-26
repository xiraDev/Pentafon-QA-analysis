import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// components
import MaterialTable, { MTableToolbar } from '@material-table/core';

// @mui
import { useTheme } from '@mui/material/styles';
import { Chip, Alert, Container, LinearProgress } from '@mui/material';

// hooks
import { useTranslate } from 'src/locales';

// helpers
import { isEmpty } from '../helpers';
// localization
import MTC_LOCALE from '../locales/material-table-core.json';

// ----------------------------------------------------------------------

const CustomMaterialTable = ({
  loading,
  title = '',
  columns,
  data,
  actions = [],
  paging = false,
  errorMessage = '',
  grouping = false,
  filtering = false,
  filterColumns = false,
  search = false,
  sorting = false,
  draggable = false,
  actionsColumnIndex = -1,
  editable = {},
}) => {
  const { t, currentLang } = useTranslate('common');

  const theme = useTheme();

  const [filterAvailable, setFilterAvailable] = useState(false);
  const [showAddRemoCols, setShowAddRemoCols] = useState(false);

  // Localization state
  const [localization, setLocalization] = useState(MTC_LOCALE);

  useEffect(() => {
    const currentLanguage = currentLang.value;

    if (currentLanguage === 'en') {
      setLocalization(() => ({}));
    } else if (currentLanguage === 'es') {
      setLocalization(MTC_LOCALE);
    }
    // Agrega más condiciones para otros idiomas
  }, [currentLang]);

  const handleClickFilter = () => {
    setFilterAvailable(!filterAvailable);
  };

  const handleCLickShowAddRemoCols = () => {
    setShowAddRemoCols(!showAddRemoCols);
  };

  return (
    <div>
      <Container maxWidth={false} sx={{ mb: 3, p: '0 !important' }}>
        {loading ? (
          <LinearProgress />
        ) : !isEmpty(data) ? (
          <div>
            <div style={{ height: 'auto', width: '100%' }}>
              <MaterialTable
                title={title}
                columns={columns}
                data={data}
                editable={editable}
                localization={localization}
                actions={actions}
                options={{
                  actionsColumnIndex,
                  grouping,
                  showGroupingCount: true,
                  filtering: filterAvailable,
                  paging,
                  search,
                  sorting,
                  draggable,
                  headerStyle: {
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: theme.palette.background.neutral,
                    color: theme.palette.text.secondary,
                  },
                  pageSizeOptions: [5, 10, 20, 30, 100],
                  exportAllData: true,
                }}
                components={{
                  Toolbar: (props) => (
                    <div>
                      <MTableToolbar {...props} columnsButton={showAddRemoCols} />
                      <div style={{ padding: '0px 10px' }}>
                        {filtering && (
                          <Chip
                            color="secondary"
                            style={{ marginLeft: 5, marginBottom: 5 }}
                            //   icon={<FilterListIcon />}
                            label="Filtrar"
                            onClick={handleClickFilter}
                            variant={filterAvailable === true ? 'default' : 'outlined'}
                          />
                        )}
                        {filterColumns && (
                          <Chip
                            color="secondary"
                            style={{ marginLeft: 5, marginBottom: 5 }}
                            //   icon={<ViewColumnIcon />}
                            label="Columnas"
                            onClick={handleCLickShowAddRemoCols}
                            variant={showAddRemoCols === true ? 'default' : 'outlined'}
                          />
                        )}
                      </div>
                    </div>
                  ),
                }}
              />
            </div>
          </div>
        ) : (
          <Alert severity="warning">{isEmpty(errorMessage) ? t('no_info_to_display') : errorMessage}</Alert>
        )}
      </Container>
    </div>
  );
};

CustomMaterialTable.propTypes = {
  loading: PropTypes.bool,
  title: PropTypes.string,
  // columns: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      field: PropTypes.string,
      type: PropTypes.string,
      editable: PropTypes.string,
    })
  ),
  // data: PropTypes.array,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  // actions: PropTypes.array,
  actions: PropTypes.oneOfType([PropTypes.array]),
  paging: PropTypes.bool,
  errorMessage: PropTypes.string,
  grouping: PropTypes.bool,
  filtering: PropTypes.bool,
  filterColumns: PropTypes.bool,
  search: PropTypes.bool,
  sorting: PropTypes.bool,
  draggable: PropTypes.bool,
  actionsColumnIndex: PropTypes.number,
  editable: PropTypes.oneOfType([PropTypes.object]),
};

export default CustomMaterialTable;
