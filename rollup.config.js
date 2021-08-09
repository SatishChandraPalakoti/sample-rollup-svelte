import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import livereload from "rollup-plugin-livereload"


function serve(){
    //keep reference to spawned process
    let server;

    function toExit(){
        //kill server if exits
        if(server) server.kill(0)
    }
    return{
         writeBundle(){
             if(server)
             return;

             server=require("child_process").spawn('npm',[
                 'run', 'start', '--', '--dev'
             ],
             {
                 stdio: ['ignore','inherit','inherit'],
                 shell: true
             })

             process.on('SIGTERM', toExit);
             process.on('exit', toExit)
         },
    }
}

export default{
    input :"src/main.js",
    output: {
        file : 'public/build/bundle.js',
        format : 'iife',
        name : 'app'
    },
    plugins : [
        svelte({
            include: 'src/**/*.svelte'
        }),
        resolve({ browser : true}),
        serve(),
        livereload('public')
    ]
}