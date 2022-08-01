export class module_base {
	constructor(obj) {
        this.components = obj.components
        this.data = function(){
			return{
				...obj.initData,
			}
		}
        this.methods = {
            initPage:this.initPage,
            ...obj.methods
          }
        this.created = this.created
        if(obj.created){
            this.methods.base_created = obj.created
        }
        this.activated = this.activated
        this.beforeRouteLeave = this.beforeRouteLeave
        this.mounted = this.mounted
        if(obj.mounted){
            this.methods.base_mounted = obj.mounted
        }
        this.mixins = obj.mixins
    }
    beforeCreate() {
        // 权限初始
        this.auth = {}
        if(this.$route.meta.auth){
            this.auth = {...this.$route.meta.auth}
        }
    }
    initPage(){
        
    }
    mounted(){
		this.initPage()
        if(this.base_mounted){
            this.base_mounted()
          }
	}
    created(){
        if(this.base_created){
            this.base_created()
          }
	}
    beforeRouteLeave(to,from,next){
        if(this.base_beforeRouteLeave){
            this.base_beforeRouteLeave(to,from,next)
            return
        }
        next()
    }
    activated(){
        if(this.base_activated){
            this.base_activated()
        }
    }
    deactivated(){
        if(this.base_deactivated){
            this.base_deactivated()
        }
    }
}