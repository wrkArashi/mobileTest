import axios from 'axios';
// 登陆
let login = (data) => axios.get('/api/OEP/Login', { params: data });
// 获取用户个人信息
let userInfo = (data) => axios.get('/api/OEP/UserInfo', { params: data });
// 用户列表
let userList = (data) => axios.get('/api/OEP/UserList', { params: data });
// 获取考试列表
let examList = (data) => axios.get('/api/OEP/ExamList', { params: data });
// 获取单个题目
let getQu = (data) => axios.get('/api/OEP/GetQu', { params: data });
// 获取题库所有题目
let getQuList = (data) => axios.get('/api/OEP/GetQuList', { params: data });
// 历史考试详情
let postInfoItems = (data) => axios.get('/api/OEP/PastInfoItems', { params: data });
// 历史考试列表
let postInfoList = (data) => axios.get('/api/OEP/PastInfoList', { params: data });
// 获取记录表
let pAEnList = (data) => axios.get('/api/OEP/PAEnList', { params: data });
// 详细记录
let pAEnItem = (data) => axios.get('/api/OEP/PAEnItem', { params: data });
// 权限组列表
let groupList = (data) => axios.get('/api/OEP/GroupList', { params: data });
// 角色列表
let roleList = (data) => axios.get('/api/OEP/RoleList', { params: data });
// 增加用户
let addUser = (data) => axios.post('/api/OEP/AddUser', data);
// 增加题目
let addQus = (data) => axios.post('/api/OEP/AddQus', data);
// 开始考试
let begin = (data) => axios.post('/api/OEP/Begin', data);
// 提交考试
let end = (data) => axios.post('/api/OEP/End', data);
// 预约考试
let order = (data) => axios.post('/api/OEP/Order', data);
//增加记录表
let addPA = (data) => axios.post('/api/OEP/AddPA', data);
// 添加权限组/角色
let addGroup = (data) => axios.post('/api/OEP/AddGroup', data);
// 删除题目
let delQus = (data) => axios.delete('/api/OEP/DelQus', { params: data });
// 删除记录
let delPA = (data) => axios.delete('/api/OEP/DelPA', { params: data });
// 修改用户
let chgUser = (data) => axios.put('/api/OEP/ChgUser', data);
// 修改题目
let chgQus = (data) => axios.put('/api/OEP/ChgQus', data);
// 修改密码
let chgPwd = (data) => axios.put('/api/OEP/ChgPwd', data);
// 修改记录
let chgPA = (data) => axios.put('/api/OEP/ChgPA', data);
// 修改权限组/角色
let chgGroup = (data) => axios.put('/api/OEP/ChgGroup', data);

export default {
	login,
	userInfo,
	userList,
	examList,
	getQu,
	getQuList,
	postInfoItems,
	postInfoList,
	pAEnList,
	pAEnItem,
	groupList,
	roleList,
	addUser,
	addQus,
	begin,
	end,
	order,
	addPA,
	addGroup,
	delQus,
	delPA,
	chgUser,
	chgQus,
	chgPwd,
	chgPA,
	chgGroup
}
