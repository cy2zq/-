/*
 * 这是启动程序的入口
 * Create by cy on 2018/8/30
 * */

var express=require('express');
var app=express();
var User=require('./models/user');

var Cookies=require('cookies');
app.use(function (req,res,next) {
    req.cookies=new Cookies(req,res);
    req.uerInfo={};
    if(req.cookies.get('userInfo')){
        try {
            req.userInfo=JSON.parse(req.cookies.get('userInfo'))
            User.findById(req.uerInfo._id).then(function (req,res,next) {
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin);

            })
        }catch(e){}
    }
    next();
});

var bodyParser=require('body-parser');//加载body-parser 用于post处理如url
app.use(bodyParser.urlencoded({
    extended:true
}));

var swig=require('swig');//模板，行为表现分离
app.engine('html',swig.renderFile);//设置模板引擎
app.set('views','./views');//配置模板目录
app.set('view engine','html');//注册模板

// 在开发过程中需要取消模板缓存就是指改了HTML页面，不需要重启服务
swig.setDefaults({
    cache:false
});
app.use('/public',express.static(__dirname+'/public'))
// 上面为单独使用css静态托管
app.use('/admin',require('./routers/admin'));
app.use('/',require('./routers/main'));
app.use('/api',require('./routers/api'));

// 链接数据库
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27018',function (err) {
    if(err){

    }else{
        app.listen(8083);//设置监听
    }
})