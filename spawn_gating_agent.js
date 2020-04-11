///<reference path='D:/apps/frida-gum.d.ts'/>
console.log('------------Agent speaking from PID', Process.id);

function myEach(arr){
    for (var i in arr) {
        console.log("item : "+JSON.stringify(arr[i]))
    }
  }

//refSetStaticString(A, "flag", "dev")
function refSetStaticString(aClass, field, val) {
    var f = aClass.class.getDeclaredField(field);
    f.setAccessible(true);
    f.set("java.lang.Object", val);
}

//refSetStaticBoolean(A, "flag", true)
function refSetStaticBoolean(aClass, field, val) {
    var f = aClass.class.getDeclaredField(field);
    f.setAccessible(true);
    f.setBoolean("java.lang.Boolean", val);//必须是字符串"java.lang.Boolean"或"java.lang.Object"不能是Java.use()的返回类型
}

//refSetString(this, "flag", "dev")//还没测试
function refSetString(obj, field, val) {
    var f = obj.getClass().getDeclaredField(field);
    f.setAccessible(true);
    f.set(obj, val);
}

//refSetBoolean(this, "flag", true)
function refSetBoolean(obj, field, val) {
    var f = obj.getClass().getDeclaredField(field);
    f.setAccessible(true);
    f.setBoolean(obj, val);
}


Java.perform(function(){
    console.log("------------")

    var application = Java.use("com.jiliguala.niuwa.MyApplication");
    application.attachBaseContext.overload('android.content.Context').implementation = function(context) {
        console.log("Hook MyApplication")
        
 
        //日志开关
        var a = Java.use("com.jiliguala.niuwa.common.util.b.a");//com.jiliguala.niuwa.common.util.b.a.g
        refSetStaticString(a, "d", "dev")

        //a/b test调试助手、StethoInterceptor开关
        //搜.enableDebugAssist(com.jiliguala.niuwa.common.util.b.a.g)
        //搜new StethoInterceptor()
        refSetStaticBoolean(a, "g", true)

        //关闭 a/b test调试助手 ,太烦人
        var abtest = Java.use("com.adhoc.config.AdhocConfig$Builder");//注意内部类的表示方式
        abtest.enableDebugAssist.implementation = function(z){
            console.log("enableDebugAssist")
            // this.mDebug = true//只能用反射修改
            refSetBoolean(this, "mDebug", false)
            return this
        }
        

        //遍历heap中的对象
        Java.choose("com.jiliguala.niuwa.common.util.b.a", {
            onMatch: function (instance) {
                console.log("Found instance: " + instance);
                // console.log("[*] EditText Hint: " + Java.cast(instance.getHint(), Boolean));
            },
            onComplete: function () {
                console.log("[*] Finished heap search");
            }
        });


        //不要忘记调用原方法。一般放在最后，这样前面的hook才能更早生效。
        this.attachBaseContext(context);
    }
  
  
  })