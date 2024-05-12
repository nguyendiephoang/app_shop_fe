import * as React from 'react'
import { styled, createMuiTheme, useTheme } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { NextPage } from 'next'
import IconifyIcon from 'src/components/Icon'
import UserDropdown from './components/user-dropdown'
import ModeToggle from './components/mode-toggle'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

type TProps = {
  open: boolean
  toggleDrawer: () => void
  isHideMenu?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.customColors.lightPaperBg : theme.palette.customColors.darkPaperBg,
  color: theme.palette.primary.main,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const VerticalLayout: NextPage<TProps> = ({ open, toggleDrawer, isHideMenu }) => {
  const theme = useTheme()
  const { user } = useAuth()
  const router = useRouter()

  return (
    <AppBar position='absolute' open={open}>
      <Toolbar
        sx={{
          pr: '30px', // keep right padding when drawer closed
          margin: '0 20px'
        }}
      >
        {!isHideMenu && (
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              padding: '10px',
              ...(open && { display: 'none' })
            }}
          >
            <IconifyIcon icon='ic:baseline-menu' />
          </IconButton>
        )}
        <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ml: 2, flexGrow: 1, cursor: 'pointer' }} onClick={() => router.push('/') }>
          Dashboard
        </Typography>
        <ModeToggle />
        {user ? (
          <UserDropdown />
        ) : (
          <Button variant='contained' sx={{ width: 'auto' }} onClick={() => router.push(ROUTE_CONFIG.LOGIN)}>
            Sign In
          </Button>
        )}
        {/* <IconButton color='inherit'>
          <Badge badgeContent={4} color='primary'>
            <IconifyIcon icon='mingcute:notification-fill' />
          </Badge>
        </IconButton> */}
      </Toolbar>
    </AppBar>
  )
}

export default VerticalLayout
