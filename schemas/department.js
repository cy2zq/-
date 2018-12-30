var mongoose=require('mongoose');
//用户的表结构
module.exports=new mongoose.Schema({
    deptName:String, //部门名称
    deptDescription:String //部门描述
});