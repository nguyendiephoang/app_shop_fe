import { styled, Box, BoxProps } from '@mui/material'
import { NextPage } from 'next'

type TProps = {
  children: React.ReactNode
}

const BlankLayoutWapper = styled(Box)<BoxProps>(({ theme }) => ({
  height: '100vh'
}))

const BlankLayout: NextPage<TProps> = ({ children }) => {
  return (
    <BlankLayoutWapper>
      <Box sx={{ overflow: 'hidden', minHeight: '100vh' }}>{children}</Box>
    </BlankLayoutWapper>
  )
}

export default BlankLayout
