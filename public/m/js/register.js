$(function(){
    // 1.给注册按钮点击事件注册点击
    //2, 判断是否为空
    //3.判断是否合法
    //4,发送请求完成注册  跳转到登陆页面  
var vCode='';

    // 执行注册函数
    register();

    // 执行获取验证码函数
    getVcode();
    // 封装一个注册函数

    function register(){

        $('.btn-register').on('tap',function(){
            // 获取所有的表单元素
            var inputs=$('#main input');
            console.log(inputs);
            // 遍历数组 判断内容是否为空
            var isSwitch=true;
            inputs.each(function(){
                if(this.value.trim()==''){
                    // 如果为空提示用户
                    mui.toast(this.placeholder,{ duration:1000, type:'div' }) 
                    // 进到这里把开关改成false
                    isSwitch=false;
                    return false;
                }
            });
            // 如果还为正确 执行下面的代码
            if(isSwitch){
                var mobile=$('#main .mobile').val();
                console.log(mobile);
                var username=$('#main .username').val();
                var password1=$('#main .password1').val();
                var password2=$('#main .password2').val();
                var VCode=$('#main .vCode').val();
                
                if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(mobile)) {
                    mui.toast("手机号码不合法",{ duration:1000, type:'div' }) 
                    return false;
                }
                if(!/^[A-Za-z0-9]{6,12}$/.test(username)){
                    // 判断用户名是否合法
                    mui.toast("用户名不合法,必须为6-12为字母或者数字",{ duration:1000, type:'div' }) 
                    return false;
                }
                if(password1!=password2){
                    mui.toast("二次密码输入不同",{ duration:1000, type:'div' }) 
                    return false;
                }
                if(VCode!=vCode){
                    mui.toast("验证码输入不对",{ duration:1000, type:'div' })
                    return false;
                }

                // 发送请求 提交注册信息
                $.ajax({
                    url:'/user/register',
                    type:'post',
                    data:{username:username,password:password1,mobile:mobile,vCode:VCode},
                    success:function(data){
                        console.log(data);
                        if(data.error){
                            mui.toast(data.message,{ duration:1000, type:'div' }) 
                        }else{
                            location="login.html?returnUrl=user.html"
                        }
                    }
                })

            }

            
        })

    }

    // 封装一个获取验证码的函数
    function getVcode(){
        $('.btn-vcode').on('tap',function(){
            // 发送ajax请求
            $.ajax({
                url:'/user/vCode',
                success:function(data){
                    // console.log(data);
                    
                        vCode=data.vCode;
                        console.log(vCode);
                    
                }
            })
        })
    }
})