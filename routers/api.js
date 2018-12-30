var express=require('express');
var router=express.Router();

var User=require('../models/user');//一个user的构造函数，new user（）
var Doctor=require('../models/doctor');
var Patient=require('../models/patient');
var responseData,result;//统一返回格式
router.use(function (req,res,next) {
    responseData={
        code:0,
        message:''
    };
    result=[];
    next();
});
/*
用户注册
注册逻辑
1---用户名,密码不为空
2---两次输入的密码必须一致
3---用户名是否已经被使用（注册）--数据库查询
 */
router.post('/user/register',function (req,res,next) {
    var username=req.body.username;
    var password=req.body.password;
    var repassword=req.body.repassword;
    if( username === ''){ //用户名是否为空
        responseData.code=1;
        responseData.message='用户名不能为空';
        res.json(responseData);
        return;
    }
    if(password===''){ //密码是否为空
        responseData.code=2;
        responseData.message='密码不能为空';
        res.json(responseData);
        return;
    }
    if(password!==repassword){  //两次密码是否一致
        responseData.code=3;
        responseData.message='两次密码不一致';
        res.json(responseData);
        return;
    }

    User.findOne({//需要进行数据库查询是否已经存在该用户
        username:username
    }).then(function (userInfo) {
        if(userInfo){  //表示数据库有过记录
            responseData.code=4;
            responseData.message='用户已被注册';
            res.json(responseData);
            return Promise.reject();
        }
            var user=new User({//保存用户信息到数据库中,使用构造函数
                username:username,
                password:password
            });
            return user.save();
    }).then(function (newUserInfo) {
        responseData.message='注册成功';
        res.json(responseData);
    });
});
// 登录的路由
router.post('/user/test',function (req,res,next) {
    User.find().then(function (userInfo) {
            responseData.code=4;
            responseData.message=userInfo;
            res.json(responseData);
           return;
    });
});
router.post('/user/login',function (req,res,next) {
    var username=req.body.username;
    var password=req.body.password;
    if(username == ''||password==''){
        responseData.code=1;
        responseData.message='用户名和密码不能为空';
        res.json(responseData);
        return;
    }

    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code=2;
            responseData.message='用户名和密码错误';
            res.json(responseData);
            return;
        }
        responseData.code=3;
        responseData.message='登录成功';

        responseData.userInfo={
            id:userInfo._id,
            username:userInfo.username,
            isAdmin:userInfo.isAdmin
        };

        req.cookies.set('userInfo',JSON.stringify({
            id:userInfo._id,
            username:userInfo.username,
            isAdmin:userInfo.isAdmin
        }));
        res.json(responseData);
    })
});
//退出
router.get('/user/logout',function (req,res,next) {
       req.cookies.set('userInfo',null);//清除cookie
       res.json(responseData);
});

router.get('/doctor/doctors',function (req,res,next) {
    Doctor.find().then(function (doctor) {
        result=doctor;
        res.json(result);
    })
});
router.get('/doctor/patients',function (req,res,next) {
    Patient.find().then(function (patient) {
        result=patient;
        res.json(result);
    })
});


module.exports=router;