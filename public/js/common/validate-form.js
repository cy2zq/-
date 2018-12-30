/*
* 获取字符串长度
* @param s 字符串
* @return len 返回字符串的长度
* */
GetLength = function(s)
{
    var len = 0;
    for(var i=0; i<s.length; i++)
    {
        var c = s.substr(i,1);
        var ts = escape(c);
        if(ts.substring(0,2) == "%u")
        {
            len+=2;
        } else
        {
            len+=1;
        }
    }
    return len;
};

/*
 *长度截取
 * @param input 输入框dom元素
 * @param maxLen 要截取的长度
 * */
function WidthCheck(input, maxLen){
    var w = 0;
    var tempCount = 0;
    //length 获取字数数，不区分汉子和英文
    for (var i=0; i<input.value.length; i++) {
        //charCodeAt()获取字符串中某一个字符的编码
        var c = input.value.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            w++;
        }
        else {
            w+=2;
        }
        if (w > maxLen) {
            input.value = input.value.substr(0,i);
            break;
        }
    }
}

/*
 *设置错误提示
 * */
function addErrMsg($dom, errMsg) {
    $dom.after('<span class="errMsg">'+errMsg+'</span>');
    setTimeout(function () {
        $dom.next('.errMsg').fadeOut(4000);
    }, 4000);
    setTimeout(function () {
        $dom.next('.errMsg').remove();
    }, 4000);
}

/*
* 验证规则
* 要添加规则，使用Strategies.(strategy.name) = function(inputValue, strategyValue1,strategyValue2 , errMsg)
* */
var Strategies = {
    isNonEmpty: function (value, errMsg) {//不能为空
        if (value === ''||value.match(/^\s+$/g)){
            return errMsg ;
        }
    },
    minLen: function (value, len, errMsg) {//最小长度
        if (GetLength(value) < len){
            return errMsg;
        }
    },
    maxLen: function (value, len, errMsg) {//最大长度
        var that = this;
        WidthCheck(this,len);
        if (GetLength(value)>len){
            addErrMsg($(that), '已达到可输入上限');
            return errMsg;
        }
    },
    posInt: function (value, errMsg) {//正整数
        var that = this;
        if (value != ''){
            if (!(/^\d+$/.test(value))){
                addErrMsg($(that), '请输入正整数');
                return errMsg;
            }
        }
    },
    negInt: function (value, errMsg) {//负整数
        var that = this;
        if (value != ''){
            if (!(/^-\d+$/.test(value))){
                addErrMsg($(that), '请输入负整数');
                return errMsg;
            }
        }
    },
    integer: function (value, errMsg) {//整数
        var that = this;
        if (value != ''){
            if (!(/^-?\d+$/.test(value))){
                addErrMsg($(that), '请输入整数');
                return errMsg;
            }
        }
    },
    posNum: function (value, errMsg) {//正数
        var that = this;
        if (!(/^\d*\.?\d+$/.test(value))){
            addErrMsg($(that), '请输入正数');
            return errMsg;
        }
    },
    negNum: function (value, errMsg) {//负数
        var that = this;
        if (value != ''){
            if (!(/^-\d*\.?\d+$/.test(value))){
                addErrMsg($(that), '请输入负数');
                return errMsg;
            }
        }
    },
    num: function (value, errMsg) {//数字
        var that = this;
        if (value != ''){
            if (!(/^[0-9]*$/.test(value))){
                addErrMsg($(that), '只允许输入数字');
                that.value = that.value.replace(/\D/g,'');
                return errMsg;
            }
        }
    },
    float:function (value, length, precision, errMsg) {
        var addLen = 0;
        var that = this;
        var fa='';
        var reg = new RegExp('^\\d{0,'+(length-precision)+'}\\.\\d{0,'+precision+'}$');
        var reg2 = new RegExp('^\\d{0,'+(length-precision)+'}$');
        if(that.value.substring(0,1) === '-'){
            fa='-';
        }
        var str=(that.value.replace(/[^0-9.]/g,'')).replace(/[.][0-9]*[.]/, '.');
        if (str.substring(0,1)==='.'){
            str='0'+str;
        }
        that.value=fa+str;

        if (that.value.indexOf('-')==0){
            addLen = 1;
        }else {
            addLen = 0;
        }

        if (GetLength(that.value.split('.')[0])>(length-precision+addLen)){
            WidthCheck(that,(length - precision+addLen));
            addErrMsg($(that), '小数点前最多'+(length-precision)+'位！');
            return '小数点前最多'+(length-precision)+'位！';
        }
        if (str.split('.')[1]){
            if (str.split('.')[1].length > precision ){
                var temp = that.value.split('.');
                that.value = temp[0]+'.'+temp[1].substr(0,precision);
                addErrMsg($(that), '最多'+precision+'位小数！');
                return '最多'+precision+'位小数！';
            }
        }
    },
    isDate:function (value, errMsg) {
        var timeReg = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
            dateReg = /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
            dateTimeReg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        if (value !== ''){
            var isDate = false;
            if (timeReg.test(value)||dateReg.test(value)||dateTimeReg.test(value)){
                isDate = true;
            }
            if (isDate === false){
                return errMsg;
            }
        }
    },
    email: function (value, errMsg) {//邮箱
        if (value != ''){
            if (!(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value))){
                return errMsg;
            }
        }
    },
    mobile: function (value, errMsg) {//手机号
        if (value != ''){
            if (!(/^(\d{2,3}\-)?(1[3|4|5|8][0-9]\d{8})$/.test(value))){
                return errMsg;
            }
        }
    },
    landline: function (value, errMsg) {//座机
        if (value != ''){
            if (!(/^0\d{2,3}-[1-9]\d{6,7}$/.test(value))){
                return errMsg;
            }
        }
    },
    phoneNum: function (value, errMsg) {//联系方式（固话、传真）
        if (value !=''){
            if (!/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(value)){
                return errMsg;
            }
        }
    },
    zipCode: function (value, errMsg) {//邮编
        if (value != ''){
            if (!(/^[1-9][0-9]{5}$/.test(value))){
                return errMsg;
            }
        }
    },
    idCard: function (value, errMsg) {//身份证
        if (value != ''){
            if (!(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value))){
                return errMsg;
            }
        }
    },
    qq: function (value, errMsg) {//qq
        if (value != ''){
            if (!(/^[1-9][0-9]{4,9}$/.test(value))){
                return errMsg;
            }
        }
    },
    weChat: function (value, errMsg) {//微信号
        if (value != ''){
            if (!(/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(value))){
                return errMsg;
            }
        }
    },
    zh: function (value, errMsg) {//汉字
        var that = this;
        if (value != ''){
            if (!(/^[\u4e00-\u9fa5]*$/.test(value))){
                addErrMsg($(that), '只能输入汉字');
                that.value = that.value.replace(/[^\u4E00-\u9FA5]/g,'');
                return errMsg;
            }
        }
    },
    uppLet: function (value, errMsg) {//大写字母
        var that = this;
        if (value != ''){
            if (!( /^[A-Z]+$/.test(value))){
                addErrMsg($(that), '请输入大写字母');
                return errMsg;
            }
        }
    },
    lowLet: function (value, errMsg) {//小写字母
        var that = this;
        if (value != ''){
            if (!(/^[a-z]+$/.test(value))){
                addErrMsg($(that), '请输入小写字母');
                return errMsg;
            }
        }
    },
    letter: function (value, errMsg) {//字母
        var that = this;
        if (value != ''){
            if (!( /^[a-zA-Z]+$/.test(value))){
                addErrMsg($(that), '请输入字母');
                return errMsg;
            }
        }
    },
    maxVal: function (value,maxval, errMsg) {//最大值
        if (value!==''){
            if (Number(value) > Number(maxval)){
                return errMsg;
            }
        }
    },
    minVal: function (value, minVal, errMsg) {//最小值
        if (value!==''){
            if (Number(value) < Number(minVal)){
                return errMsg;
            }
        }
    }
};




/*
* 验证类实现
* */
var Validator = function () {
    this.cache = [];
};

Validator.prototype.add = function (dom, rules) {
    var self = this;
    for (var i = 0, rule; rule = rules[i++];){
        (function (rule) {
            var strategyAry = rule.rule.split(':');
            var errorMsg = rule.errMsg;
            self.cache.push(function () {
                var strategy = strategyAry.shift();
                strategyAry.unshift(dom.value);
                strategyAry.push(errorMsg);
                return Strategies[strategy].apply(dom, strategyAry);
            });
        })(rule);
    }
};

Validator.prototype.start = function () {
    for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];){
        var msg = validatorFunc();
        if (msg){
            return msg;
        }
    }
};

/*
* keyup时验证
* */
function onKeyUp($thisInput) {
    var validator = new Validator();
    var str = $thisInput.get(0).getAttribute('data-rules');
    var jsonObj = eval('('+str+')');
    validator.add($thisInput.get(0), jsonObj);
    validator.start();
    return false;
}

/*
* 验证当前输入表单
* */
function validateFunc($thisInput, oldData) {
    var validator = new Validator();
    var str = $thisInput.get(0).getAttribute('data-rules');
    var jsonObj = eval('('+str+')');
    validator.add($thisInput.get(0), jsonObj);

    var errMsg = validator.start();
    if(errMsg){
        addErrMsg($thisInput, errMsg);
    }
    return false;
}

/*
* 提交表单时验证
* */
var validateOnSubmit = function (selectors, oldData) {
    var isClass = selectors.indexOf('.'),
        isId = selectors.indexOf('#');
    var selector;
    if (isClass === 0){
        selector = selectors + ' .needValidate';
    }else if (isId === 0){
        selector = '#' + selectors + ' .needValidate';
    }else {
        selector = '#' + selectors + ' .needValidate';
    }

    var $inputs = $(selector); //获取需要验证的input jquery对象数组
    for (var i = 0; i<$inputs.length; i++){
        if($($inputs[i]).is(':hidden')){
            $inputs.splice(i, 1);
            i= i-1;
        }
    }

    var errors = [];
    var result = false;
    if ($inputs.length > 0){
        for (var k = 0; k<$inputs.length; k++){
            var validatorAno = new Validator();
            var str = $inputs.get(k).getAttribute('data-rules');
            var jsonObj = eval('('+str+')');
            if (oldData){
                if (oldData[$inputs.get(k).getAttribute('name')] != $($inputs.get(k)).val()){
                    validatorAno.add($inputs.get(k), jsonObj );
                }
            }else {
                validatorAno.add($inputs.get(k), jsonObj );
            }
            var errMsg = validatorAno.start();
            var returnData = {
                msg:null,
                flag:null,
                i:null
            };
            if (errMsg){
                returnData.msg = errMsg;
                returnData.flag = true;
            }else {
                returnData.flag = false;
            }
            returnData.i = k;
            errors.push(returnData);
        }
        for (var j = 0; j< $inputs.length; j++){
            if (errors[j].flag == true){
                result = true;
            }
        }
    }
    if (result){
        errors.map(function (item) {
            if (item.flag){
                addErrMsg($($inputs[item.i]), item.msg);
            }
        });
        return true;
    }
};






