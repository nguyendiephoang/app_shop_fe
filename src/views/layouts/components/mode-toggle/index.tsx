import IconButton from '@mui/material/IconButton'
import IconifyIcon from 'src/components/Icon'
import { useSettings } from 'src/hooks/useSettings'
import { Mode } from 'src/types/layouts'


const ModeToggle = () => {
  const { settings, saveSettings } = useSettings()
  const handleModeChange = (mode: Mode) => {
    saveSettings({ ...settings, mode })
  }
  const handleToggleMode = () => {
    if (settings.mode === 'dark') {
      handleModeChange('light')
    } else {
      handleModeChange('dark')
    }
  }

  return (
    <IconButton onClick={handleToggleMode}>
      <IconifyIcon
        icon={settings.mode === 'light' ? 'material-symbols:dark-mode-outline' : 'material-symbols-light:light-mode'}
      />
    </IconButton>
  )
}

export default ModeToggle
