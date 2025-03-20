
import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Switch, 
  Button, 
  Divider, 
  Typography, 
  Radio, 
  Avatar, 
  List, 
  Space, 
  Tag, 
  Select, 
  Tooltip, 
  Popconfirm,
  InputNumber,
  notification,
  Card,
  Empty
} from 'antd';
import { 
  DeleteOutlined, 
  UserAddOutlined, 
  UserDeleteOutlined, 
  CrownOutlined,
  SettingOutlined,
  BellOutlined,
  BellFilled,
  SaveOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Option } = Select;

const Settingsa = ({ open, onClose }) => {
  // States for various settings
  const [form] = Form.useForm();
  const [allowAll, setAllowAll] = useState(true);
  const [memberLimit, setMemberLimit] = useState(50);
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dummy data for members and admins
  useEffect(() => {
    // This would normally be fetched from an API
    const dummyMembers = [
      { id: '1', name: 'John Doe', avatar: 'https://mui.com/static/images/avatar/1.jpg', isAdmin: true, status: 'active' },
      { id: '2', name: 'Jane Smith', avatar: 'https://mui.com/static/images/avatar/2.jpg', isAdmin: true, status: 'active' },
      { id: '3', name: 'Robert Johnson', avatar: 'https://mui.com/static/images/avatar/3.jpg', isAdmin: false, status: 'active' },
      { id: '4', name: 'Emily Davis', avatar: 'https://mui.com/static/images/avatar/4.jpg', isAdmin: false, status: 'active' },
      { id: '5', name: 'Michael Wilson', avatar: 'https://mui.com/static/images/avatar/5.jpg', isAdmin: false, status: 'inactive' },
      { id: '6', name: 'Sarah Brown', avatar: 'https://mui.com/static/images/avatar/6.jpg', isAdmin: false, status: 'active' },
    ];
    
    setMembers(dummyMembers);
    setAdmins(dummyMembers.filter(member => member.isAdmin));
    
    // Set initial form values
    form.setFieldsValue({
      groupName: 'Project Discussion Group',
      membershipType: allowAll ? 'all' : 'limit',
      memberLimit: 50,
      notifications: true
    });
  }, [form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Simulate API call
      setTimeout(() => {
        console.log('Saving group settings', {
          ...values,
          admins,
          members
        });
        
        notification.success({
          message: 'Settings Saved',
          description: 'Group settings have been updated successfully.',
          placement: 'topRight',
        });
        
        setLoading(false);
        onClose();
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Validation failed:', error);
    }
  };

  const handleDeleteGroup = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      notification.success({
        message: 'Group Deleted',
        description: 'The group has been deleted successfully.',
        placement: 'topRight',
      });
      
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleRemoveMember = (memberId) => {
    const updatedMembers = members.filter(member => member.id !== memberId);
    setMembers(updatedMembers);
    setAdmins(admins.filter(admin => admin.id !== memberId));
    
    notification.info({
      message: 'Member Removed',
      description: 'Member has been removed from the group.',
      placement: 'topRight',
    });
  };

  const handleAddAdmin = () => {
    if (!selectedMember) return;
    
    const member = members.find(m => m.id === selectedMember);
    if (member && !member.isAdmin) {
      // Update member status
      setMembers(members.map(m => 
        m.id === selectedMember ? { ...m, isAdmin: true } : m
      ));
      // Add to admins if not already there
      if (!admins.some(admin => admin.id === selectedMember)) {
        setAdmins([...admins, { ...member, isAdmin: true }]);
      }
      
      notification.success({
        message: 'Admin Added',
        description: `${member.name} is now an admin of this group.`,
        placement: 'topRight',
      });
    }
    setSelectedMember(null);
  };

  const handleRemoveAdmin = (adminId) => {
    // Remove from admins list
    setAdmins(admins.filter(admin => admin.id !== adminId));
    // Update the member's isAdmin status
    setMembers(members.map(member => 
      member.id === adminId ? { ...member, isAdmin: false } : member
    ));
    
    notification.info({
      message: 'Admin Removed',
      description: 'Admin privileges have been revoked.',
      placement: 'topRight',
    });
  };

  const handleMembershipTypeChange = (e) => {
    setAllowAll(e.target.value === 'all');
  };

  return (
<Modal
  title={
    <Space>
      <SettingOutlined />
      <span>Group Settings</span>
    </Space>
  }
  open={open}
  onCancel={onClose}
  width="80%" // Use percentage width instead of fixed pixels
  style={{ maxWidth: '900px', top: 20 }} // Add max-width and position from top
  bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }} // Make body scrollable with calculated height
  footer={[
    <Button key="cancel" onClick={onClose} icon={<CloseCircleOutlined />}>
      Cancel
    </Button>,
    <Button 
      key="save" 
      type="primary" 
      onClick={handleSave} 
      loading={loading}
      icon={<SaveOutlined />}
    >
      Save Changes
    </Button>
  ]}
  destroyOnClose
>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          groupName: 'Project Discussion Group',
          membershipType: 'all',
          memberLimit: 50,
          notifications: true
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="group-info-card" bordered={false}>
            <Form.Item
              name="groupName"
              label="Group Name"
              rules={[{ required: true, message: 'Please enter a group name' }]}
            >
              <Input 
                prefix={<TeamOutlined />} 
                placeholder="Enter group name"
                maxLength={50}
                showCount
              />
            </Form.Item>
          </Card>
        </motion.div>

        <Divider orientation="left">
          <Space>
            <TeamOutlined />
            <span>Membership Settings</span>
          </Space>
        </Divider>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card bordered={false}>
            <Form.Item name="membershipType" label="Membership Type">
              <Radio.Group onChange={handleMembershipTypeChange}>
                <Radio.Button value="all">Allow All</Radio.Button>
                <Radio.Button value="limit">Limit Members</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="memberLimit"
              label="Member Limit"
              tooltip={{ 
                title: 'Maximum number of members allowed in this group', 
                icon: <InfoCircleOutlined /> 
              }}
              hidden={allowAll}
            >
              <InputNumber 
                min={1} 
                max={100} 
                disabled={allowAll}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Card>
        </motion.div>

        <Divider orientation="left">
          <Space>
            <TeamOutlined />
            <span>Members ({members.length})</span>
          </Space>
        </Divider>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card 
            bordered={false}
            style={{ marginBottom: 24 }}
            bodyStyle={{ maxHeight: 300, overflow: 'auto', padding: 0 }}
          >
            {members.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={members}
                renderItem={member => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <List.Item
                      actions={[
                        <Popconfirm
                          title="Remove this member?"
                          description="Are you sure you want to remove this member from the group?"
                          onConfirm={() => handleRemoveMember(member.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button 
                            type="text" 
                            danger 
                            icon={<UserDeleteOutlined />}
                            size="small"
                          >
                            Remove
                          </Button>
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={member.avatar} size="large" />}
                        title={
                          <Space>
                            {member.name}
                            {member.isAdmin && (
                              <Tag color="gold" icon={<CrownOutlined />}>
                                Admin
                              </Tag>
                            )}
                            {member.status === 'inactive' && (
                              <Tag color="default">Offline</Tag>
                            )}
                          </Space>
                        }
                        description={`Member since Jan 2023`}
                      />
                    </List.Item>
                  </motion.div>
                )}
              />
            ) : (
              <Empty description="No members in this group" />
            )}
          </Card>
        </motion.div>

        <Divider orientation="left">
          <Space>
            <CrownOutlined />
            <span>Administrators</span>
          </Space>
        </Divider>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card bordered={false}>
            <Space wrap style={{ marginBottom: 16 }}>
              {admins.map(admin => (
                <motion.div
                  key={admin.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'inline-block' }}
                >
                  <Tag
                    color="blue"
                    closable
                    onClose={() => handleRemoveAdmin(admin.id)}
                    style={{ marginRight: 8, marginBottom: 8 }}
                  >
                    <Space>
                      <Avatar src={admin.avatar} size="small" />
                      {admin.name}
                    </Space>
                  </Tag>
                </motion.div>
              ))}
            </Space>

            <Space.Compact style={{ width: '100%' }}>
              <Select
                placeholder="Select a member to make admin"
                style={{ width: '80%' }}
                value={selectedMember}
                onChange={setSelectedMember}
                optionFilterProp="children"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {members
                  .filter(member => !member.isAdmin)
                  .map(member => (
                    <Option key={member.id} value={member.id}>
                      {member.name}
                    </Option>
                  ))}
              </Select>
              <Button 
                type="primary" 
                onClick={handleAddAdmin} 
                disabled={!selectedMember}
                icon={<UserAddOutlined />}
              >
                Add
              </Button>
            </Space.Compact>
          </Card>
        </motion.div>

        <Divider orientation="left">
          <Space>
            <BellOutlined />
            <span>Notifications</span>
          </Space>
        </Divider>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card bordered={false}>
            <Form.Item name="notifications" valuePropName="checked">
              <Switch 
                checkedChildren={<BellFilled />} 
                unCheckedChildren={<BellOutlined />} 
                onChange={setGroupNotifications}
              />
              <Text style={{ marginLeft: 8 }}>
                {groupNotifications ? 'Notifications enabled' : 'Notifications disabled'}
              </Text>
            </Form.Item>
          </Card>
        </motion.div>

        <Divider orientation="left">
          <Space>
            <DeleteOutlined />
            <span>Danger Zone</span>
          </Space>
        </Divider>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card bordered={false} className="danger-zone">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="danger">
                Once you delete a group, there is no going back. Please be certain.
              </Text>
              <Popconfirm
                title="Delete this group?"
                description="All data associated with this group will be permanently deleted. This action cannot be undone."
                onConfirm={handleDeleteGroup}
                okText="Yes, delete group"
                cancelText="Cancel"
                okButtonProps={{ danger: true, loading: loading }}
              >
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                >
                  Delete Group
                </Button>
              </Popconfirm>
            </Space>
          </Card>
        </motion.div>
      </Form>
    </Modal>
  );
};

export default Settingsa;
