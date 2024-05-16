// ** React Imports
import { ReactNode, ReactElement } from 'react'

// ** Types
import { useAuth } from 'src/hooks/useAuth'


interface AclGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const NoGuard = (props: AclGuardProps) => {
  // ** Props

  const { children, fallback } = props

  const auth = useAuth()

  if (auth.loading) {
    return fallback
  }

  return <>{ children }</>
}

export default NoGuard
