/*
 * 描述 @医生站
 * Create by cy on 2018/10/18
 * */

window.onload=function () {
    $.ajax({
        url:'/api/doctor/patients',
        dataType:'json',
        success:function (result) {
            for(var i in result){
//                    console.log(result[i]);
            }
        }
    });
    /**
     * 用ajax拿到数据库表
     * @cy
     */

    $.ajax({
        url:'/api/doctor/doctors',
        dataType:'json',
        success:function (result) {
            for(var x=0;x<=result.length-1;x++){
//                    console.log(result[x]);
                if(typeof(result[x]!=='') ){
                    var element=
                        '            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">\n' +
                        '                <div class="card">\n' +
                        '                    <div class="body">\n' +
                        '                        <div class="member-card">\n' +
                        '                            <div class="thumb-xl member-thumb">\n' +
                        '                                <img src="/public/assets/images/random-avatar4.jpg" class="img-thumbnail rounded-circle" alt="profile-image">\n' +
                        '\n' +
                        '                            </div>\n' +
                        '\n' +
                        '                            <div class="">\n' +
                        '                                <h4 class="m-b-5 m-t-20">'+result[x].name+'</h4>\n' +
                        '                                <p class="text-muted">'+result[x].title+'<span> <a href="#" class="text-pink">websitename.com</a> </span></p>\n' +
                        '                            </div>\n' +
                        '\n' +
                        '                            <p class="text-muted">'+result[x].phone+'</p>\n' +
                        '                            <a href="/admin/doctor/profile?id={{doctor._id.toString()}}"  class="btn btn-raised btn-sm">查看详细资料</a>\n' +
                        '                            <ul class="social-links list-inline m-t-10">\n' +
                        '                                <li><a title="facebook" href="#"><i class="zmdi zmdi-facebook"></i></a></li>\n' +
                        '                                <li><a title="twitter" href="#" ><i class="zmdi zmdi-twitter"></i></a></li>\n' +
                        '                                <li><a title="instagram" href="" ><i class="zmdi zmdi-instagram"></i></a></li>\n' +
                        '\n' +
                        '                                <li><a title="instagram" href="/admin/doctor/edit?id={{doctor._id.toString()}}" ><i class="zmdi zmdi-edit"></i></a></li>\n' +
                        '                                <li><a title="instagram" href="/admin/doctor/delete?id={{doctor._id.toString()}}" ><i class="zmdi zmdi-delete"></i></a></li>\n' +
                        '                            </ul>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '            </div>\n';
                }
                $('#doctorList').append(element);
            }
        }
    });
    var arr =
        {
            _id: "5b41bae458c7b42a883bd3b1", name: "张三", phone: "5211314", sex: "", email: "2279679717@qq.com"
        }
    ;

    $(function () {
        $('#doctorList').addList(arr);
    });
    $.prototype.addList=function (arr) {

    }
}
