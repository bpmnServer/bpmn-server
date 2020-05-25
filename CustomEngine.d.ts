import { CustomEngine as DefaultEngine } from './src/DefaultEngine';
declare class CustomEngine extends DefaultEngine {
    execute({ listener, callback }: {
        listener: any;
        callback: any;
    }): Promise<void>;
    resume({ listener }: {
        listener: any;
    }, callback: any): Promise<void>;
    /**
     * return services to be performed in workflow
     *
     * example to use: calling service2
     *
     *     <serviceTask id="task1" camunda:expression="\${environment.services.service2}" camunda:resultVariable="result" />
     *
     * or inside a script:
     *
     *   <scriptTask id="scriptTask" scriptFormat="Javascript">
    <script>
      <![CDATA[
        const self = this;
        const fun1= self.environment.services.function1;
        let result=fun1('testing');
 
      ]]>
    </script>
     *
     * */
    getServices(): {
        service1(scope: any, callback: any): void;
        service2(scope: any, callback: any): void;
        function1(scope: any, callback: any): void;
    };
    getExtensions(): {
        js: any;
        camunda: (activity: any) => void;
    };
    getModdleOptions(): {
        camunda: any;
    };
}
export { CustomEngine };
