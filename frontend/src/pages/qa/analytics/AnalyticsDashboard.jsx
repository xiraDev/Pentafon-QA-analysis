// hooks
import { isEmpty } from 'lodash';
import { useState, useEffect } from 'react';

// @mui
import { Grid, Container, Typography } from '@mui/material';

// helpers
import axios from 'src/utils/axios';

// components
import Page from '../basic_components/Page';
//
import AHTCalculator from './components/AHTCalculator';
import AnalysisGrades from './components/AnalysisGrades';
import TopAgentsTable from './components/TopAgentsTable';
// import useSettings from '../../hooks/useSettings';
import { useTranslate as useLocales } from '../../../locales/use-locales';
import SkeletonGeneralAnalytics from '../basic_components/SkeletonAnalytics';

// ----------------------------------------------------------------------

export default function GeneralAnalytics() {
  const { t: translate } = useLocales();

  // const { themeStretch } = useSettings();
  const themeStretch = false;

  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get('/api/v1/conversations/grades_analytics?from=2024-12-01%2000:00:00');
        const response = await axios.get('/api/v1/conversations/analysis_analytics');
        if (response.data.status === 'error') throw new Error(response.data.message);
        setData(response.data.meta);
      } catch (err) {
        setError('Error loading data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setData]);

  return (
    <Page title="General: Analytics">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {translate('analytics_heading')}
        </Typography>

        {((isEmpty(data) && !error) || isLoading) && <SkeletonGeneralAnalytics />}

        {!isEmpty(data) && !isLoading && (
          <Grid container spacing={3}> {/* Se agrega spacing al contenedor principal */}
            <Grid item xs={12} md={12} lg={12}> {/* AHTCalculator */}
              <AHTCalculator conversations={data} />
            </Grid>
          
            <Grid item xs={12} md={12} lg={12}> {/* AnalysisGrades */}
              <AnalysisGrades conversations={data} />
            </Grid>
          
            <Grid item xs={12} md={12} lg={12}> {/* TopAgentsTable */}
              <TopAgentsTable conversations={data} />
            </Grid>
          </Grid>
        
        )}

        {isEmpty(data) && !isLoading && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <AnalysisGrades conversations={[]} />
            </Grid>
          </Grid>
        )}
      </Container>
    </Page>
  );
}
