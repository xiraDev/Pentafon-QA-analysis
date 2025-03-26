// @mui
import { Box, Stack, Paper, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonWBuilderColumn() {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: 'repeat(4, 1fr)',
      }}
    >
      {[...Array(2)].map((_, index) => (
        <Paper variant="outlined" key={index} sx={{ p: 2.5, width: 310 }}>
          <Stack spacing={2}>
            <Skeleton variant="rectangular" sx={{ paddingTop: '25%', borderRadius: 1.5 }} />
            {index === 0 && <Skeleton variant="rectangular" sx={{ paddingTop: '25%', borderRadius: 1.5 }} />}
            {index !== 2 && <Skeleton variant="rectangular" sx={{ paddingTop: '25%', borderRadius: 1.5 }} />}
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}
