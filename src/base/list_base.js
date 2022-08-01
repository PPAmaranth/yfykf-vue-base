// list列表页的基类
import { module_base } from '@/public_js/module_base'
export class list_base extends module_base {
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
        }
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
			}
			if(data.useListSelector){
				data = {
					...data,
					filterProperties:[],
					filtersData:{},
					output_btn:0
				}
			}
			return JSON.parse(JSON.stringify(data))
		}
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
		}
		this.computed = {
			...obj.computed
		}
		if(obj.created){
			this.methods.base_created = obj.created
		}
		if(obj.mounted){
			this.methods.base_mounted = obj.mounted
		}
	}
	initPage(){
		console.log(this)
		super.initPage()
		console.log("list_base init")
		if(this.useListSelector){
			this.getFilterProperties(()=>{
				this.getList()
			})
		}else{
			this.getList()
		}
		if(this.type == 3 || this.type == 6 || this.type == 7){
			this.getPagesTypes()
		}
	}
	// 打开详情页方法
	openDetail(scope){
		const path = `${this.$route.meta.modelUrl}${this.detailPath}`
		let query = {}
		if(scope){
		  query = {
			id:scope.row.id
		  }
		}
		if(this.pageMode == "page"){
			this.$router.push({ path:path,query:query  })
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
			this.$emit("openDetail",scope)
		}
	}
	// 搜索
	search(){
		this.$set(this,"page",1)
		this.getList()
	}
	// 改变page
	currentChange(){
		this.getList()
	}
	// 获取列表数据
	getList(){
		
	}
	// 删除数据
	deleteDetail(scope){

	}
	// 打开url链接
	openUrl(scope){
		window.open(scope.row.url)
	}
	jumpPage(page){
		this.$set(this,"page",page)
		this.getList()
	}
	preview(url){
        this.previewUrl = url
        this.previewImg = true
    }
	contentNice(scope){

	}
	// listSelectAll list表全选
	listSelectAll(selection){
		this.updateListSelection(selection)
	}
    // listSelect
    listSelect(selection,row){
        this.updateListSelection(selection)
    }
	// 更新list当前选择
	updateListSelection(selection){
		let defalutProp = "id"
		if(this.type == 10 || this.type == 11 || this.type == 12){
			defalutProp = "content_id"
		}
		let currentSelection = []
		const dataid = {}
		for(let i = 0;i<this.listData.length;i++){
			dataid[this.listData[i][defalutProp]] = true
		}
		for(let i = 0;i<this.listSelection.length;i++){
			if(!dataid[this.listSelection[i][defalutProp]]){
				currentSelection.push(this.listSelection[i])
			}
		}
		currentSelection = currentSelection.concat(selection)
		currentSelection.sort(function(a,b){return a.id - b.id})
		this.$set(this,"listSelection",currentSelection)
	}
	// 清空选择
	clearListSelection(){
		this.$set(this,"listSelection",[])
		if(this.$refs["list-table"]){
			this.$refs["list-table"].clearSelection()
		}
	}
	// 多选按钮确认
	multiSelectData(){
		this.$emit('multiSelectData',this)
	}
	// 单选选择
	selectData(scope){
		this.$emit('selectData',scope)
	}
	getPagesTypes(callback){

	  }
	// 跳转到地址拼接
	toUrlJoint(scope){
		let path = "/tool/url-joint"
		let page = this.pageOptions.filter(item => item.content_type && item.content_type == this.type)[0]['value']
		let query = {
			page:page,
			id:scope.row.id
		}
		if(this.type == 10 || this.type == 11){
			query.id = scope.row.content_id
		}
		this.$router.push({ path:path,query:query })
	}
	// 打开包装dialog
	openPackDialog(scope){
		this.packData = scope.row
		this.packVisible = true
	}
	// 关闭包装dialog
	closePackDialog(scope){
		this.packData = {}
		this.packVisible = false
	}
	// 包装成功
	successPack(){
		this.closePackDialog()
		this.getList()
	}
	// 打开包装dialog
	openTagDialog(scope){
		console.log(scope)
		this.tagData = scope.row
		this.tagVisible = true
	}
	// 关闭包装dialog
	closeTagDialog(scope){
		this.tagData = {}
		this.tagVisible = false
	}
	// 包装成功
	successTag(){
		this.closeTagDialog()
		this.getList()
	}
	getFilterProperties(callback){
		
	}
	base_beforeRouteLeave (to, from, next) {
		this.pageScrollY = window.scrollY
		if(this.$refs['list-table']){
			this.listTableScrollTop = this.$refs['list-table']['$el'].querySelector('.el-table__body-wrapper').scrollTop
		}
		next()
	}
	base_activated(){
		let _this = this
		if(this.needrefresh){
			this.getList()
			this.needrefresh = false
		}
		this.$nextTick(()=>{
			setTimeout(()=>{
				window.scrollTo(0,_this.pageScrollY)
				if(_this.$refs['list-table']){
					_this.$refs['list-table']['$el'].querySelector('.el-table__body-wrapper').scrollTop = _this.listTableScrollTop
				}
			},100)
		})
	}
	base_deactivated(){
		this.needrefresh = true
		this.pageScrollY = window.scrollY
		if(this.$refs['list-table']){
			this.listTableScrollTop = this.$refs['list-table']['$el'].querySelector('.el-table__body-wrapper').scrollTop
		}
	}
}