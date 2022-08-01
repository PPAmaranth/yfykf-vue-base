'use strict';

var module_base$1 = require('@/public_js/module_base');

class module_base {
	constructor(obj) {
        this.components = obj.components;
        this.data = function(){
			return {
				...obj.initData,
			}
		};
        this.methods = {
            initPage:this.initPage,
            ...obj.methods
          };
        this.created = this.created;
        if(obj.created){
            this.methods.base_created = obj.created;
        }
        this.activated = this.activated;
        this.beforeRouteLeave = this.beforeRouteLeave;
        this.mounted = this.mounted;
        if(obj.mounted){
            this.methods.base_mounted = obj.mounted;
        }
        this.mixins = obj.mixins;
    }
    beforeCreate() {
        // 权限初始
        this.auth = {};
        if(this.$route.meta.auth){
            this.auth = {...this.$route.meta.auth};
        }
    }
    initPage(){
        
    }
    mounted(){
		this.initPage();
        if(this.base_mounted){
            this.base_mounted();
          }
	}
    created(){
        if(this.base_created){
            this.base_created();
          }
	}
    beforeRouteLeave(to,from,next){
        if(this.base_beforeRouteLeave){
            this.base_beforeRouteLeave(to,from,next);
            return
        }
        next();
    }
    activated(){
        if(this.base_activated){
            this.base_activated();
        }
    }
    deactivated(){
        if(this.base_deactivated){
            this.base_deactivated();
        }
    }
}

// list列表页的基类
class list_base extends module_base$1.module_base {
	constructor(obj) {
		super(obj);
		this.props = {
            pageMode: {
                type: String,
                default: "page" //dialog / page
            },
			selectMode: {
                type: Boolean,
                default: false
            },
			multiSelect: {
                type: Boolean,
                default: false
            },
			currentlistSelection: {
                type: Array,
                default: function(){return []}
            },
			...obj.props,
        };
		this.data = function(){
			let data = {
				type:null,
				needrefresh:false,
				loading:false,
				page:1,
				pagesize:10,
				total:0,
				title:"",
				listData:[],
				previewUrl:"",
        		previewImg:false,
				listSelection:[],
				pageOptions:[],
				packData:{},
				packVisible:false,
				tagData:{},
				tagVisible:false,
				pageScrollY:0,
				listTableScrollTop:0,
				...obj.initData,
			};
			if(data.useListSelector){
				data = {
					...data,
					filterProperties:[],
					filtersData:{},
					output_btn:0
				};
			}
			return JSON.parse(JSON.stringify(data))
		};
		this.methods = {
			initPage:this.initPage,
			openDetail:this.openDetail,
			search:this.search,
			currentChange:this.currentChange,
			getList:this.getList,
			deleteDetail:this.deleteDetail,
			openUrl:this.openUrl,
			jumpPage:this.jumpPage,
			preview:this.preview,
			contentNice:this.contentNice,
			listSelectAll:this.listSelectAll,
			listSelect:this.listSelect,
			updateListSelection:this.updateListSelection,
			clearListSelection:this.clearListSelection,
			multiSelectData:this.multiSelectData,
			selectData:this.selectData,
			toUrlJoint:this.toUrlJoint,
			getPagesTypes:this.getPagesTypes,
			openPackDialog:this.openPackDialog,
			closePackDialog:this.closePackDialog,
			successPack:this.successPack,
			openTagDialog:this.openTagDialog,
			closeTagDialog:this.closeTagDialog,
			successTag:this.successTag,
			getFilterProperties:this.getFilterProperties,
			base_beforeRouteLeave:this.base_beforeRouteLeave,
			base_activated:this.base_activated,
			...obj.methods
		};
		this.computed = {
			...obj.computed
		};
		if(obj.created){
			this.methods.base_created = obj.created;
		}
		if(obj.mounted){
			this.methods.base_mounted = obj.mounted;
		}
	}
	initPage(){
		console.log(this);
		super.initPage();
		console.log("list_base init");
		if(this.useListSelector){
			this.getFilterProperties(()=>{
				this.getList();
			});
		}else {
			this.getList();
		}
		if(this.type == 3 || this.type == 6 || this.type == 7){
			this.getPagesTypes();
		}
	}
	// 打开详情页方法
	openDetail(scope){
		const path = `${this.$route.meta.modelUrl}${this.detailPath}`;
		let query = {};
		if(scope){
		  query = {
			id:scope.row.id
		  };
		}
		if(this.pageMode == "page"){
			this.$router.push({ path:path,query:query  });
			// const visitedViews = this.$store.state.tagsView.visitedViews
			// let exist = false
			// for(let i in visitedViews){
			// if(visitedViews[i].path === path){
			// 	exist = true
			// }
			// }
			// if(exist){
			// this.$confirm('标签页已存在，是否覆盖原本内容打开？', '提示', {
			// 	confirmButtonText: '确定',
			// 	cancelButtonText: '取消',
			// 	type: 'warning'
			// }).then(() => {
			// 	this.$router.push({ path:path,query:query })
			// }).catch(() => {
			// 	this.$message({
			// 	type: 'info',
			// 	message: '已取消打开'
			// 	});          
			// });
			// }else{
			// this.$router.push({ path:path,query:query  })
			// }
		}
		if(this.pageMode == "dialog"){
			this.$emit("openDetail",scope);
		}
	}
	// 搜索
	search(){
		this.$set(this,"page",1);
		this.getList();
	}
	// 改变page
	currentChange(){
		this.getList();
	}
	// 获取列表数据
	getList(){
		
	}
	// 删除数据
	deleteDetail(scope){

	}
	// 打开url链接
	openUrl(scope){
		window.open(scope.row.url);
	}
	jumpPage(page){
		this.$set(this,"page",page);
		this.getList();
	}
	preview(url){
        this.previewUrl = url;
        this.previewImg = true;
    }
	contentNice(scope){

	}
	// listSelectAll list表全选
	listSelectAll(selection){
		this.updateListSelection(selection);
	}
    // listSelect
    listSelect(selection,row){
        this.updateListSelection(selection);
    }
	// 更新list当前选择
	updateListSelection(selection){
		let defalutProp = "id";
		if(this.type == 10 || this.type == 11 || this.type == 12){
			defalutProp = "content_id";
		}
		let currentSelection = [];
		const dataid = {};
		for(let i = 0;i<this.listData.length;i++){
			dataid[this.listData[i][defalutProp]] = true;
		}
		for(let i = 0;i<this.listSelection.length;i++){
			if(!dataid[this.listSelection[i][defalutProp]]){
				currentSelection.push(this.listSelection[i]);
			}
		}
		currentSelection = currentSelection.concat(selection);
		currentSelection.sort(function(a,b){return a.id - b.id});
		this.$set(this,"listSelection",currentSelection);
	}
	// 清空选择
	clearListSelection(){
		this.$set(this,"listSelection",[]);
		if(this.$refs["list-table"]){
			this.$refs["list-table"].clearSelection();
		}
	}
	// 多选按钮确认
	multiSelectData(){
		this.$emit('multiSelectData',this);
	}
	// 单选选择
	selectData(scope){
		this.$emit('selectData',scope);
	}
	getPagesTypes(callback){

	  }
	// 跳转到地址拼接
	toUrlJoint(scope){
		let path = "/tool/url-joint";
		let page = this.pageOptions.filter(item => item.content_type && item.content_type == this.type)[0]['value'];
		let query = {
			page:page,
			id:scope.row.id
		};
		if(this.type == 10 || this.type == 11){
			query.id = scope.row.content_id;
		}
		this.$router.push({ path:path,query:query });
	}
	// 打开包装dialog
	openPackDialog(scope){
		this.packData = scope.row;
		this.packVisible = true;
	}
	// 关闭包装dialog
	closePackDialog(scope){
		this.packData = {};
		this.packVisible = false;
	}
	// 包装成功
	successPack(){
		this.closePackDialog();
		this.getList();
	}
	// 打开包装dialog
	openTagDialog(scope){
		console.log(scope);
		this.tagData = scope.row;
		this.tagVisible = true;
	}
	// 关闭包装dialog
	closeTagDialog(scope){
		this.tagData = {};
		this.tagVisible = false;
	}
	// 包装成功
	successTag(){
		this.closeTagDialog();
		this.getList();
	}
	getFilterProperties(callback){
		
	}
	base_beforeRouteLeave (to, from, next) {
		this.pageScrollY = window.scrollY;
		if(this.$refs['list-table']){
			this.listTableScrollTop = this.$refs['list-table']['$el'].querySelector('.el-table__body-wrapper').scrollTop;
		}
		next();
	}
	base_activated(){
		let _this = this;
		if(this.needrefresh){
			this.getList();
			this.needrefresh = false;
		}
		this.$nextTick(()=>{
			setTimeout(()=>{
				window.scrollTo(0,_this.pageScrollY);
				if(_this.$refs['list-table']){
					_this.$refs['list-table']['$el'].querySelector('.el-table__body-wrapper').scrollTop = _this.listTableScrollTop;
				}
			},100);
		});
	}
	base_deactivated(){
		this.needrefresh = true;
		this.pageScrollY = window.scrollY;
		if(this.$refs['list-table']){
			this.listTableScrollTop = this.$refs['list-table']['$el'].querySelector('.el-table__body-wrapper').scrollTop;
		}
	}
}

class detail_base extends module_base$1.module_base {
	constructor(obj) {
		super(obj);
        this.props = {
            pageMode: {
                type: String,
                default: "page" //dialog / page
              },
            content_id:{
                type: Number,
                default: 0 
            },
            ...obj.props,
        };
        this.data = function(){
			return {
                loading:false,
                coverUrl:'',
                avatarUrl:'',
                title:"",
                extraUrl:"",
                tags: [],
                author:"",
                sort:0,
                ...obj.initData,
			}
		};
		this.methods = {
			initPage:this.initPage,
            closeDetail:this.closeDetail,
            tagClose:this.tagClose,
            submit:this.submit,
            getDetail:this.getDetail,
            afterUpload:this.afterUpload,
            tagSelectionConfirm:this.tagSelectionConfirm,
            setDetailData:this.setDetailData,
            deleteUploadUrl:this.deleteUploadUrl,
            showLoading:this.showLoading,
            hideLoading:this.hideLoading,
            ...obj.methods,
		};
        this.computed = {
			...obj.computed
		};
        if(obj.mounted){
			this.methods.base_mounted = obj.mounted;
		}
        if(obj.created){
			this.methods.base_created = obj.created;
		}
    }
    initPage(){
		super.initPage();
        console.log("detail_base init");
        if(this.pageMode == "page"){
            console.log("query参数",this.$route.query);
            let query = this.$route.query;
            if(query.id){
                this.getDetail();
            }
            if(query.isCopy){
                this.$set(this,"isCopy",1);
            }
        }
        if(this.pageMode == "dialog"){
            console.log("dialog参数",this.content_id);
            if(this.content_id){
                this.getDetail();
            }
        }
	}
    closeDetail(){
        if(this.pageMode == "page"){
            let view = this.$route;
            let visitedViews = this.$store.state.tagsView.visitedViews;
            this.$store.dispatch('tagsView/delView', view).then(() => {
                const latestView = visitedViews.slice(-1)[0];
                if (latestView) {
                    this.$router.push(latestView.fullPath);
                }else {
                    if(this.listPath){
                        this.$router.push({
                            path: `${this.$route.meta.modelUrl}${this.listPath}`,
                        });
                    }else {
                        console.log("no listPath");
                    }
                    
                }
            });
        }
        if(this.pageMode == "dialog"){
            this.$emit("closeDialogDetail");
        }
    }
    tagClose(tag) {
        for(let i = 0;i<this.tags.length;i++){
            if(this.tags[i]['id'] == tag.id){
            this.tags.splice(i, 1);
              break
            }
          }
      }
    // 提交
    submit(){}
    // 获取详情数据
    getDetail(){}
    // 回填数据
    setDetailData(res){
        if(this.type == 5){
            // 回填数据
            this.$set(this,"coverUrl",res.data.cover);
            this.$set(this,"title",res.data.title);
            this.$set(this,"brand",res.data.brand);
            this.$set(this,"extraUrl",res.data.url);
            this.$set(this,"avatarUrl",res.data.avatarurl);
            this.$set(this,"author",res.data.author_name);
            this.$set(this,"sort",res.data.sort);
            this.$set(this,"tags",res.data.tag);
        }
        if(this.type == 3){
            // 回填数据
            this.$set(this,"coverUrl",res.data.cover);
            this.$set(this,"title",res.data.title);
            this.$set(this,"brand",res.data.brand);
            this.$set(this,"extraUrl",res.data.url);
            this.$set(this,"avatarUrl",res.data.avatarurl);
            this.$set(this,"author",res.data.author_name);
            this.$set(this,"sort",res.data.sort);
            this.$set(this,"tx_vid",res.data.vid);
            this.$set(this,"tags",res.data.tag);
            this.$set(this,"video_type",res.data.video_type);
        }
        if(this.type == 4){
            // 回填数据
            this.$set(this,"coverUrl",res.data.cover);
            this.$set(this,"title",res.data.title);
            this.$set(this,"brand",res.data.brand);
            this.$set(this,"extraUrl",res.data.url);
            this.$set(this,"avatarUrl",res.data.avatarurl); 
            this.$set(this,"author",res.data.author_name);
            this.$set(this,"sort",res.data.sort);
            this.$set(this,"tags",res.data.tag);
            this.$set(this,"pano_id",res.data.pano_id);
            this.$set(this,"author_type",res.data.author_type);
        }
        if(this.type == 8){
            // 回填数据
            this.$set(this,"activity_name",res.data.content_other_data.activity_name);
            this.$set(this,"title",res.data.content_other_data.title);
            this.$set(this,"coverUrl",res.data.content_other_data.cover);
            this.$set(this,"price",res.data.content_other_data.price);
            this.$set(this,"market_price",res.data.content_other_data.market_price);
            this.$set(this,"express_price",res.data.content_other_data.express_price);
            this.$set(this,"sponsor",res.data.content_other_data.sponsor);
            this.$set(this,"goods_list",res.data.content_other_data.goods_list);
            this.$set(this,"detail_list",res.data.content_other_data.detail_list);
            this.$set(this,"num",res.data.content_other_data.num);
            this.$set(this,"start_time",res.data.content_other_data.start_time * 1000);
            this.$set(this,"end_time",res.data.content_other_data.end_time * 1000);
            this.$set(this,"agreement",res.data.content_other_data.agreement);
            this.$set(this,"message",res.data.content_other_data.message);
            this.$set(this,"false_sale_num",res.data.content_other_data.false_sale_num);
            this.$set(this,"false_join_num",res.data.content_other_data.false_join_num);
            this.$set(this,"content",res.data.content_other_data.content);
            this.$set(this,"formid",res.data.content_other_data.id);
            this.$set(this,"event_id",res.data.content_other_data.event_id?`${res.data.content_other_data.event_id}`:"");
            this.$set(this,"shop_status",res.data.content_other_data.shop_status);
            this.$set(this,"limit_buy",res.data.content_other_data.limit_buy);
            this.$set(this,"card_tab",res.data.content_other_data.card_tab);
            this.$set(this,"card_banner",res.data.content_other_data.card_banner);
            this.$set(this,"product_type",res.data.content_other_data.type);
            if(res.data.content_other_data.batch_id && res.data.content_other_data.batch_id.length > 0 && this.isCopy == 0){
                this.$set(this,"batch_id",res.data.content_other_data.batch_id);
                this.$set(this,"batchDisabled",true); 
            }
            if(res.data.content_other_data.reward_id){
                this.$set(this,"reward_id",res.data.content_other_data.reward_id);
                this.$set(this,"reward_status",res.data.content_other_data.reward_status);
            }
        }
    }
    afterUpload({prop,res,parent}){
        this.$set(parent,prop,`https://tx-wsai-cdn.yfway.com/${res['data']['dir']}`);
    }
    tagSelectionConfirm(tag){
        this.tags.push(tag);
    }
    deleteUploadUrl({prop,parent}){
        this.$set(parent,prop,"");
    }
    showLoading(){
        this.$set(this,"loading",true);
    }
    hideLoading(){
        this.$set(this,"loading",false);
    }
}

var index = {
    module_base,
    list_base,
    detail_base
};

module.exports = index;
