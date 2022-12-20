"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rewrite_1 = require("../lib/rewrite");
describe(rewrite_1.rewriteImports, () => {
    test('correctly rewrites naked "import"', () => {
        const output = rewrite_1.rewriteImports(`
    // something before
    import '@aws-cdk/assert/jest';
    // something after

    console.log('Look! I did something!');`, 'subhect.ts');
        expect(output).toBe(`
    // something before
    import '@monocdk-experiment/assert/jest';
    // something after

    console.log('Look! I did something!');`);
    });
    test('correctly rewrites naked "require"', () => {
        const output = rewrite_1.rewriteImports(`
    // something before
    require('@aws-cdk/assert/jest');
    // something after

    console.log('Look! I did something!');`, 'subhect.ts');
        expect(output).toBe(`
    // something before
    require('@monocdk-experiment/assert/jest');
    // something after

    console.log('Look! I did something!');`);
    });
    test('correctly rewrites "import from"', () => {
        const output = rewrite_1.rewriteImports(`
  // something before
  import * as s3 from '@aws-cdk/aws-s3';
  import * as cfndiff from '@aws-cdk/cloudformation-diff';
  import { Construct } from "@aws-cdk/core";
  // something after

  console.log('Look! I did something!');`, 'subject.ts');
        expect(output).toBe(`
  // something before
  import * as s3 from 'monocdk/aws-s3';
  import * as cfndiff from '@aws-cdk/cloudformation-diff';
  import { Construct } from "monocdk";
  // something after

  console.log('Look! I did something!');`);
    });
    test('correctly rewrites "import = require"', () => {
        const output = rewrite_1.rewriteImports(`
  // something before
  import s3 = require('@aws-cdk/aws-s3');
  import cfndiff = require('@aws-cdk/cloudformation-diff');
  import { Construct } = require("@aws-cdk/core");
  // something after

  console.log('Look! I did something!');`, 'subject.ts');
        expect(output).toBe(`
  // something before
  import s3 = require('monocdk/aws-s3');
  import cfndiff = require('@aws-cdk/cloudformation-diff');
  import { Construct } = require("monocdk");
  // something after

  console.log('Look! I did something!');`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV3cml0ZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmV3cml0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQWdEO0FBRWhELFFBQVEsQ0FBQyx3QkFBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQzdDLE1BQU0sTUFBTSxHQUFHLHdCQUFjLENBQUM7Ozs7OzJDQUtTLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFdkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQzs7Ozs7MkNBS21CLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7UUFDOUMsTUFBTSxNQUFNLEdBQUcsd0JBQWMsQ0FBQzs7Ozs7MkNBS1MsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUV2RCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDOzs7OzsyQ0FLbUIsQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtRQUM1QyxNQUFNLE1BQU0sR0FBRyx3QkFBYyxDQUFDOzs7Ozs7O3lDQU9PLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFckQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQzs7Ozs7Ozt5Q0FPaUIsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUNqRCxNQUFNLE1BQU0sR0FBRyx3QkFBYyxDQUFDOzs7Ozs7O3lDQU9PLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFckQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQzs7Ozs7Ozt5Q0FPaUIsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZXdyaXRlSW1wb3J0cyB9IGZyb20gJy4uL2xpYi9yZXdyaXRlJztcblxuZGVzY3JpYmUocmV3cml0ZUltcG9ydHMsICgpID0+IHtcbiAgdGVzdCgnY29ycmVjdGx5IHJld3JpdGVzIG5ha2VkIFwiaW1wb3J0XCInLCAoKSA9PiB7XG4gICAgY29uc3Qgb3V0cHV0ID0gcmV3cml0ZUltcG9ydHMoYFxuICAgIC8vIHNvbWV0aGluZyBiZWZvcmVcbiAgICBpbXBvcnQgJ0Bhd3MtY2RrL2Fzc2VydC9qZXN0JztcbiAgICAvLyBzb21ldGhpbmcgYWZ0ZXJcblxuICAgIGNvbnNvbGUubG9nKCdMb29rISBJIGRpZCBzb21ldGhpbmchJyk7YCwgJ3N1YmhlY3QudHMnKTtcblxuICAgIGV4cGVjdChvdXRwdXQpLnRvQmUoYFxuICAgIC8vIHNvbWV0aGluZyBiZWZvcmVcbiAgICBpbXBvcnQgJ0Btb25vY2RrLWV4cGVyaW1lbnQvYXNzZXJ0L2plc3QnO1xuICAgIC8vIHNvbWV0aGluZyBhZnRlclxuXG4gICAgY29uc29sZS5sb2coJ0xvb2shIEkgZGlkIHNvbWV0aGluZyEnKTtgKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29ycmVjdGx5IHJld3JpdGVzIG5ha2VkIFwicmVxdWlyZVwiJywgKCkgPT4ge1xuICAgIGNvbnN0IG91dHB1dCA9IHJld3JpdGVJbXBvcnRzKGBcbiAgICAvLyBzb21ldGhpbmcgYmVmb3JlXG4gICAgcmVxdWlyZSgnQGF3cy1jZGsvYXNzZXJ0L2plc3QnKTtcbiAgICAvLyBzb21ldGhpbmcgYWZ0ZXJcblxuICAgIGNvbnNvbGUubG9nKCdMb29rISBJIGRpZCBzb21ldGhpbmchJyk7YCwgJ3N1YmhlY3QudHMnKTtcblxuICAgIGV4cGVjdChvdXRwdXQpLnRvQmUoYFxuICAgIC8vIHNvbWV0aGluZyBiZWZvcmVcbiAgICByZXF1aXJlKCdAbW9ub2Nkay1leHBlcmltZW50L2Fzc2VydC9qZXN0Jyk7XG4gICAgLy8gc29tZXRoaW5nIGFmdGVyXG5cbiAgICBjb25zb2xlLmxvZygnTG9vayEgSSBkaWQgc29tZXRoaW5nIScpO2ApO1xuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgcmV3cml0ZXMgXCJpbXBvcnQgZnJvbVwiJywgKCkgPT4ge1xuICAgIGNvbnN0IG91dHB1dCA9IHJld3JpdGVJbXBvcnRzKGBcbiAgLy8gc29tZXRoaW5nIGJlZm9yZVxuICBpbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuICBpbXBvcnQgKiBhcyBjZm5kaWZmIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWRpZmYnO1xuICBpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuICAvLyBzb21ldGhpbmcgYWZ0ZXJcblxuICBjb25zb2xlLmxvZygnTG9vayEgSSBkaWQgc29tZXRoaW5nIScpO2AsICdzdWJqZWN0LnRzJyk7XG5cbiAgICBleHBlY3Qob3V0cHV0KS50b0JlKGBcbiAgLy8gc29tZXRoaW5nIGJlZm9yZVxuICBpbXBvcnQgKiBhcyBzMyBmcm9tICdtb25vY2RrL2F3cy1zMyc7XG4gIGltcG9ydCAqIGFzIGNmbmRpZmYgZnJvbSAnQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24tZGlmZic7XG4gIGltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJtb25vY2RrXCI7XG4gIC8vIHNvbWV0aGluZyBhZnRlclxuXG4gIGNvbnNvbGUubG9nKCdMb29rISBJIGRpZCBzb21ldGhpbmchJyk7YCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvcnJlY3RseSByZXdyaXRlcyBcImltcG9ydCA9IHJlcXVpcmVcIicsICgpID0+IHtcbiAgICBjb25zdCBvdXRwdXQgPSByZXdyaXRlSW1wb3J0cyhgXG4gIC8vIHNvbWV0aGluZyBiZWZvcmVcbiAgaW1wb3J0IHMzID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLXMzJyk7XG4gIGltcG9ydCBjZm5kaWZmID0gcmVxdWlyZSgnQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24tZGlmZicpO1xuICBpbXBvcnQgeyBDb25zdHJ1Y3QgfSA9IHJlcXVpcmUoXCJAYXdzLWNkay9jb3JlXCIpO1xuICAvLyBzb21ldGhpbmcgYWZ0ZXJcblxuICBjb25zb2xlLmxvZygnTG9vayEgSSBkaWQgc29tZXRoaW5nIScpO2AsICdzdWJqZWN0LnRzJyk7XG5cbiAgICBleHBlY3Qob3V0cHV0KS50b0JlKGBcbiAgLy8gc29tZXRoaW5nIGJlZm9yZVxuICBpbXBvcnQgczMgPSByZXF1aXJlKCdtb25vY2RrL2F3cy1zMycpO1xuICBpbXBvcnQgY2ZuZGlmZiA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWRpZmYnKTtcbiAgaW1wb3J0IHsgQ29uc3RydWN0IH0gPSByZXF1aXJlKFwibW9ub2Nka1wiKTtcbiAgLy8gc29tZXRoaW5nIGFmdGVyXG5cbiAgY29uc29sZS5sb2coJ0xvb2shIEkgZGlkIHNvbWV0aGluZyEnKTtgKTtcbiAgfSk7XG59KTtcbiJdfQ==