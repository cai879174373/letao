var totalpage = 0;
var page = 1;
$(function () {
    // 执行查询函数
    queryUser();

    addSecondcategory();


    // 封装一个查询函数
    function queryUser() {
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            data: {
                page: page,
                pageSize: 5
            },
            success: function (data) {
                console.log(data);
                // 调用模板
                var html = template('ueryUserUrl', data);
                //添加到页面上
                $('#main .content tbody').html(html);
                totalpage = Math.ceil(data.total / data.size);
                // console.log(totalpage);
                // 执行分页函数
                initPage();

            }
        })
    }



    // 封装一个分页函数
    function initPage() {
        $(function () {
            // var currentPage = 1;
            // var totalPages = 25;
            $(".pagination").bootstrapPaginator({
                bootstrapMajorVersion: 3, //对应的bootstrap版本
                currentPage: page, //当前页数
                numberOfPages: 3, //每次显示页数
                totalPages: totalpage, //总页数
                shouldShowPage: true, //是否显示该按钮
                useBootstrapTooltip: true,
                //点击事件
                onPageClicked: function (event, originalEvent, type, nowpage) {
                    page = nowpage;
                    queryUser();

                }
            });

        });

    }

    // 封装一个添加品牌的函数
    function addSecondcategory() {
        $('.btn-add').on('click', function () {
            //查询所有分类
            $.ajax({
                url: '/category/queryTopCategory',
                success: function (data) {
                    console.log(data);
                    // 调用模板渲染到页面上
                    var html = '';
                    for (var i = 0; i < data.rows.length; i++) {
                        html += '<option value="' + data.rows[i].id + '">' + data.rows[i].categoryName + '</option>';
                    }
                    $('.brand-name').html(html);
                }
            })
        });
        // 选择图片预览 所以放在外面
        var file=null;
        // 给选择文件按钮一个change事件
        $('.btn-file').on('change',function(){

            if(this.files[0].length<0){
                return false;
            }
            // console.dir(this);
            file=this.files[0];
            // console.log(file);
            // 创建临时路径
            var url = window.URL.createObjectURL(file);
            $('.brand-img').attr('src',url);

        })

        // 给保存按钮一个点击事件

        $('.btn-save').on('click', function () {
            
            //当图片上传成功后获取当前分类id 品牌名称 品牌logo 一起调用添加二级分类的API去添加品牌
            var categoryId = $('.brand-name').val();
            console.log(categoryId);
            var brandName = $('.btn-category').val().trim();
            if(brandName==''){
                alert('请输入品牌名称');
                return false;
            }
            console.log(brandName);
            // 3.3 获取当前要上传的图片文件 调用后台图片上传的接口传给后台
            // 如果当前没有选择图片就无法上传后面代码就不执行了
            if (file == null) {
                return false;
            }

            // 3.4 调用接口把当前图片传递给API
            // 由于当前后台接口需要的数据是POST  enctype="multipart/form-data"
            // 需要post提交是表单类型数据不是普通对象（要求表单数据对象）
            // 就要把图片转成表单数据对象
            // 3.5 创建一个表单数据对象
            var formData = new FormData();
            // console.log(formData);
            // 3.7 把我们的图片append到formData对象上
            // append函数的第一个参数添加键 之前data{pic11} pic1键 第二个参数就是值 当前file文件
            formData.append('pic1', file)
            // 3.8 调用ajax指定当前参数就是formData对象
            $.ajax({
                url: '/category/addSecondCategoryPic',
                type: 'post',
                data: formData,
                // 3.9 把ajax默认处理数据禁止 不要当前普通对象去处理
                processData: false,
                // 3.10 请求报文的类型不要设置   
                contentType: false,
                // 3.11 取消异步
                async: false,
                // 3.12 取消缓存
                cache:false,
                success: function (data) {
                    console.log(data);
                    // 3.12 如果后台返回了对象里面有picAddr表示图片上传成功
                    if (data.picAddr) {
                        // 3.13 获取当前上传成功的真正的图片地址
                        var brandLogo = data.picAddr;
                        // 3.14 调用添加品牌的请求
                        $.ajax({
                            url: '/category/addSecondCategory',
                            type: 'post',
                            data: {
                                categoryId: categoryId,
                                brandName: brandName,
                                brandLogo: brandLogo,
                                hot: 1
                            },
                            success: function (data) {
                                // 3.15 如果返回成功调用查询二级分类列表刷新页面
                                if(data.success){
                                    queryUser();
                                }
                            }
                        })
                    }
                }
            })
        });
    }
});