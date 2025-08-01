"use client"

import MoreIcon from "@mui/icons-material/MoreVert"
import {
  AppBar,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material"
import Head from "next/head"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Kind } from "../types"

type Props = {
  title?: string
  kind: Kind
}

const Header: React.FC<Props> = (props) => {
  const { kind, title } = props
  const router = useRouter()

  const [moreAnchorEl, setMoreAnchorEl] = useState<HTMLElement | undefined>(
    undefined
  )

  const handleMoreMenuClose = () => {
    setMoreAnchorEl(undefined)
  }

  const tabs = [
    {
      value: Kind.LOCAL,
      label: "ご当地",
      href: "/",
    },
    {
      value: Kind.COMPANY,
      label: "企業・その他",
      href: "/company/",
    },
  ]

  return (
    <div>
      <Head>
        {title ? (
          <title>{title} | YuruGP 2020 Progress</title>
        ) : (
          <title>YuruGP 2020 Progress</title>
        )}
      </Head>

      <AppBar position="static">
        <Toolbar>
          <div style={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap>
              {title ? title : "YuruGP 2020 Progress"}
            </Typography>
          </div>
          <div>
            <IconButton
              aria-label="Display more actions"
              aria-haspopup="true"
              color="inherit"
              onClick={(e) => setMoreAnchorEl(e.currentTarget)}
            >
              <MoreIcon />
            </IconButton>
            <Menu
              anchorEl={moreAnchorEl}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              open={!!moreAnchorEl}
              onClose={handleMoreMenuClose}
            >
              <MenuItem
                component={Link}
                href="https://yurugp.jp/"
                onClick={handleMoreMenuClose}
                color="inherit"
              >
                Official Website
              </MenuItem>
              <MenuItem
                component={Link}
                href="https://github.com/mono0x/yurugp2020-progress"
                onClick={handleMoreMenuClose}
                color="inherit"
              >
                GitHub
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
        <Tabs value={kind} variant="fullWidth" textColor="inherit">
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              onClick={() => {
                router.push(tab.href)
              }}
            />
          ))}
        </Tabs>
      </AppBar>
    </div>
  )
}

export default Header
