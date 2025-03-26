// @mui
import { Grid, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonGeneralAnalytics() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6} lg={8}>
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2, marginBottom: 2 }} />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
      </Grid>
    </Grid>
  );
}
