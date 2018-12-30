var mongoose=require('mongoose');
//用户的表结构
module.exports=new mongoose.Schema({
    name:String, //部门名称
    title:String,//职称
    birth:String, //生日
    sex:String,//性别
    speciality:String,//专科专家号
    phone:String, //电话号码
    email:String, //电子邮件
    // address:String, //员工住址
    website:String, //员工博客地址
});