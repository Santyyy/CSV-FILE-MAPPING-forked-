import React from 'react'
import TableComponent from './TableComponent'

const CsvTable = () => {
  const data = [
    {id: 1, name: 'John Doe', age: 30, city: 'New York'},
    {id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles'},
    // Add more data rows as needed
  ]

  const columns = [
    {title: 'ID', dataIndex: 'id', key: 'id'},
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'Age', dataIndex: 'age', key: 'age'},
    {title: 'City', dataIndex: 'city', key: 'city'},
    // Add more columns as needed
  ]

  return <TableComponent data={data} columns={columns} />
}

export default CsvTable
