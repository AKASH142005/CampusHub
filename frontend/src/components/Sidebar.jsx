import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Chip,
  useTheme,
  Divider,
  Paper
} from '@mui/material';
import {
  DashboardOutlined as DashboardIcon,
  CampaignOutlined as NoticesIcon,
  EventOutlined as EventsIcon,
  StorefrontOutlined as MarketplaceIcon,
  PersonOutline as ProfileIcon,
  FiberManualRecord as StatusDotIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

export const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Notice Board', icon: <NoticesIcon />, path: '/notices', badge: 'Alerts' },
  { text: 'Campus Events', icon: <EventsIcon />, path: '/events' },
  { text: 'Marketplace & Items', icon: <MarketplaceIcon />, path: '/marketplace' },
  { text: 'My Profile', icon: <ProfileIcon />, path: '/profile' }
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
    if (mobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        p: 2
      }}
    >
      <Box>
        {/* Brand Header */}
        <Box
          onClick={() => handleNavClick('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            px: 1,
            py: 1.5,
            mb: 1
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
              mr: 1.5,
              flexShrink: 0
            }}
          >
            <SchoolIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.2rem',
                lineHeight: 1.2,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #818cf8 0%, #22d3ee 100%)'
                  : 'linear-gradient(90deg, #4338ca 0%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              CampusHub
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              University Portal
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

        <Typography
          variant="overline"
          sx={{
            px: 1.5,
            color: 'text.secondary',
            fontWeight: 700,
            letterSpacing: '0.08em',
            display: 'block',
            fontSize: '0.7rem'
          }}
        >
          NAVIGATION
        </Typography>

        <List sx={{ pt: 0.5 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.8 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.2,
                    px: 2,
                    bgcolor: isActive
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'rgba(79, 70, 229, 0.09)'
                      : 'transparent',
                    color: isActive ? 'primary.main' : 'text.primary',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 38,
                      color: isActive ? 'primary.main' : 'text.secondary'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.92rem',
                      fontWeight: isActive ? 700 : 500
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      color="secondary"
                      sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Campus Network Status */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(31, 41, 55, 0.5)' : '#f1f5f9',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8 }}>
            <StatusDotIcon sx={{ fontSize: 10, color: 'success.main', mr: 1 }} />
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              CAMPUS NETWORK
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={600} noWrap>
            Term: Fall 2026
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Fastify & MySQL Online
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={Boolean(mobileOpen)}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper
          }
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
