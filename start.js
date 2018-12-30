// 启动程序的入口文件
var express=require('express');// 首先要加载express模块
var app=express();//创建服务器，类似于http.createServer();
var User=require('./models/user');//一个user的构造函数，new user（）

var Cookies=require('cookies');
app.use(function (req,res,next) {
   req.cookies=new Cookies(req,res);
    // console.log('9start'+req.cookies.get('userInfo'));//是String类型
    // console.log(req.cookies.get('userInfo'));
    req.userInfo={};//把属性赋给req对象
    if(req.cookies.get('userInfo')){//解析登录用户的cookie信息
        try {
            req.userInfo=JSON.parse(req.cookies.get('userInfo'));
            //获取当前用户信息，是不是管理员
            // User.findById(req.userInfo._id).then(function (userInfo) {
            //     // req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
            //     console.log(userInfo)
            // })
        }catch (e){}
    }
next();//
});

var bodyParser=require('body-parser');//加载body-parser,处理post数据，如url
app.use(bodyParser.urlencoded({extended:true}));

var swig=require('swig');//使用模板，行为表现分离，把HTML拿出来
app.engine('html',swig.renderFile);//设置模板引擎
app.set('views','./views');//配置模板目录
app.set('view engine','html');//注册模板
//在开发过程中需要    取消模板缓存（就是指改了HTML页面，不需要重启服务器，默认是true）
swig.setDefaults({cache:false});
app.use('/public',express.static(__dirname+'/public'));//想单独使用css静态托管

app.use('/admin',require('./routers/admin'));
app.use('/',require('./routers/main'));
app.use('/api',require('./routers/api'));

// 链接数据库
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27018',function (err) {
    if(err){
    }else{
        //设置监听
        app.listen(8082);
    }
});
