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
                        localRes.push({
                            type: token,
                            content: MarkdownParser.createTree(localTokens)
                        });
                        flag = true;
                        break;
                    } else {
                        localTokens.push(secondToken);
                    }
                }
                if (!flag) {
                    localRes.push({ type: 'text', content: token });
                    if (localTokens.length > 0) {
                        localRes.push({ type: 'text', content: MarkdownParser.createTree(localTokens) });
                    }
                }
            } else {
                localRes.push({ type: 'text', content: token });
            }
        }

        return localRes;
    }
}
