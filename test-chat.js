const readline = require("readline");
const { OpenAI } = require("openai");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
rl.setPrompt("Please Input Question >>> ");
rl.on('line', function (line) {
    if (line.match(/^[\s|\n]*$/i)) {
        rl.prompt();
    } else {
        if (line.trim().toLocaleLowerCase() === 'exit') {
            rl.close()
        } else {
            chat(line.trim(), (response) => {
                console.log(response);
                rl.prompt();
            })
        }
    }
})
rl.on('SIGINT', () => {
    rl.question('Want To Quit？(yes/no) ', (answer) => {
        if (answer.match(/^y(es)?$/i)) {
            rl.close()
        } else {
            rl.prompt();
        }
    });
})
rl.on('close', () => {
    console.log('good bye!')
    process.exit(0);
})
// 初始化OpenAI客户端
const openai = new OpenAI({
    baseURL: "https://api.chatanywhere.com.cn",
    apiKey: "sk-GpV6A7uBuJt5NRjFf92zXpPGlLfQFkswV5pTFEsT9YYjzF2Q",
});

// 与GPT进行聊天的函数
function chat(message, callback) {
    openai
        .chat
        .completions
        .create({
            messages: [
                {
                    role: "system",
                    content: message,
                },
            ],
            stream: true,
            model: "gpt-3.5-turbo",
        })
        .then(result => {
            // 获取gpt返回的信息
            const formattedMessage = result.choices[0].message.content.replace(/\n*/g, "");
            callback(formattedMessage)
        })
        .catch(error => {
            console.error(`GPT返回时发生错误: ${error}`);
        })
}
