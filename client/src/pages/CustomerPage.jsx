// import { Table } from 'antd'
// import Header from '../components/header/Header.jsx'

// const CustomerPage = () => {
//   const dataSource = [
//     {
//       key: '1',
//       name: 'Mike',
//       age: 32,
//       address: '10 Downing Street',
//     },
//     {
//       key: '2',
//       name: 'John',
//       age: 42,
//       address: '10 Downing Street',
//     },
//   ]

//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Age',
//       dataIndex: 'age',
//       key: 'age',
//     },
//     {
//       title: 'Address',
//       dataIndex: 'address',
//       key: 'address',
//     },
//   ]

//   return (
//     <>
//       <Header />
//       <div className="px-6 mt-6">
//         <h1 className="text-4xl font-bold text-center mb-4">Müsteriler</h1>
//         <Table
//           dataSource={dataSource}
//           columns={columns}
//           bordered
//           pagination={false}
//         />
//       </div>
//     </>
//   )
// }

// export default CustomerPage



import { Button, Input, Space, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import Header from "../components/header/Header.jsx";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';




const CustomerPage = () => {
  const [billItems, setBillItems] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  }



  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex)
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  useEffect(() => {
    const getBills = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/bills/get-all");
        const data = await res.json();
        setBillItems(data);
      } catch (error) {
        console.log(error);
      }
    };

    getBills();
  }, []);

  const columns = [
    {
      title: "Müşteri Adı",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title")
    },
    {
      title: "Telefon Numarası",
      dataIndex: "customerPhoneNumber",
      key: "customerPhoneNumber",
      ...getColumnSearchProps("customerPhoneNumber")
    },
    {
      title: "İşlem Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        return <span>{text.substring(0, 10)}</span>;
      },
    },
  ];

  return (
    <>
      <Header />
      <div className="px-6">
        <h1 className="text-4xl font-bold text-center my-4">Müşterilerim</h1>
        <Table
          dataSource={billItems}
          columns={columns}
          bordered
          pagination={false}
          scroll={{
            x: 1000,
            y: 300
          }}
          rowKey="_id"
        />
      </div>
    </>
  );
};
export default CustomerPage;