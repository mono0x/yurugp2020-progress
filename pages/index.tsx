import {
  Box,
  Container,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core"
import palette from "google-palette"
import { GetStaticProps } from "next"
import NextLink from "next/link"
import { useMemo, useState } from "react"
import { Line } from "react-chartjs-2"

import Header from "../components/Header"
import getAll from "../src/getAll"
import { Item, Kind } from "../src/types"

type Props = {
  items: Item[]
}

const IndexPage: React.FC<Props> = props => {
  const { items } = props

  const [kind, setKind] = useState<Kind>(Kind.LOCAL)

  const [page, setPage] = useState(0)
  const rowsPerPage = 10

  const filtered = useMemo(() => {
    const filtered = items.filter(item => item.character.kind == kind)
    filtered.sort(
      (a, b) =>
        a.records[a.records.length - 1].rank -
        b.records[b.records.length - 1].rank
    )
    return filtered
  }, [items, kind])

  const paginated = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [filtered, page, rowsPerPage])

  const oneRankHigher = useMemo(() => {
    if (page == 0) {
      return [
        null,
        ...filtered.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage - 1
        ),
      ]
    }
    return filtered.slice(
      page * rowsPerPage - 1,
      page * rowsPerPage + rowsPerPage - 1
    )
  }, [filtered, page, rowsPerPage])

  const colors = useMemo(() => {
    return palette("mpn65", rowsPerPage).map(hex => `#${hex}`)
  }, [rowsPerPage])

  const data = useMemo(() => {
    return {
      datasets: paginated.map((item, i) => ({
        label: item.character.name,
        borderColor: colors[i],
        fill: false,
        lineTension: 0,
        data: item.records.map(record => ({
          t: record.date,
          y: record.point,
        })),
      })),
    }
  }, [paginated, colors])

  return (
    <div>
      <Header />

      <Container>
        <Box>
          <FormControl>
            <InputLabel id="kind-select-label">Kind</InputLabel>
            <Select
              labelId="kind-select-label"
              id="kind-select"
              value={kind}
              onChange={e => {
                setKind(e.target.value as Kind)
                setPage(0)
              }}
            >
              <MenuItem value={Kind.LOCAL}>ご当地</MenuItem>
              <MenuItem value={Kind.COMPANY}>企業・その他</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          style={{
            position: "relative",
            width: "100%",
            height: "50vh",
          }}
        >
          <Line
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                xAxes: [
                  {
                    type: "time",
                    time: {
                      unit: "day",
                    },
                  },
                ],
                yAxes: [
                  {
                    beginAtZero: true,
                  },
                ],
              },
            }}
          />
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {tablePagination({
                  count: filtered.length,
                  page: page,
                  rowsPerPage: rowsPerPage,
                  setPage: setPage,
                })}
              </TableRow>
              <TableRow>
                <TableCell align="right">Rank</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Total Points</TableCell>
                <TableCell align="right">+ Points</TableCell>
                <TableCell align="right">Behind</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((item, i) => (
                <TableRow key={item.character.id}>
                  <TableCell align="right">
                    {item.records[item.records.length - 1].rank}
                  </TableCell>
                  <TableCell>
                    <Link
                      component={NextLink}
                      href="/characters/[id]"
                      as={`/characters/${item.character.id}`}
                    >
                      {item.character.name}
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    {item.records[item.records.length - 1].point}
                  </TableCell>
                  <TableCell align="right">{plusPoint(item)}</TableCell>
                  <TableCell align="right">
                    {behind(item, oneRankHigher[i]) || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                {tablePagination({
                  count: filtered.length,
                  page: page,
                  rowsPerPage: rowsPerPage,
                  setPage: setPage,
                })}
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
    </div>
  )
}

function tablePagination({
  count,
  page,
  rowsPerPage,
  setPage,
}: {
  count: number
  page: number
  rowsPerPage: number
  setPage: (newPage: number) => void
}): JSX.Element {
  return (
    <TablePagination
      count={count}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[]}
      page={page}
      onChangePage={(_, newPage) => setPage(newPage)}
    />
  )
}

function plusPoint(item: Item): number {
  if (item.records.length == 1) {
    return item.records[0].point
  }
  return (
    item.records[item.records.length - 1].point -
    item.records[item.records.length - 2].point
  )
}

function behind(item: Item, oneRankHigher: Item | null): number | null {
  if (oneRankHigher == null) {
    return null
  }
  return (
    oneRankHigher.records[oneRankHigher.records.length - 1].point -
    item.records[item.records.length - 1].point
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const items = await getAll()
  return {
    props: {
      items,
    },
  }
}

export default IndexPage
