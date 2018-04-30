import shortid from 'shortid';
import urlregex from '../../common/url-regex';

class Node {
    constructor(type, content) {
        this.type = type;
        this.content = content;
        this.id = shortid();
    }

    static text(content) {
        return new Node('text', Node.parseTextToken(content));
    }

    static parseTextToken(textToken) {
        let currentPos = 0;
        const result = [];

        textToken.replace(urlregex, (...args) => {
            result.push({ type: 'text', content: textToken.substring(currentPos, args[args.length - 2]) });
            result.push({ type: 'link', content: args[0] });
            currentPos = args[args.length - 2] + args[0].length;
        });
        result.push({ type: 'text', content: textToken.substring(currentPos) });

        return result;
    }
}

export default class MarkdownParser {
    static parseToTree(text) {
        return MarkdownParser.createTree(MarkdownParser.parseTokens(text));
    }

    static parseTokens(text) {
        return text.split(/(\*\*)|(__)|(``)/).filter(t => t);
    }

    static createTree(tokens) {
        const tags = ['**', '``', '__'];
        const localRes = [];

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (tags.includes(token)) {
                const localTokens = [];
                let flag = false;
                for (i += 1; i < tokens.length; i++) {
                    const secondToken = tokens[i];
                    if (token === secondToken) {
                        localRes.push(new Node(token, MarkdownParser.createTree(localTokens)));
                        flag = true;
                        break;
                    } else {
                        localTokens.push(secondToken);
                    }
                }
                if (!flag) {
                    localRes.push(Node.text(token));
                    if (localTokens.length > 0) {
                        localRes.push(Node.text(MarkdownParser.createTree(localTokens)));
                    }
                }
            } else {
                localRes.push(Node.text(token));
            }
        }

        return localRes;
    }
}
