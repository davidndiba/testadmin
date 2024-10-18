import React, { useState, useEffect } from 'react';
import { Form, Button, message, Select, Input } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // Or your custom build
import { request } from 'umi';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { MailOutlined } from '@ant-design/icons';

const SendEmail = () => {
  const [editorContent, setEditorContent] = useState('');
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
    fetchUsers();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await request('/templates');
      setTemplates(response.data);
    } catch (error) {
      message.error('Failed to fetch templates');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await request('/users');
      const userOptions = response.data.data.map((user) => ({
        label: user.display_name || user.username,
        value: user.id,
        email: user.email // Store email for each user
      }));
      setUsers(userOptions);
    } catch (error) {
      message.error('Failed to fetch users');
    }
  };

  const handleUserSelection = (value) => {
    setSelectedUsers(value);
  };

  const handleTemplateSelection = async (value) => {
    setSelectedTemplate(value);
    try {
      const response = await request(`/templates/${value}`);
      const { body, subject } = response.data;
      setEditorContent(body);
      setSubject(subject);
    } catch (error) {
      message.error('Failed to fetch template');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Extract email addresses from selected users
    const selectedUserEmails = users
      .filter(user => selectedUsers.includes(user.value))
      .map(user => user.email)
      .filter(email => email && email.trim() !== '' && isValidEmail(email)); // Validate emails

    if (selectedUserEmails.length === 0) {
      message.error('Please select at least one user with a valid email address.');
      setLoading(false);
      return;
    }

    const payload = {
      to: selectedUserEmails,
      subject: subject || 'Default Subject',
      body: editorContent,
    };

    try {
      const response = await request('/compose-email', {
        method: 'POST',
        data: payload,
      });

      // Process the response if needed
      console.log('Email sent response:', response);

      message.success('Email sent successfully');
      form.resetFields();
      setEditorContent('');
      setSelectedUsers([]);
      setSelectedTemplate('');
      setSubject('');
    } catch (error) {
      message.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  // Function to validate email addresses
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <PageContainer>
      <ProCard>
        <Form form={form} layout="vertical">
          <Form.Item label="To Users(Multiple)" name="to" rules={[{ required: true, message: 'Please select users!' }]}>
            <Select
              mode="multiple"
              placeholder="Select users to send email"
              value={selectedUsers}
              onChange={handleUserSelection}
              options={users.map(user => ({ label: user.label, value: user.value }))}
              style={{ width: '100%' }}
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item label="Select Template" name="template">
            <Select
              placeholder="Select a template"
              onChange={handleTemplateSelection}
              value={selectedTemplate}
              style={{ width: '100%' }}
            >
              {templates.map((template) => (
                <Select.Option key={template.id} value={template.id}>
                  {template.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Subject" name="subject" rules={[{ required: true, message: 'Subject is required!' }]}>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </Form.Item>

          {/* <Form.Item label="Email Content" name="body" rules={[{ required: true, message: 'Email content is required!' }]}>
            <CKEditor
              editor={ClassicEditor}
              data={editorContent}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditorContent(data);
              }}
              config={{
                toolbar: {
                  items: [
                    'heading', '|',
                    'bold', 'italic', 'underline', 'strikethrough', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
                    'link', 'blockQuote', 'insertTable', 'mediaEmbed', 'imageUpload', 'codeBlock', '|',
                    'undo', 'redo'
                  ]
                },
                image: {
                  toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
                },
                table: {
                  contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                },
                fontFamily: {
                  options: ['default', 'Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana']
                },
                fontSize: {
                  options: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
                },
                language: 'en'
              }}
              style={{ width: '100%', minHeight: '1500px' }} // Increased height for better usability
            />
          </Form.Item> */}
<Form.Item
  label="Email Content"
  name="body"
  rules={[{ required: true, message: 'Email content is required!' }]}
>
  <CKEditor
    editor={ClassicEditor}
    data={editorContent}
    onChange={(event, editor) => {
      const data = editor.getData();
      setEditorContent(data);
    }}
    config={{
      toolbar: {
        items: [
          'heading', '|',
          'bold', 'italic', 'underline', 'strikethrough', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
          'link', 'blockQuote', 'insertTable', 'mediaEmbed', 'imageUpload', 'codeBlock', '|',
          'undo', 'redo'
        ]
      },
      image: {
        toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
      },
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
      },
      fontFamily: {
        options: ['default', 'Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana']
      },
      fontSize: {
        options: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
      },
      language: 'en'
    }}
    style={{ width: '100%', minHeight: '500px' }} // Set initial minHeight to a large value for appearance
  />
</Form.Item>

          <Form.Item>
            {/* <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={selectedUsers.length === 0 || !editorContent || !subject}
            >
              Send Email
            </Button> */}
            <Button
  icon={<MailOutlined />} // Using the Mail icon from Ant Design
  style={{
    backgroundColor: '#1890ff', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '4px'
  }}
  type="primary"
  onClick={handleSubmit}
  loading={loading}
  disabled={selectedUsers.length === 0 || !editorContent || !subject}
>
  Send Email
</Button>

          </Form.Item>
        </Form>
      </ProCard>
    </PageContainer>
  );
};

export default SendEmail;


// import React, { useState, useEffect } from 'react';
// import { Form, Button, message, Select, Card, Row, Col } from 'antd';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { request } from 'umi';
// import { PageContainer, ProCard } from '@ant-design/pro-components';

// const SendEmail = () => {
//   const [editorContent, setEditorContent] = useState('');
//   const [templates, setTemplates] = useState([]);
//   const [users, setUsers] = useState([]); // For storing the list of users
//   const [modules, setModules] = useState([]); // For storing the list of modules
//   const [selectedUsers, setSelectedUsers] = useState([]); // For storing selected users
//   const [selectedModule, setSelectedModule] = useState(''); // For storing selected module
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchTemplates();
//     fetchUsers();
//     fetchModules(); // Fetch the list of modules when the component mounts
//   }, []);

//   const fetchTemplates = async () => {
//     try {
//       const response = await request('/templates');
//       setTemplates(response.data);
//     } catch (error) {
//       message.error('Failed to fetch templates');
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await request('/users');
//       const userOptions = response.data.data.map((user) => ({
//         label: user.display_name || user.username,
//         value: user.id, // Use the ID to identify the user
//       }));
//       setUsers(userOptions);
//     } catch (error) {
//       message.error('Failed to fetch users');
//     }
//   };

//   const fetchModules = async () => {
//     try {
//       const response = await request('/modules');
//       const moduleOptions = response.data.map((module) => ({
//         label: module,
//         value: module,
//       }));
//       setModules(moduleOptions);
//     } catch (error) {
//       message.error('Failed to fetch modules');
//     }
//   };

//   const handleUserSelection = (value) => {
//     setSelectedUsers(value); // Update selected users
//   };

//   const handleModuleSelection = (value) => {
//     setSelectedModule(value); // Update selected module
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await request('/send-email', {
//         method: 'POST',
//         data: {
//           users: selectedUsers,
//           module: selectedModule, // Send the selected module
//           content: editorContent,
//         },
//       });
//       message.success('Email sent successfully');
//       form.resetFields();
//       setEditorContent('');
//       setSelectedUsers([]);
//       setSelectedModule('');
//     } catch (error) {
//       message.error('Failed to send email');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PageContainer>
//       <ProCard>
//         <Form form={form} layout="vertical">
//           <Form.Item label="To Users">
//             <Select
//               mode="multiple"
//               placeholder="Select users to send email"
//               value={selectedUsers}
//               onChange={handleUserSelection}
//               options={users}
//               style={{ width: '100%' }}
//               filterOption={(input, option) =>
//                 option.label.toLowerCase().includes(input.toLowerCase())
//               }
//             />
//           </Form.Item>

//           <Form.Item label="To Modules">
//             <Select
//               placeholder="Select a module"
//               value={selectedModule}
//               onChange={handleModuleSelection}
//               options={modules}
//               style={{ width: '100%' }}
//               filterOption={(input, option) =>
//                 option.label.toLowerCase().includes(input.toLowerCase())
//               }
//             />
//           </Form.Item>

//           <Form.Item label="Select Template">
//             <Select placeholder="Select a template">
//               {templates.map((template) => (
//                 <Select.Option key={template.id} value={template.id}>
//                   {template.name}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item label="Email Content">
//             <CKEditor
//               editor={ClassicEditor}
//               data={editorContent}
//               onChange={(event, editor) => {
//                 const data = editor.getData();
//                 setEditorContent(data);
//               }}
//               config={{
//                 toolbar: [
//                   'heading',
//                   '|',
//                   'bold',
//                   'italic',
//                   'link',
//                   'bulletedList',
//                   'numberedList',
//                   'blockQuote',
//                   '|',
//                   'undo',
//                   'redo',
//                 ],
//               }}
//               style={{ width: '100%', minHeight: '300px' }} // Increased height
//             />
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type="primary"
//               onClick={handleSubmit}
//               loading={loading}
//               disabled={(selectedUsers.length === 0 && !selectedModule) || !editorContent}
//             >
//               Send Email
//             </Button>
//           </Form.Item>
//         </Form>
//       </ProCard>
//     </PageContainer>
//   );
// };

// export default SendEmail;
