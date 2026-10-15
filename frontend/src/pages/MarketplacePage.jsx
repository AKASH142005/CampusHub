import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Storefront as MarketIcon,
  Search as SearchIcon,
  ContactPhone as ContactIcon,
  Place as LocationIcon,
  AttachMoney as PriceIcon
} from '@mui/icons-material';
import { marketplaceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useOutletContext } from 'react-router-dom';

const CATEGORIES = ['ALL', 'TEXTBOOKS', 'ELECTRONICS', 'HOSTEL_GEAR', 'LOST_AND_FOUND', 'OTHER'];
const TYPES = ['ALL', 'SELL', 'BUY', 'LOST', 'FOUND'];

export default function MarketplacePage() {
  const theme = useTheme();
  const { user } = useAuth();
  const { onOpenAuthModal } = useOutletContext();

  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('TEXTBOOKS');
  const [type, setType] = useState('SELL');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState('');

  // Contact Dialog
  const [contactItem, setContactItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await marketplaceAPI.getAll(selectedCategory, selectedType);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, selectedType]);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await marketplaceAPI.create({
        title,
        description,
        category,
        type,
        price: parseFloat(price) || 0,
        location: location || 'Main Campus',
        seller_contact: contact || user?.email,
        image_url: imageUrl
      });
      setOpenModal(false);
      setTitle('');
      setDescription('');
      setPrice('');
      fetchItems();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to list item');
    }
  };

  return (
    <Box sx={{ maxWidth: 1300, mx: 'auto', width: '100%' }}>
      {/* Page Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Campus Marketplace & Lost/Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Peer-to-peer textbook exchanges, dorm equipment, gadgets, and lost items
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            if (!user) onOpenAuthModal();
            else setOpenModal(true);
          }}
          sx={{ py: 1.2, px: 2.5 }}
        >
          Post a Listing
        </Button>
      </Stack>

      {/* Filter Row */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat.replace(/_/g, ' ')}
              clickable
              color={selectedCategory === cat ? 'primary' : 'default'}
              variant={selectedCategory === cat ? 'filled' : 'outlined'}
              onClick={() => setSelectedCategory(cat)}
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
          {TYPES.map((t) => (
            <Chip
              key={t}
              label={t}
              clickable
              color={selectedType === t ? 'secondary' : 'default'}
              variant={selectedType === t ? 'filled' : 'outlined'}
              onClick={() => setSelectedType(t)}
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Box>
      </Stack>

      {/* Grid of Listings */}
      <Grid container spacing={3}>
        {items.map((item) => {
          const isLostOrFound = item.type === 'LOST' || item.type === 'FOUND';

          return (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  height="190"
                  image={item.image_url || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600'}
                  alt={item.title}
                />

                <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Chip
                      label={item.type}
                      size="small"
                      color={
                        item.type === 'SELL' ? 'success' :
                        item.type === 'LOST' ? 'error' :
                        item.type === 'FOUND' ? 'warning' : 'primary'
                      }
                      sx={{ fontWeight: 700 }}
                    />
                    {!isLostOrFound ? (
                      <Typography variant="h6" fontWeight={800} color="primary.main">
                        ${parseFloat(item.price).toFixed(2)}
                      </Typography>
                    ) : (
                      <Chip label="Lost & Found" size="small" variant="outlined" />
                    )}
                  </Stack>

                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flexGrow: 1
                    }}
                  >
                    {item.description}
                  </Typography>

                  <Stack spacing={0.8} sx={{ mb: 2.5, bgcolor: 'background.subtle', p: 1.5, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 0.8, color: 'primary.main' }} />
                      {item.location || 'Campus Center'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Listed by: <strong>{item.seller_name}</strong>
                    </Typography>
                  </Stack>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ContactIcon />}
                    onClick={() => setContactItem(item)}
                    sx={{ borderRadius: 2.5 }}
                  >
                    Contact Poster
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Post Listing Dialog */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Post a Campus Listing</DialogTitle>
        <form onSubmit={handleCreateListing}>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Stack spacing={2.5}>
              <TextField
                label="Item or Listing Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. TI-84 Plus CE Calculator"
                required
              />
              <TextField
                label="Description & Details"
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  select
                  label="Category"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="TEXTBOOKS">Textbooks</MenuItem>
                  <MenuItem value="ELECTRONICS">Electronics</MenuItem>
                  <MenuItem value="HOSTEL_GEAR">Hostel Gear</MenuItem>
                  <MenuItem value="LOST_AND_FOUND">Lost & Found</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Listing Type"
                  fullWidth
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="SELL">For Sale</MenuItem>
                  <MenuItem value="BUY">Looking to Buy</MenuItem>
                  <MenuItem value="LOST">Lost Item</MenuItem>
                  <MenuItem value="FOUND">Found Item</MenuItem>
                </TextField>
              </Stack>
              {type !== 'LOST' && type !== 'FOUND' && (
                <TextField
                  label="Price ($ USD)"
                  type="number"
                  fullWidth
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              )}
              <TextField
                label="Campus Pickup Location"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Science Library or North Dorms"
              />
              <TextField
                label="Contact Info (Phone / Telegram / Email)"
                fullWidth
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. @student_handle or phone number"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Publish Listing
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Contact Dialog */}
      <Dialog
        open={Boolean(contactItem)}
        onClose={() => setContactItem(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Poster Contact Info
        </DialogTitle>
        <DialogContent>
          {contactItem && (
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {contactItem.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Listed by: <strong>{contactItem.seller_name}</strong>
              </Typography>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <strong>Contact:</strong> {contactItem.seller_contact}
              </Alert>
              <Typography variant="caption" color="text.secondary">
                Pickup location: {contactItem.location || 'Main Campus'}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setContactItem(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
