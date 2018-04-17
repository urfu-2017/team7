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
        const result = [];
        let currentText = '';
        textToken.split('\n').forEach((line) => {
            line.split(' ').forEach((word) => {
                if (urlregex.test(word)) {
                    if (currentText) {
                        result.push({ type: 'text', content: currentText });
                    }
                    currentText = ' ';
                    result.push({ type: 'link', content: word });
                } else {
                    currentText += word;
                    currentText += ' ';
                }
            });

            currentText = currentText.substring(0, currentText.length - 1);
            currentText += '\n';
        });

        currentText = currentText.substring(0, currentText.length - 1);
        if (currentText) {
            result.push({ type: 'text', content: currentText });
        }

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
