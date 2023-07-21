import React, {useState} from 'react'
import Papa from 'papaparse'
import axios from 'axios'
import {Select, Button, Upload, message} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import TableComponent from './TableComponent'
import 'antd/dist/antd.css' // Import Ant Design styles

const {Option} = Select

const App: React.FC = () => {
  const [csvData, setCsvData] = useState<any[]>([])
  const [tableColumns, setTableColumns] = useState<any[]>([])
  const [mappedFields, setMappedFields] = useState<Record<string, string>>({})

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      complete: result => {
        if (result.data && result.data.length > 0) {
          setCsvData(result.data)
          setTableColumns(
            Object.keys(result.data[0]).map(colName => ({
              title: colName,
              dataIndex: colName,
              key: colName,
            })),
          )
        }
      },
      header: true,
    })
  }

  const handleMappingChange = (
    csvFieldName: string,
    mappedFieldName: string,
  ) => {
    setMappedFields(prevMappedFields => ({
      ...prevMappedFields,
      [csvFieldName]: mappedFieldName,
    }))
  }

  const saveDataToBackend = () => {
    // Replace CSV field names with mapped field names
    const mappedData = csvData.map(row => {
      const mappedRow: Record<string, any> = {}
      Object.keys(row).forEach(csvFieldName => {
        const mappedFieldName = mappedFields[csvFieldName] || csvFieldName
        mappedRow[mappedFieldName] = row[csvFieldName]
      })
      return mappedRow
    })

    axios
      .post('/api/saveData', mappedData)
      .then(response => {
        console.log('Data saved successfully on the backend:', response.data)
      })
      .catch(error => {
        console.error('Error saving data on the backend:', error)
      })
  }

  const handleUploadChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  }

  const uploadProps = {
    accept: '.csv',
    showUploadList: false,
    customRequest: ({file}: any) => {
      handleFileUpload(file)
    },
    onChange: handleUploadChange,
  }

  return (
    <div>
      <h1>CSV Upload and Table Display</h1>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Upload CSV</Button>
      </Upload>
      {csvData.length > 0 && (
        <>
          <div>
            <h3>Map CSV Fields:</h3>
            <ul>
              {Object.keys(csvData[0]).map(csvFieldName => (
                <li key={csvFieldName}>
                  {csvFieldName} ➡️
                  <Select
                    onChange={value => handleMappingChange(csvFieldName, value)}
                    defaultValue=""
                  >
                    <Option value="">-- Select Field --</Option>
                    <Option value="TargetErrorCode">TargetErrorCode</Option>
                    <Option value="ErrorType">ErrorType</Option>
                    <Option value="SourceErrorCode">SourceErrorCode</Option>
                    <Option value="SourceErrorMessage">
                      SourceErrorMessage
                    </Option>
                    <Option value="SourceErrorPhrase">SourceErrorPhrase</Option>
                    <Option value="TargetErrorPhrase">TargetErrorPhrase</Option>
                    <Option value="TargetErrorMessage">
                      TargetErrorMessage
                    </Option>
                  </Select>
                </li>
              ))}
            </ul>
          </div>
          <Button onClick={saveDataToBackend}>Save Data</Button>
          <TableComponent data={csvData} columns={tableColumns} />
        </>
      )}
    </div>
  )
}

export default App
