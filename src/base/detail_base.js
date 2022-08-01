import { module_base } from '@/public_js/module_base'
export class detail_base extends module_base {
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
        }
        this.data = function(){
			return{
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
		}
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
		}
        this.computed = {
			...obj.computed
		}
        if(obj.mounted){
			this.methods.base_mounted = obj.mounted
		}
        if(obj.created){
			this.methods.base_created = obj.created
		}
    }
    initPage(){
		super.initPage()
        console.log("detail_base init")
        if(this.pageMode == "page"){
            console.log("query参数",this.$route.query)
            let query = this.$route.query
            if(query.id){
                this.getDetail()
            }
            if(query.isCopy){
                this.$set(this,"isCopy",1)
            }
        }
        if(this.pageMode == "dialog"){
            console.log("dialog参数",this.content_id)
            if(this.content_id){
                this.getDetail()
            }
        }
	}
    closeDetail(){
        if(this.pageMode == "page"){
            let view = this.$route
            let visitedViews = this.$store.state.tagsView.visitedViews
            this.$store.dispatch('tagsView/delView', view).then(() => {
                const latestView = visitedViews.slice(-1)[0]
                if (latestView) {
                    this.$router.push(latestView.fullPath)
                }else{
                    if(this.listPath){
                        this.$router.push({
                            path: `${this.$route.meta.modelUrl}${this.listPath}`,
                        });
                    }else{
                        console.log("no listPath")
                    }
                    
                }
            })
        }
        if(this.pageMode == "dialog"){
            this.$emit("closeDialogDetail")
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
            this.$set(this,"coverUrl",res.data.cover)
            this.$set(this,"title",res.data.title)
            this.$set(this,"brand",res.data.brand)
            this.$set(this,"extraUrl",res.data.url)
            this.$set(this,"avatarUrl",res.data.avatarurl)
            this.$set(this,"author",res.data.author_name)
            this.$set(this,"sort",res.data.sort)
            this.$set(this,"tags",res.data.tag)
        }
        if(this.type == 3){
            // 回填数据
            this.$set(this,"coverUrl",res.data.cover)
            this.$set(this,"title",res.data.title)
            this.$set(this,"brand",res.data.brand)
            this.$set(this,"extraUrl",res.data.url)
            this.$set(this,"avatarUrl",res.data.avatarurl)
            this.$set(this,"author",res.data.author_name)
            this.$set(this,"sort",res.data.sort)
            this.$set(this,"tx_vid",res.data.vid)
            this.$set(this,"tags",res.data.tag)
            this.$set(this,"video_type",res.data.video_type)
        }
        if(this.type == 4){
            // 回填数据
            this.$set(this,"coverUrl",res.data.cover)
            this.$set(this,"title",res.data.title)
            this.$set(this,"brand",res.data.brand)
            this.$set(this,"extraUrl",res.data.url)
            this.$set(this,"avatarUrl",res.data.avatarurl) 
            this.$set(this,"author",res.data.author_name)
            this.$set(this,"sort",res.data.sort)
            this.$set(this,"tags",res.data.tag)
            this.$set(this,"pano_id",res.data.pano_id)
            this.$set(this,"author_type",res.data.author_type)
        }
        if(this.type == 8){
            // 回填数据
            this.$set(this,"activity_name",res.data.content_other_data.activity_name)
            this.$set(this,"title",res.data.content_other_data.title)
            this.$set(this,"coverUrl",res.data.content_other_data.cover)
            this.$set(this,"price",res.data.content_other_data.price)
            this.$set(this,"market_price",res.data.content_other_data.market_price)
            this.$set(this,"express_price",res.data.content_other_data.express_price)
            this.$set(this,"sponsor",res.data.content_other_data.sponsor)
            this.$set(this,"goods_list",res.data.content_other_data.goods_list)
            this.$set(this,"detail_list",res.data.content_other_data.detail_list)
            this.$set(this,"num",res.data.content_other_data.num)
            this.$set(this,"start_time",res.data.content_other_data.start_time * 1000)
            this.$set(this,"end_time",res.data.content_other_data.end_time * 1000)
            this.$set(this,"agreement",res.data.content_other_data.agreement)
            this.$set(this,"message",res.data.content_other_data.message)
            this.$set(this,"false_sale_num",res.data.content_other_data.false_sale_num)
            this.$set(this,"false_join_num",res.data.content_other_data.false_join_num)
            this.$set(this,"content",res.data.content_other_data.content)
            this.$set(this,"formid",res.data.content_other_data.id)
            this.$set(this,"event_id",res.data.content_other_data.event_id?`${res.data.content_other_data.event_id}`:"")
            this.$set(this,"shop_status",res.data.content_other_data.shop_status)
            this.$set(this,"limit_buy",res.data.content_other_data.limit_buy)
            this.$set(this,"card_tab",res.data.content_other_data.card_tab)
            this.$set(this,"card_banner",res.data.content_other_data.card_banner)
            this.$set(this,"product_type",res.data.content_other_data.type)
            if(res.data.content_other_data.batch_id && res.data.content_other_data.batch_id.length > 0 && this.isCopy == 0){
                this.$set(this,"batch_id",res.data.content_other_data.batch_id)
                this.$set(this,"batchDisabled",true) 
            }
            if(res.data.content_other_data.reward_id){
                this.$set(this,"reward_id",res.data.content_other_data.reward_id)
                this.$set(this,"reward_status",res.data.content_other_data.reward_status)
            }
        }
    }
    afterUpload({prop,res,parent}){
        this.$set(parent,prop,`https://tx-wsai-cdn.yfway.com/${res['data']['dir']}`)
    }
    tagSelectionConfirm(tag){
        this.tags.push(tag)
    }
    deleteUploadUrl({prop,parent}){
        this.$set(parent,prop,"")
    }
    showLoading(){
        this.$set(this,"loading",true)
    }
    hideLoading(){
        this.$set(this,"loading",false)
    }
}