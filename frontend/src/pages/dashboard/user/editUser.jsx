import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Box, Card, Chip, Grid, Button, Avatar, Container, Typography, CardContent, CircularProgress } from '@mui/material';

import axios from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

const UserCampaignForm = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/v1/users/${id}`);
        setUserData(response.data.meta);
        // Preseleccionar las campañas del usuario
        setSelectedCampaigns(response.data.meta.campaigns || []);
      } catch (err) {
        console.error('Error fetching user data', err);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('/api/v1/campaigns');
        setCampaigns(response.data.meta);
      } catch (err) {
        console.error('Error fetching campaigns', err);
      } finally {
        setLoadingCampaigns(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleCampaignChange = (campaignId) => {
    setSelectedCampaigns((prevSelected) => {
      if (prevSelected.includes(campaignId)) {
        return prevSelected.filter((ci) => ci !== campaignId);
      }
      return [...prevSelected, campaignId];
    });
  };

  const handleSubmit = async () => {
    setLoadingSave(true);
    try {
      // Enviar el username y campaignIds según lo que espera el backend
      const userDataToUpdate = {
        username: userData?.username,  // Si el nombre de usuario no cambia, no lo incluyas
        campaignIds: selectedCampaigns,
      };

      await axios.put(`/api/v1/users/${id}`, userDataToUpdate);
      toast.success('User campaigns updated successfully');
    } catch (err) {
      console.error('Error saving campaigns', err);
      toast.error('Failed to save campaigns');
    } finally {
      setLoadingSave(false);
    }
  };

  if (loadingUser || loadingCampaigns) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth='md'>
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Edit User Campaigns</Typography>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar alt={userData?.username ?? "Default User"} src={`/path/to/images/${userData?.picture}`} sx={{ width: 100, height: 100 }} />
                </Grid>
                <Grid item xs>
                  <Typography variant="h4">{userData?.username ?? "Username"}</Typography>
                  <Typography variant="body2" color="textSecondary">{userData?.email ?? "No email"}</Typography>
                  <Typography variant="body2" color="textSecondary">{userData?.role?.role ?? "No role"}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Typography variant="h6" gutterBottom>Select Campaigns</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {campaigns?.length > 0 ? campaigns.map((campaign) => (
              <Chip
                key={campaign.id}
                label={campaign?.campaignName}
                onClick={() => handleCampaignChange(campaign.id)}
                color={selectedCampaigns.includes(campaign.id) ? 'primary' : 'default'}
                clickable
                sx={{ cursor: 'pointer', minHeight: '80px', font: 'inherit' }}
              />
            )) : (
              <Typography variant="body2" color="textSecondary">No campaigns available</Typography>
            )}
          </Box>
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loadingSave || selectedCampaigns.length === 0}
            sx={{ mt: 2, paddingInline: 3 }}
          >
            {loadingSave ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserCampaignForm;
