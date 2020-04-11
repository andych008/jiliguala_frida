///<reference path='D:/apps/frida-gum.d.ts'/>
console.log('------------Agent speaking from PID', Process.id);

function myEarch(arr){
    for (var i in arr) {
        console.log("item : "+i)
    }
}
Java.perform(function(){
    console.log("------------")

    var application = Java.use("com.jiliguala.niuwa.MyApplication");
    application.attachBaseContext.overload('android.content.Context').implementation = function(context) {
        console.log("Hook MyApplication")
        
 
        //日志开关
        var a = Java.use("com.jiliguala.niuwa.common.util.b.a");//com.jiliguala.niuwa.common.util.b.a.g
        a.class.getDeclaredField("d").set("java.lang.Object", "dev");

        //a/b test调试助手 开关。StethoInterceptor开关
        //搜.enableDebugAssist(com.jiliguala.niuwa.common.util.b.a.g)
        //搜new StethoInterceptor()
        a.class.getDeclaredField("g").setBoolean("java.lang.Boolean", true);//必须是字符串"java.lang.Boolean"或"java.lang.Object"


        //a/b test调试助手 关闭,太烦人
        var abtest = Java.use("com.adhoc.config.AdhocConfig$Builder");//注意内部类的表示方式
        abtest.enableDebugAssist.implementation = function(z){
            console.log("enableDebugAssist")
            // this.mDebug = true//只能用反射修改
            // this.getClass().getDeclaredField('mDebug').setBoolean(this, false)
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