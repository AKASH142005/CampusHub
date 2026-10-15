import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  useTheme,
  Stack
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Menu as MenuIcon,
  NotificationsOutlined as NotificationsIcon,
  PersonOutline as PersonIcon,
  ExitToApp as LogoutIcon,
  SwapHoriz as SwitchRoleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DRAWER_WIDTH } from './Sidebar';

export default function Navbar({ onToggleSidebar, onToggleTheme, currentMode, onOpenAuthModal }) {
  const { user, isAuthenticated, logout, quickLogin } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElRole, setAnchorElRole] = useState(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenRoleMenu = (event) => setAnchorElRole(event.currentTarget);
  const handleCloseRoleMenu = () => setAnchorElRole(null);

  const handleRoleSwitch = async (role) => {
    handleCloseRoleMenu();
    try {
      await quickLogin(role);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary',
        zIndex: theme.zIndex.appBar
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        {/* Left: Mobile hamburger menu or Desktop Breadcrumb */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onToggleSidebar}
            sx={{ display: { md: 'none' }, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="text.secondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Academic Year 2026-2027
          </Typography>
        </Stack>

        {/* Right Actions */}
        <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
          {/* Quick Demo Role Switcher Pill */}
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<SwitchRoleIcon fontSize="small" />}
            onClick={handleOpenRoleMenu}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              borderRadius: 20,
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.5,
              borderColor: theme.palette.divider,
              bgcolor: theme.palette.background.paper
            }}
          >
            Role: {user?.role || 'Guest'}
          </Button>

          <Menu
            anchorEl={anchorElRole}
            open={Boolean(anchorElRole)}
            onClose={handleCloseRoleMenu}
            PaperProps={{ sx: { mt: 1.5, borderRadius: 3, minWidth: 180 } }}
          >
            <MenuItem onClick={() => handleRoleSwitch('STUDENT')}>
              🎓 Login as Student
            </MenuItem>
            <MenuItem onClick={() => handleRoleSwitch('FACULTY')}>
              👨‍🏫 Login as Faculty
            </MenuItem>
            <MenuItem onClick={() => handleRoleSwitch('ADMIN')}>
              🛡️ Login as Admin
            </MenuItem>
          </Menu>

          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${currentMode === 'dark' ? 'Light' : 'Dark'} mode`}>
            <IconButton onClick={onToggleTheme} color="inherit">
              {currentMode === 'dark' ? <LightModeIcon sx={{ color: '#fbbf24' }} /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Announcements & Alerts">
            <IconButton color="inherit" onClick={() => navigate('/notices')}>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          {/* Authentication State */}
          {isAuthenticated && user ? (
            <>
              <Tooltip title="Account Settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user.name}
                    src={user.avatar_url}
                    sx={{
                      width: 38,
                      height: 38,
                      border: `2px solid ${theme.palette.primary.main}`,
                      bgcolor: theme.palette.primary.light
                    }}
                  >
                    {user.name?.charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 3,
                    p: 1
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" noWrap>
                    {user.email}
                  </Typography>
                  <Chip
                    label={user.role}
                    size="small"
                    color={user.role === 'ADMIN' ? 'error' : user.role === 'FACULTY' ? 'secondary' : 'primary'}
                    sx={{ mt: 1, fontSize: '0.65rem', height: 20 }}
                  />
                </Box>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate('/profile');
                  }}
                  sx={{ borderRadius: 2, mt: 0.5 }}
                >
                  <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} /> Profile & RSVPs
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    logout();
                  }}
                  sx={{ borderRadius: 2, color: 'error.main' }}
                >
                  <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={onOpenAuthModal}
              sx={{ fontWeight: 600, px: 2.5 }}
            >
              Sign In
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
