$(function () {
    // 封装获取路径的函数
    var proName = "";

    // 执行查找函数
    qureyProduct();
    sortProduct();
    searchProduct();
    pullrefresh();
    gotoDetail();

    var time = getQureyUrl('time');

    function getQureyUrl(name) {
        // 获取当前页面的url
        var pagepath = location.search.substr(1).split('&');
        // console.log(pagepath);
        // 遍历数组  去除search的值
        for (var i = 0; i < pagepath.length; i++) {
            if (pagepath[i].split('=')[0] == name) {
                return decodeURI(pagepath[i].split('=')[1]);
            }
        }
    }

    // 封装搜索商品的函数
    function qureyProduct() {
        proName = getQureyUrl('search');
        // console.log(proName);
        // console.log(search);
        // 发送ajax请求  拿到数据
        $.ajax({
            url: '/product/queryProduct',
            data: {
                page: 1,
                pageSize: 4,
                proName: proName
            },
            success: function (res) {
                console.log(res);
                // 调用模板
                var html = template('productTpl', res);
                // console.log(html);
                $('.product-content .mui-row').html(html);
            }
        })
    }
    //封装升降序函数
    function sortProduct(){
        proName = getQureyUrl('search');
        // 给每个a标签注册点击事件事件
        $('.product-content .mui-card-header a').on('tap',function(){
            // console.log($(this));
            $(this).addClass('active').siblings().removeClass('active');
            var sort=$(this).data('sort');//获取自定义的sort值
            console.log(sort);
            if(sort==2){
                sort=1;
                $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
            }else{
                sort=2;
                $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
            $(this).data('sort',sort);
            var type=$(this).data('type');//获取自定义的type属性值
            var obj={  page: 1,
                pageSize: 4,
                proName: proName,
            }
            obj[type]=sort;

            // 发送ajax请求 重新渲染页面
            $.ajax({
                url: '/product/queryProduct',
                data: obj,
                success: function (res) {
                    console.log(res);
                    // 调用模板
                    var html = template('productTpl', res);
                    // console.log(html);
                    $('.product-content .mui-row').html(html);
                }
            })



        })
    }

    // 封装搜索产品函数
    function searchProduct(){
        $('.btn-search').on('tap', function () {
            var search = $('.btn-input').val().trim();
            console.log(search);
            if (search == '') {
                mui.toast('请输入合法内容!', {
                    duration: 'long',
                    type: 'div'
                })
                return false;
            }
            // 获取当前浏览器保存的历史信息
            var searchHistory = localStorage.getItem('searchHistory');
            // 获取的值转换成数组
            searchHistory = JSON.parse(searchHistory) || [];

            // !!!!!把搜索内容添加到数组中 重复的内容不能添加  遍历数组

            for (var i = 0; i < searchHistory.length; i++) {
                if (searchHistory[i].key == search) {
                    searchHistory.splice(i, 1);
                    // 每删除一个就是i--一次
                    i--;
                }
            }
            searchHistory.unshift({
                key: search,
                time: new Date().getTime()
            })
            //  把数组的内容添加到浏览器里面
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

            // 调用查询函数  把数据渲染到页面上
            // 清空输入框内容
            $('.btn-input').val('');


            location="productlist.html?search="+search+"&time="+new Date().getTime();

        })
    }

    // 封装上拉和下拉函数
    function pullrefresh(){
        
			mui.init({
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						callback: pulldownRefresh
					},
					up: {
						// contentrefresh: '正在加载...',
						callback: pullupRefresh
					}
				}
			});
			/**
			 * 下拉刷新具体业务实现
			 */
			function pulldownRefresh() {
				setTimeout(function() {

					qureyProduct();
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				}, 1000);
			}
			var page =1 ;
			/**
			 * 上拉加载具体业务实现
			 */
			function pullupRefresh() {
				setTimeout(function() {
                    $.ajax({
                        url: '/product/queryProduct',
                        data: {
                            proName: proName,
                            // 定义一个变量page存储了当前页码数 请求下一页让page进行++ 要前自增
                            page: ++page,
                            pageSize: 4
                        },
                        success: function (res) {
                            console.log(res);
                            // 7. 判断如果数据已经没有长度 表示没有数据 不需要调用模板和追加 直接提示没有数据了
                            if (res.data.length > 0) {
                                // 8.1 调用模板生成商品列表结构
                                var html = template('productTpl', res);
                                // console.log(html);
                                // 8.2 请求了更多数据下一页 追加到页面 append函数
                                $('.product-content .mui-row').append(html);
                                // 8.3 数据追加完毕要结束转圈圈 注意这个函数是up不是down
                                mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                            } else {
                                // 9. 没有数据 结束转圈圈 并且提示没有数据了
                                mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                            }
                        }
                    })
				}, 1000);
			}
	
    }
     // 封装一个立即购买的函数
     function gotoDetail(){
        //  注册点击事件
        
        $('.product-content .mui-row ').on('tap','.mui-btn',function(){
            console.log(this);
            //  获取点击按钮的属性id值
            var id=$(this).data('id');
            //跳转到detail页面
            location="detail.html?id="+id;
        });
    };


})