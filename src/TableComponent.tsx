import React from 'react';
import { Table } from 'antd';

interface TableComponentProps {
  data: any[];
  columns: any[];
}

const TableComponent: React.FC<TableComponentProps> = ({ data, columns }) => {
  return <Table dataSource={data} columns={columns} />;
};

export default TableComponent;
