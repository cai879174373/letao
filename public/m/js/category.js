

$(function(){

    // 发送ajax请求 请求分页数据
    $.ajax({
        beforeSend: function () {
            //ajax请求之前
            $('#main .mask').show();
                     },
        complete: function () {
                    //ajax请求完成，不管成功失败
             $('#main .mask').hide();
            },             
        url:'/category/queryTopCategory',
        success:function(data){
            console.log(data);
            
            //调用模板引擎
            var html=template('categoryLeftTpl',data);
            // 渲染到页面上
            $('.category-left ul').html(html);

            qureySecondCategory(1);
        }
    });
     
    // 用zepto里面的tap点击事件 解决了点击延迟效果
    // 动态添加的需要用事件委托注册
    var oldId=0;
    $('.category-left ul').on('tap','li',function(){
        // li标签点击变颜色
        $(this).addClass('active').siblings().removeClass('active');
        // zepto里的data方法 去除data-id的值
        var id=$(this).data('id');
       if(oldId==id){
           return false;
       }
        
        console.log(id);
        qureySecondCategory(id);
        oldId=id;
     
    })
    function qureySecondCategory(id){
        $.ajax({
            beforeSend: function () {
                //ajax请求之前
                $('#main .mask').show();
                         },
            complete: function () {
                        //ajax请求完成，不管成功失败
                 $('#main .mask').hide();
                },           
            url:'/category/querySecondCategory',
            data:{id:id},
            success:function(data){
                console.log(data);
                //调用模板 渲染到页面
                var html=template('categoryRightTpl',data);
                $('.category-right .mui-row').html(html);
            }
        });
    };

    // 调用mui区域滚动的初始化方法
    mui('.mui-scroll-wrapper').scroll({
        indicators: false,
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
});