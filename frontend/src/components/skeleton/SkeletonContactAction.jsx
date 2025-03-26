// @mui
import { Grid, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonContactAction() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, marginBottom: 2 }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" width="100%" height={240} sx={{ borderRadius: 2 }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" width="100%" height={240} sx={{ borderRadius: 2 }} />
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={2}>
          <Skeleton variant="text" height={50} />
        </Grid>
        <Grid item xs={2} sx={{ ml: 2 }}>
          <Skeleton variant="text" height={50} />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2, marginBottom: 2 }} />
      </Grid>
    </Grid>
  );
}
