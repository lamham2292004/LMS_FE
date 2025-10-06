import React from 'react'
import { ResourceCollection } from '@lms/models/resource'
import Paginate from '@lms/components/Pagination/Paginate'
import RowsPerPage from '@lms/components/Pagination/RowsPerPage'
import Summary from '@lms/components/Pagination/Summary'

type Props = {
  meta: ResourceCollection<unknown>['meta'];
}

export default function Pagination(props: Props) {
  const {
    meta: {
      from,
      to,
      total,
      per_page: perPage,
      last_page: lastPage,
      current_page: currentPage,
    },
  } = props

  return (
    <div className="row align-items-center justify-content-center">
      <Summary from={from} to={to} total={total} />
      <RowsPerPage perPage={perPage} />
      <Paginate currentPage={currentPage} lastPage={lastPage} />
    </div>
  )
}
