import { GetStaticProps } from "next"

import RankingView from "../components/RankingView"
import getAll from "../getAll"
import { Kind } from "../types"
import { getRankingViewProps } from "../utils"

const kind = Kind.LOCAL
const prefix = "/"

export const getStaticProps: GetStaticProps = async () => {
  const pageNumber = 1

  const items = await getAll()
  return {
    props: getRankingViewProps(items, kind, pageNumber, prefix),
  }
}

export default RankingView
