// 应用程序的启动入口文件
//加载express模块
var express=require('express');
// 创建APP应用 等价于 NodeJs HTTP .createServer();
var app=express();
//设置静态文件托管
//当用户访问的URL以/public开始，那么直接返回对应__dirname+'/public'下的文件
app.use('/public',express.static(__dirname+'/public'));
/*模板：前后端分离
1--var swig=require('swig')加载模板引擎
2--app.engine('html',swig.renderFile);配置应用模板
     html指的是模板名称，同时也是模板文件后缀；--所以不可随意更改
     swig.renderFilde指的是用于解析处理模板 内容的方法（swig对象下的方法）
3--app.set('views','./views');设置模板文件存放目录，-----这里是./views
4--app.set('view engine','html');注册所使用的模板引擎
 */
var swig=require('swig');
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');
//在开发过程中需要    取消模板缓存（就是指改了HTML页面，不需要重启服务器，默认是true）
swig.setDefaults({cache:false});

/*路由绑定
通过app.get()或者app.post()等方法把URL和函数进行绑定
app.get('/',function (req,res,next) {
   req:request对象-保存客户端请求数据---http.request
   res:response对象-服务端输出对象---http.response
   next:方法，用于执行下一个与路径匹配的函数
});

内容输出
通过res.send(string)发送内容至客户端
 */
app.get('/',function (req,res,next) {
    // res.send('欢迎光临');
    res.render('index');//读取views目录下的文件，解析并返回给客户端
});
//css处理---若没效果，清除下缓存
// app.get('/main.css',function (req,res,next) {
//     res.setHeader('content-type','text/css');//因为默认是HTML
//     res.send("body{background:red;}");
// });
//加载body-parser
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
/*划分模块

 */
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/main',require('./routers/main'));

//加载数据库模块并连接数据库
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/',function (err) {
   if( err){
       console.log('fail');
   } else {
       console.log('ok');//链接数据库成功
       // 监听http请求
       app.listen(8081);
   }
});



//用户发送http请求-》URL-》解析路由-》找到匹配的规则-》执行指定绑定函数-》返回对应内容给用户
//public->静态-》url->直接读取指定目录下的文件，返回给用户
//动态-》处理业务逻辑，加载模板，解析模板-》返回给用户