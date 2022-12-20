"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteImports = void 0;
const ts = require("typescript");
/**
 * Re-writes "hyper-modular" CDK imports (most packages in `@aws-cdk/*`) to the
 * relevant "mono" CDK import path. The re-writing will only modify the imported
 * library path, presrving the existing quote style, etc...
 *
 * Syntax errors in the source file being processed may cause some import
 * statements to not be re-written.
 *
 * Supported import statement forms are:
 * - `import * as lib from '@aws-cdk/lib';`
 * - `import { Type } from '@aws-cdk/lib';`
 * - `import '@aws-cdk/lib';`
 * - `import lib = require('@aws-cdk/lib');`
 * - `import { Type } = require('@aws-cdk/lib');
 * - `require('@aws-cdk/lib');
 *
 * @param sourceText the source code where imports should be re-written.
 * @param fileName   a customized file name to provide the TypeScript processor.
 *
 * @returns the updated source code.
 */
function rewriteImports(sourceText, fileName = 'index.ts') {
    const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.ES2018);
    const replacements = new Array();
    const visitor = (node) => {
        const moduleSpecifier = getModuleSpecifier(node);
        const newTarget = moduleSpecifier && updatedLocationOf(moduleSpecifier.text);
        if (moduleSpecifier != null && newTarget != null) {
            replacements.push({ original: moduleSpecifier, updatedLocation: newTarget });
        }
        return node;
    };
    sourceFile.statements.forEach(node => ts.visitNode(node, visitor));
    let updatedSourceText = sourceText;
    // Applying replacements in reverse order, so node positions remain valid.
    for (const replacement of replacements.sort(({ original: l }, { original: r }) => r.getStart(sourceFile) - l.getStart(sourceFile))) {
        const prefix = updatedSourceText.substring(0, replacement.original.getStart(sourceFile) + 1);
        const suffix = updatedSourceText.substring(replacement.original.getEnd() - 1);
        updatedSourceText = prefix + replacement.updatedLocation + suffix;
    }
    return updatedSourceText;
    function getModuleSpecifier(node) {
        if (ts.isImportDeclaration(node)) {
            // import style
            const moduleSpecifier = node.moduleSpecifier;
            if (ts.isStringLiteral(moduleSpecifier)) {
                // import from 'location';
                // import * as name from 'location';
                return moduleSpecifier;
            }
            else if (ts.isBinaryExpression(moduleSpecifier) && ts.isCallExpression(moduleSpecifier.right)) {
                // import { Type } = require('location');
                return getModuleSpecifier(moduleSpecifier.right);
            }
        }
        else if (ts.isImportEqualsDeclaration(node)
            && ts.isExternalModuleReference(node.moduleReference)
            && ts.isStringLiteral(node.moduleReference.expression)) {
            // import name = require('location');
            return node.moduleReference.expression;
        }
        else if ((ts.isCallExpression(node))
            && ts.isIdentifier(node.expression)
            && node.expression.escapedText === 'require'
            && node.arguments.length === 1) {
            // require('location');
            const argument = node.arguments[0];
            if (ts.isStringLiteral(argument)) {
                return argument;
            }
        }
        else if (ts.isExpressionStatement(node) && ts.isCallExpression(node.expression)) {
            // require('location'); // This is an alternate AST version of it
            return getModuleSpecifier(node.expression);
        }
        return undefined;
    }
}
exports.rewriteImports = rewriteImports;
const EXEMPTIONS = new Set([
    '@aws-cdk/cloudformation-diff',
]);
function updatedLocationOf(modulePath) {
    if (!modulePath.startsWith('@aws-cdk/') || EXEMPTIONS.has(modulePath)) {
        return undefined;
    }
    if (modulePath === '@aws-cdk/core') {
        return 'monocdk';
    }
    if (modulePath === '@aws-cdk/assert') {
        return '@monocdk-experiment/assert';
    }
    if (modulePath === '@aws-cdk/assert/jest') {
        return '@monocdk-experiment/assert/jest';
    }
    return `monocdk/${modulePath.substring(9)}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV3cml0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJld3JpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWlDO0FBRWpDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUNILFNBQWdCLGNBQWMsQ0FBQyxVQUFrQixFQUFFLFdBQW1CLFVBQVU7SUFDOUUsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVyRixNQUFNLFlBQVksR0FBRyxJQUFJLEtBQUssRUFBa0QsQ0FBQztJQUVqRixNQUFNLE9BQU8sR0FBRyxDQUFvQixJQUFPLEVBQXFCLEVBQUU7UUFDaEUsTUFBTSxlQUFlLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsTUFBTSxTQUFTLEdBQUcsZUFBZSxJQUFJLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3RSxJQUFJLGVBQWUsSUFBSSxJQUFJLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtZQUNoRCxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztTQUM5RTtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQyxDQUFDO0lBRUYsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRW5FLElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDO0lBQ25DLDBFQUEwRTtJQUMxRSxLQUFLLE1BQU0sV0FBVyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEs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U0FBUyxDQUFDO0tBQ2xCO0lBRUQsSUFBSSxVQUFVLEtBQUssaUJBQWlCLEVBQUU7UUFDcEMsT0FBTyw0QkFBNEIsQ0FBQztLQUNyQztJQUVELElBQUksVUFBVSxLQUFLLHNCQUFzQixFQUFFO1FBQ3pDLE9BQU8saUNBQWlDLENBQUM7S0FDMUM7SUFFRCxPQUFPLFdBQVcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBSZS13cml0ZXMgXCJoeXBlci1tb2R1bGFyXCIgQ0RLIGltcG9ydHMgKG1vc3QgcGFja2FnZXMgaW4gYEBhd3MtY2RrLypgKSB0byB0aGVcbiAqIHJlbGV2YW50IFwibW9ub1wiIENESyBpbXBvcnQgcGF0aC4gVGhlIHJlLXdyaXRpbmcgd2lsbCBvbmx5IG1vZGlmeSB0aGUgaW1wb3J0ZWRcbiAqIGxpYnJhcnkgcGF0aCwgcHJlc3J2aW5nIHRoZSBleGlzdGluZyBxdW90ZSBzdHlsZSwgZXRjLi4uXG4gKlxuICogU3ludGF4IGVycm9ycyBpbiB0aGUgc291cmNlIGZpbGUgYmVpbmcgcHJvY2Vzc2VkIG1heSBjYXVzZSBzb21lIGltcG9ydFxuICogc3RhdGVtZW50cyB0byBub3QgYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiBTdXBwb3J0ZWQgaW1wb3J0IHN0YXRlbWVudCBmb3JtcyBhcmU6XG4gKiAtIGBpbXBvcnQgKiBhcyBsaWIgZnJvbSAnQGF3cy1jZGsvbGliJztgXG4gKiAtIGBpbXBvcnQgeyBUeXBlIH0gZnJvbSAnQGF3cy1jZGsvbGliJztgXG4gKiAtIGBpbXBvcnQgJ0Bhd3MtY2RrL2xpYic7YFxuICogLSBgaW1wb3J0IGxpYiA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2xpYicpO2BcbiAqIC0gYGltcG9ydCB7IFR5cGUgfSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2xpYicpO1xuICogLSBgcmVxdWlyZSgnQGF3cy1jZGsvbGliJyk7XG4gKlxuICogQHBhcmFtIHNvdXJjZVRleHQgdGhlIHNvdXJjZSBjb2RlIHdoZXJlIGltcG9ydHMgc2hvdWxkIGJlIHJlLXdyaXR0ZW4uXG4gKiBAcGFyYW0gZmlsZU5hbWUgICBhIGN1c3RvbWl6ZWQgZmlsZSBuYW1lIHRvIHByb3ZpZGUgdGhlIFR5cGVTY3JpcHQgcHJvY2Vzc29yLlxuICpcbiAqIEByZXR1cm5zIHRoZSB1cGRhdGVkIHNvdXJjZSBjb2RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmV3cml0ZUltcG9ydHMoc291cmNlVGV4dDogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nID0gJ2luZGV4LnRzJyk6IHN0cmluZyB7XG4gIGNvbnN0IHNvdXJjZUZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKGZpbGVOYW1lLCBzb3VyY2VUZXh0LCB0cy5TY3JpcHRUYXJnZXQuRVMyMDE4KTtcblxuICBjb25zdCByZXBsYWNlbWVudHMgPSBuZXcgQXJyYXk8eyBvcmlnaW5hbDogdHMuTm9kZSwgdXBkYXRlZExvY2F0aW9uOiBzdHJpbmcgfT4oKTtcblxuICBjb25zdCB2aXNpdG9yID0gPFQgZXh0ZW5kcyB0cy5Ob2RlPihub2RlOiBUKTogdHMuVmlzaXRSZXN1bHQ8VD4gPT4ge1xuICAgIGNvbnN0IG1vZHVsZVNwZWNpZmllciA9IGdldE1vZHVsZVNwZWNpZmllcihub2RlKTtcbiAgICBjb25zdCBuZXdUYXJnZXQgPSBtb2R1bGVTcGVjaWZpZXIgJiYgdXBkYXRlZExvY2F0aW9uT2YobW9kdWxlU3BlY2lmaWVyLnRleHQpO1xuXG4gICAgaWYgKG1vZHVsZVNwZWNpZmllciAhPSBudWxsICYmIG5ld1RhcmdldCAhPSBudWxsKSB7XG4gICAgICByZXBsYWNlbWVudHMucHVzaCh7IG9yaWdpbmFsOiBtb2R1bGVTcGVjaWZpZXIsIHVwZGF0ZWRMb2NhdGlvbjogbmV3VGFyZ2V0IH0pO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9O1xuXG4gIHNvdXJjZUZpbGUuc3RhdGVtZW50cy5mb3JFYWNoKG5vZGUgPT4gdHMudmlzaXROb2RlKG5vZGUsIHZpc2l0b3IpKTtcblxuICBsZXQgdXBkYXRlZFNvdXJjZVRleHQgPSBzb3VyY2VUZXh0O1xuICAvLyBBcHBseWluZyByZXBsYWNlbWVudHMgaW4gcmV2ZXJzZSBvcmRlciwgc28gbm9kZSBwb3NpdGlvbnMgcmVtYWluIHZhbGlkLlxuICBmb3IgKGNvbnN0IHJlcGxhY2VtZW50IG9mIHJlcGxhY2VtZW50cy5zb3J0KCh7IG9yaWdpbmFsOiBsIH0sIHsgb3JpZ2luYWw6IHIgfSkgPT4gci5nZXRTdGFydChzb3VyY2VGaWxlKSAtIGwuZ2V0U3RhcnQoc291cmNlRmlsZSkpKSB7XG4gICAgY29uc3QgcHJlZml4ID0gdXBkYXRlZFNvdXJjZVRleHQuc3Vic3RyaW5nKDAsIHJlcGxhY2VtZW50Lm9yaWdpbmFsLmdldFN0YXJ0KHNvdXJjZUZpbGUpICsgMSk7XG4gICAgY29uc3Qgc3VmZml4ID0gdXBkYXRlZFNvdXJjZVRleHQuc3Vic3RyaW5nKHJlcGxhY2VtZW50Lm9yaWdpbmFsLmdldEVuZCgpIC0gMSk7XG5cbiAgICB1cGRhdGVkU291cmNlVGV4dCA9IHByZWZpeCArIHJlcGxhY2VtZW50LnVwZGF0ZWRMb2NhdGlvbiArIHN1ZmZpeDtcbiAgfVxuXG4gIHJldHVybiB1cGRhdGVkU291cmNlVGV4dDtcblxuICBmdW5jdGlvbiBnZXRNb2R1bGVTcGVjaWZpZXIobm9kZTogdHMuTm9kZSk6IHRzLlN0cmluZ0xpdGVyYWwgfCB1bmRlZmluZWQge1xuICAgIGlmICh0cy5pc0ltcG9ydERlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICAvLyBpbXBvcnQgc3R5bGVcbiAgICAgIGNvbnN0IG1vZHVsZVNwZWNpZmllciA9IG5vZGUubW9kdWxlU3BlY2lmaWVyO1xuICAgICAgaWYgKHRzLmlzU3RyaW5nTGl0ZXJhbChtb2R1bGVTcGVjaWZpZXIpKSB7XG4gICAgICAgIC8vIGltcG9ydCBmcm9tICdsb2NhdGlvbic7XG4gICAgICAgIC8vIGltcG9ydCAqIGFzIG5hbWUgZnJvbSAnbG9jYXRpb24nO1xuICAgICAgICByZXR1cm4gbW9kdWxlU3BlY2lmaWVyO1xuICAgICAgfSBlbHNlIGlmICh0cy5pc0JpbmFyeUV4cHJlc3Npb24obW9kdWxlU3BlY2lmaWVyKSAmJiB0cy5pc0NhbGxFeHByZXNzaW9uKG1vZHVsZVNwZWNpZmllci5yaWdodCkpIHtcbiAgICAgICAgLy8gaW1wb3J0IHsgVHlwZSB9ID0gcmVxdWlyZSgnbG9jYXRpb24nKTtcbiAgICAgICAgcmV0dXJuIGdldE1vZHVsZVNwZWNpZmllcihtb2R1bGVTcGVjaWZpZXIucmlnaHQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0cy5pc0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uKG5vZGUpXG4gICAgICAmJiB0cy5pc0V4dGVybmFsTW9kdWxlUmVmZXJlbmNlKG5vZGUubW9kdWxlUmVmZXJlbmNlKVxuICAgICAgJiYgdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUubW9kdWxlUmVmZXJlbmNlLmV4cHJlc3Npb24pXG4gICAgKSB7XG4gICAgICAvLyBpbXBvcnQgbmFtZSA9IHJlcXVpcmUoJ2xvY2F0aW9uJyk7XG4gICAgICByZXR1cm4gbm9kZS5tb2R1bGVSZWZlcmVuY2UuZXhwcmVzc2lvbjtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgKHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkpXG4gICAgICAmJiB0cy5pc0lkZW50aWZpZXIobm9kZS5leHByZXNzaW9uKVxuICAgICAgJiYgbm9kZS5leHByZXNzaW9uLmVzY2FwZWRUZXh0ID09PSAncmVxdWlyZSdcbiAgICAgICYmIG5vZGUuYXJndW1lbnRzLmxlbmd0aCA9PT0gMVxuICAgICkge1xuICAgICAgLy8gcmVxdWlyZSgnbG9jYXRpb24nKTtcbiAgICAgIGNvbnN0IGFyZ3VtZW50ID0gbm9kZS5hcmd1bWVudHNbMF07XG4gICAgICBpZiAodHMuaXNTdHJpbmdMaXRlcmFsKGFyZ3VtZW50KSkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0cy5pc0V4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSkgJiYgdHMuaXNDYWxsRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pKSB7XG4gICAgICAvLyByZXF1aXJlKCdsb2NhdGlvbicpOyAvLyBUaGlzIGlzIGFuIGFsdGVybmF0ZSBBU1QgdmVyc2lvbiBvZiBpdFxuICAgICAgcmV0dXJuIGdldE1vZHVsZVNwZWNpZmllcihub2RlLmV4cHJlc3Npb24pO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbmNvbnN0IEVYRU1QVElPTlMgPSBuZXcgU2V0KFtcbiAgJ0Bhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWRpZmYnLFxuXSk7XG5cbmZ1bmN0aW9uIHVwZGF0ZWRMb2NhdGlvbk9mKG1vZHVsZVBhdGg6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGlmICghbW9kdWxlUGF0aC5zdGFydHNXaXRoKCdAYXdzLWNkay8nKSB8fCBFWEVNUFRJT05TLmhhcyhtb2R1bGVQYXRoKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAobW9kdWxlUGF0aCA9PT0gJ0Bhd3MtY2RrL2NvcmUnKSB7XG4gICAgcmV0dXJuICdtb25vY2RrJztcbiAgfVxuXG4gIGlmIChtb2R1bGVQYXRoID09PSAnQGF3cy1jZGsvYXNzZXJ0Jykge1xuICAgIHJldHVybiAnQG1vbm9jZGstZXhwZXJpbWVudC9hc3NlcnQnO1xuICB9XG5cbiAgaWYgKG1vZHVsZVBhdGggPT09ICdAYXdzLWNkay9hc3NlcnQvamVzdCcpIHtcbiAgICByZXR1cm4gJ0Btb25vY2RrLWV4cGVyaW1lbnQvYXNzZXJ0L2plc3QnO1xuICB9XG5cbiAgcmV0dXJuIGBtb25vY2RrLyR7bW9kdWxlUGF0aC5zdWJzdHJpbmcoOSl9YDtcbn1cbiJdfQ==