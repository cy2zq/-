var mongoose=require('mongoose');
//用户的表结构
module.exports=new mongoose.Schema({
    department:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Department'
    },
    name:String, //员工姓名
    age:Number, //员工年龄
    sex:String, //员工性别
    phone:String, //电话号码
    email:String, //电子邮件
    address:String, //员工住址
    username:String, //员工账号
    password:String//员工密码
});