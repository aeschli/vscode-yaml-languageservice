'use strict';

import "mocha";
import assert = require('assert');
import YamlParser = require('../parser/yamlParser');


suite("Get Node from Offset", () => {
    test('', () => {
        const str = `outer: 
  inner: 
    `
        const document = YamlParser.parse(str).documents[0]

        let assertionCount = 1;

        const assertNameAndType = (offset, path: string[], type: string) => {
            const node = document.getNodeFromOffset(offset);
            assert.deepEqual(node.type, type, `${assertionCount}`)
            assert.deepStrictEqual(node.getPath(), path, `${assertionCount}`)
            assertionCount++;
        }

        assertNameAndType(0, ["outer"], "string")
        assertNameAndType(5, ["outer"], "string")
        assertNameAndType(6, [], "property")
        assertNameAndType(9, [], "property")

        assertNameAndType(10, ["outer", "inner"], "string")
        // TODO: These should both be object
        // assertNameAndType(19, [], "property") //https://github.com/mulesoft-labs/yaml-ast-parser/issues/25
        // assertNameAndType(21, ["outer"], "property") //https://github.com/mulesoft-labs/yaml-ast-parser/issues/25
    })

    test('Multiple Documents', function(){
        const input = `---
value: 1
...
---
value: 2
...`
        
        const document = YamlParser.parse(input)
        const node = document.getNodeFromOffset(23)

        assert.deepStrictEqual(node.getPath(), ["value"])
        assert.deepEqual(node.type, "string")
    })
})