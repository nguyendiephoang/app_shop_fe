import { NextPage } from "next"
import { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from "src/views/pages/my-profile"



type TProps = {}
const Index: NextPage<TProps> = () => {
  return <MyProfilePage />
}

export default Index
Index.getLayout =  ( page: ReactNode ) => <LayoutNotApp>{page}</LayoutNotApp>

