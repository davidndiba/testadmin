
import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  Form,
  message,
  Pagination,
  Popconfirm,
  Spin,
  Tooltip,
} from 'antd';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { request } from 'umi';
import './ActivityLogs.less';

interface LogData {
  key: number;
  user: string;
  description: string;
  module: string;
  ip_address: string;
  updated_at: string;
}

const ActivityLogs = () => {
  const [data, setData] = useState<LogData[]>([]);
  const [selectedRows, setSelectedRows] = useState<LogData[]>([]);
  const [filters, setFilters] = useState({
    user: '',
    start_date: '',
    end_date: '',
    module: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await request('/users');
        const userOptions = response.data.data.map((user) => ({
          value: user.display_name || user.username,
          label: user.display_name || user.username,
        }));
        setUsers(userOptions);
      } catch (error) {
        message.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await request('/modules');
        const moduleOptions = response.data.map((module) => ({
          value: module,
          label: module,
        }));
        setModules(moduleOptions);
      } catch (error) {
        message.error('Failed to fetch modules');
      }
    };

    fetchModules();
  }, []);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const { start_date, end_date, user, module } = filters;
      const response = await request('/audits', {
        params: {
          page,
          per_page: pagination.pageSize,
          start_date: start_date || undefined,
          end_date: end_date || undefined,
          user: user || undefined,
          module: module || undefined,
        },
      });

      if (response.data && response.data.data) {
        const mappedData = response.data.data.map((log) => ({
          key: log.id,
          user: log.user,
          description: log.description,
          module: log.module,
          ip_address: log.ip_address,
          updated_at: log.auditable_record.updated_at,
        }));

        setData(mappedData);
        setPagination({
          ...pagination,
          current: page,
          total: response.data.total,
        });
      } else {
        message.error('No data found');
      }
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current);
  }, [filters, pagination.current]);

  const handleBulkDelete = async () => {
    try {
      await request('/audits/bulk-delete', {
        method: 'DELETE',
        data: {
          ...filters,
        },
      });
      message.success('Logs deleted successfully based on the filters');
      fetchData(pagination.current);
    } catch (error) {
      message.error('Failed to delete logs');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      message.error('No logs selected for deletion');
      return;
    }

    const selectedIds = selectedRows.map((log) => log.key);

    try {
      await request('/audits/bulk-delete-selected', {
        method: 'DELETE',
        data: {
          ids: selectedIds,
        },
      });
      message.success('Selected logs deleted successfully');
      fetchData(pagination.current);
      setSelectedRows([]);
    } catch (error) {
      message.error('Failed to delete selected logs');
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <div className="description-cell">{text}</div>
        </Tooltip>
      ),
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
    },
    {
      title: 'IP Address',
      dataIndex: 'ip_address',
      key: 'ip_address',
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text: string) => (
        <span className="date-cell">
          {format(new Date(text), 'yyyy-MM-dd HH:mm:ss')}
        </span>
      ),
    },
  ];

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    const { dateRange } = allValues;
    let startDate = '';
    let endDate = '';

    if (dateRange && dateRange.length === 2) {
      startDate = format(dateRange[0].toDate(), 'yyyy-MM-dd');
      endDate = format(dateRange[1].toDate(), 'yyyy-MM-dd');
      if (new Date(startDate) > new Date(endDate)) {
        message.error('Start date must be earlier than end date');
        return;
      }
    }

    const newFilters = {
      ...filters,
      user: allValues.user || '',
      module: allValues.module || '',
      start_date: startDate,
      end_date: endDate,
    };
    setFilters(newFilters);
  };
  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
  };
  
  const deleteSelectedButtonStyle = {
    marginRight: '16px',
    // backgroundColor: '#ff4d4f',  // Red background color  
    // borderColor: '#ff4d4f',      // Red border color 
    color: '#ff4d4f',               // White text color
  };
  
  const clearAllButtonStyle = {
    marginLeft: 'auto',
    // backgroundColor: '#ff4d4f',  // Red background color
    borderColor: '#ff4d4f',      // Red border color
    color: '#ff4d4f',               // White text color
  };
  
  // Optionally, you can add styles for hover states
  const buttonHoverStyle = {
    backgroundColor: '#d93025',  // Darker red for hover
    borderColor: '#d93025',      // Darker red for hover
  };
  
  return (
    <div className="activity-logs-container">
      {/* <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
        onValuesChange={handleFormValuesChange}
      >
        <Form.Item name="user" label="User">
          <ProFormSelect
            options={[{ value: '', label: 'All Users' }, ...users]}
          />
        </Form.Item>
        <Form.Item name="dateRange" label="Date Range">
          <ProFormDateRangePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item name="module" label="Module">
          <ProFormSelect
            options={[{ value: '', label: 'All Modules' }, ...modules]}
          />
        </Form.Item>
      </Form> */}
      <Form
  form={form}
  layout="inline"
  style={{ marginBottom: 16 }}
  onValuesChange={handleFormValuesChange}
>
  <Form.Item 
  name="user" 
  label="User"
  style={{ width: '30%', marginRight: '16px' }}
>
  <ProFormSelect
    options={[{ value: '', label: 'All Users' }, ...users]}
    fieldProps={{
      showSearch: true,  
      filterOption: (input, option) =>
        option?.label.toLowerCase().includes(input.toLowerCase()),

      // Remove redundant data fetching on search
      onSearch: (value) => {
        if (value === '') {
          // Clear user filter and do not refetch data unnecessarily
          form.setFieldsValue({ user: '' });
          setFilters((prevFilters) => ({ ...prevFilters, user: '' }));
        }
      },

      onSelect: (value) => {
        // Only update the user filter, do not fetch data here
        setFilters((prevFilters) => ({ ...prevFilters, user: value }));
      },
    }}
  />
</Form.Item>

  <Form.Item 
    name="dateRange" 
    label="Date Range"
    style={{ width: '30%', marginRight: '16px' }}
  >
    <ProFormDateRangePicker 
      fieldProps={{
        format: "YYYY-MM-DD",
      }} 
    />
  </Form.Item>
  
  <Form.Item 
    name="module" 
    label="Module"
    style={{ width: '30%' }}
  >
    <ProFormSelect
      options={[{ value: '', label: 'All Modules' }, ...modules]}
      fieldProps={{
        showSearch: true,
        filterOption: (input, option) =>
          option?.label.toLowerCase().includes(input.toLowerCase()),
        onSearch: (value) => {
          if (value === '') {
            form.setFieldsValue({ module: '' });
            setFilters({ ...filters, module: '' });
            fetchData(); // Re-fetch data with empty module filter
          }
        },
        onSelect: (value) => {
          setFilters({ ...filters, module: value });
          fetchData(); // Re-fetch data with the selected module
        },
      }}
    />
  </Form.Item>
</Form>

<div style={buttonContainerStyle}>
  <Button
    type="danger"
    onClick={handleDeleteSelected}
    style={deleteSelectedButtonStyle}
  >
    Delete Selected
  </Button>
  <Popconfirm
    title="Are you sure you want to clear all logs based on the filters?"
    onConfirm={handleBulkDelete}
    okText="Yes"
    cancelText="No"
  >
    <Button type="danger" style={clearAllButtonStyle}>
      Clear All
    </Button>
  </Popconfirm>
</div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <ProTable
          columns={columns}
          dataSource={data}
          search={false}
          rowKey="key"
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRows(selectedRows as LogData[]);
            },
          }}
          pagination={false}
        />
      )}

      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={(page) => setPagination({ ...pagination, current: page })}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default ActivityLogs;
