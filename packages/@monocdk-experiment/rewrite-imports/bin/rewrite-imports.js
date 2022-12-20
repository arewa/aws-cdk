"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const fs = require("fs");
const util_1 = require("util");
const _glob = require("glob");
const rewrite_1 = require("../lib/rewrite");
const glob = util_1.promisify(_glob);
async function main() {
    if (!process.argv[2]) {
        console.error('usage: rewrite-imports **/*.ts');
        return;
    }
    const ignore = [
        '**/*.d.ts',
        'node_modules/**',
    ];
    const args = process.argv.slice(2);
    for (const arg of args) {
        const files = await glob(arg, { ignore, matchBase: true });
        for (const file of files) {
            const input = await fs.promises.readFile(file, { encoding: 'utf8' });
            const output = rewrite_1.rewriteImports(input, file);
            if (output.trim() !== input.trim()) {
                await fs.promises.writeFile(file, output);
            }
        }
    }
}
main().catch(e => {
    console.error(e.stack);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV3cml0ZS1pbXBvcnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmV3cml0ZS1pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQStCO0FBQy9CLHlCQUF5QjtBQUN6QiwrQkFBaUM7QUFDakMsOEJBQThCO0FBRTlCLDRDQUFnRDtBQUVoRCxNQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRTlCLEtBQUssVUFBVSxJQUFJO0lBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNoRCxPQUFPO0tBQ1I7SUFFRCxNQUFNLE1BQU0sR0FBRztRQUNiLFdBQVc7UUFDWCxpQkFBaUI7S0FDbEIsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25DLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMzRCxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtZQUN4QixNQUFNLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sTUFBTSxHQUFHLHdCQUFjLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNDLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDbEMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDM0M7U0FDRjtLQUNGO0FBQ0gsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJztcbmltcG9ydCAqIGFzIF9nbG9iIGZyb20gJ2dsb2InO1xuXG5pbXBvcnQgeyByZXdyaXRlSW1wb3J0cyB9IGZyb20gJy4uL2xpYi9yZXdyaXRlJztcblxuY29uc3QgZ2xvYiA9IHByb21pc2lmeShfZ2xvYik7XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIGlmICghcHJvY2Vzcy5hcmd2WzJdKSB7XG4gICAgY29uc29sZS5lcnJvcigndXNhZ2U6IHJld3JpdGUtaW1wb3J0cyAqKi8qLnRzJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgaWdub3JlID0gW1xuICAgICcqKi8qLmQudHMnLFxuICAgICdub2RlX21vZHVsZXMvKionLFxuICBdO1xuXG4gIGNvbnN0IGFyZ3MgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7XG4gIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICBjb25zdCBmaWxlcyA9IGF3YWl0IGdsb2IoYXJnLCB7IGlnbm9yZSwgbWF0Y2hCYXNlOiB0cnVlIH0pO1xuICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgY29uc3QgaW5wdXQgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShmaWxlLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgICBjb25zdCBvdXRwdXQgPSByZXdyaXRlSW1wb3J0cyhpbnB1dCwgZmlsZSk7XG4gICAgICBpZiAob3V0cHV0LnRyaW0oKSAhPT0gaW5wdXQudHJpbSgpKSB7XG4gICAgICAgIGF3YWl0IGZzLnByb21pc2VzLndyaXRlRmlsZShmaWxlLCBvdXRwdXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tYWluKCkuY2F0Y2goZSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gIHByb2Nlc3MuZXhpdCgxKTtcbn0pO1xuIl19