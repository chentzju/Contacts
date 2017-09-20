var myApp = angular.module("myApp",['ngMaterial','ngAria','ngAnimate'])
    .controller("ManCtrl",["$scope","ManService","$filter",'$timeout','$window',function ($scope,ManService,$filter,$timeout,$window) {

        //更改详情页在iPhone端兼容样式
        var con = document.getElementsByClassName('content')[0];
        con.style.minHeight=$window.innerHeight +'px';
        //获取各个列表为以后添加动画准备
        var lists = document.getElementsByClassName('son-list'),time;

        // 关闭详情样式
        $scope.closeDe = function (id) {
            var id = 'active_'+id;
            var de = document.getElementById(id);
            de.setAttribute('class','list-detail');
            var bar = document.getElementsByClassName('toolbar')[0];
            bar.style.display='block';
        }
        //搜索关闭
        $scope.on_clear=function () {
            $scope.searchText='';
            $scope.clickIcon = false;
            loadData();
        };

        //实现查询功能
        $scope.change=function (searchText) {
            var abc=$filter("filter")(users,searchText);
            $scope.users=ABCSort(abc);
        };

        //获取列表数据
        var p = ManService.getAll(),users=[];
        p.then(function (result) {
            if (result.status == 200){
                users = result.data.dateList;
                img(users);
            }else{
                alert('加载数据出错');
            }
        });

        /**图片预加载 start**/
        function img(users){
            var imgList=[];
            imgList.push("resource/images/cover.jpg");
            for(var i=0;i<users.length;i++){
                imgList.push(users[i].photo);
            }
            imgLoader(imgList, function (percentage) {
                var percentT = parseInt(percentage * 100);
                document.getElementById('percent').innerHTML=percentT+"%";
                if (parseInt(percentT) == 100) {
                    document.getElementById('loading').style.display='none';
                    var cover = document.getElementById('coverPic');
                    cover.style.display='block';
                    $timeout(function(){
                        document.getElementById('cover').setAttribute("class","fadeOut");
                        $timeout(function(){
                            document.getElementById('cover').style.display="none";
                        },1200);
                        loadData();
                    },3000);
                }
            });
        }
        /**图片预加载 end**/

        function loadData() {
            var newUser = [];
            newUser = ABCSort(users);
            forLists(newUser);
        }

        function forLists(newUser) {
            $scope.users = [];
            for (var i=0;i<newUser.length;i++){
                $scope.users.push(newUser[i]);
            };
            requestAnimationFrame(function() {
                for (var i=0;i<10;i++){
                    time = (i*100+100)+'ms';
                    lists[i].classList.add('fadeInUpBig');
                    lists[i].style.animationDelay = time;
                };
            })
        }

        //获取排序按钮
        $scope.sortsIcon = ManService.getSort();

        //排序切换
        $scope.switch=function(name){
            $scope.showIon = false;
            if(name=='groupName'){
                var flag=name;
                var data= strSort(users,flag);
                var datalist=[];
                for(var i=0;i<data.length;i++){
                    datalist.push(data[i].details[0].team)
                }
                function sortarr(arrlist,dataSort){
                    for(i=0;i<arrlist.length-1;i++){
                        for(j=0;j<arrlist.length-1-i;j++){
                            if(arrlist[j]>arrlist[j+1]){
                                var temp=arrlist[j];
                                arrlist[j]=arrlist[j+1];
                                arrlist[j+1]=temp;

                                var sortdata=dataSort[j];
                                dataSort[j]=dataSort[j+1];
                                dataSort[j+1]=sortdata;
                            }
                        }
                    }
                    return dataSort;
                }
                $scope.users = sortarr(datalist,data);
                //aaa=sortarr(datalist,data);
                //forLists(aaa);
            }
            if(name=='ABC'){
                //loadData();
                $scope.users = ABCSort(users);
            }
        }


    }])