import { NextPage } from 'next'
import List from '@mui/material/List'
import Collapse from '@mui/material/Collapse'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import * as React from 'react'
import IconifyIcon from 'src/components/Icon'
import { VerticalItems } from 'src/configs/layout'

type TProps = {}

const RecursiveListItem = ({ items, level }: { items: any; level: number }) => {
  const [openItems, setOpenItems] = React.useState<{ [key: string]: boolean }>({})

  const handleClick = (title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  return (
    <>
      {items?.map((item: any) => {
        return (
          <React.Fragment key={item.title}>
            <ListItemButton
              sx={{ padding: `8px 10px 8px ${level * 10}px` }}
              onClick={() => {
                if (item.childrens) {
                  handleClick(item.title)
                }
              }}
            >
              <ListItemIcon>
                <IconifyIcon icon={item.icon} />
              </ListItemIcon>
              <ListItemText primary={item?.title} />
              {item.childrens && item.childrens.length > 0 && (
                <>
                  {openItems[item.title] ? (
                    <IconifyIcon icon='ic:outline-expand-more' />
                  ) : (
                    <IconifyIcon icon='ic:sharp-expand-less' />
                  )}
                </>
              )}
            </ListItemButton>
            {item.childrens && item.childrens.length > 0 && (
              <>
                <Collapse in={openItems[item.title]} timeout='auto' unmountOnExit>
                  <RecursiveListItem items={item.childrens} level={level + 1} />
                </Collapse>
              </>
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

const ListVerticalLayout: NextPage<TProps> = () => {
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItem items={VerticalItems} level={1} />
    </List>
  )
}

export default ListVerticalLayout
