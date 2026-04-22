class Robotinic {
    constructor(config) {
        this.config = config;
        this.currentFlow = "inicio";
        this.messagesContainer = document.getElementById("chatbot-messages");
        this.inputField = document.getElementById("chatbot-input");
        this.sendBtn = document.getElementById("chatbot-send");
        this.toggleBtn = document.getElementById("chatbot-toggle");
        this.closeBtn = document.getElementById("chatbot-close");
        this.container = document.getElementById("chatbot-container");
        this.setupEventListeners();
        this.init();
    }
    setupEventListeners() {
        this.sendBtn.addEventListener("click", () => this.handleUserInput());
        this.inputField.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.handleUserInput();
        });
        this.toggleBtn.addEventListener("click", () => this.toggleChat());
        this.closeBtn.addEventListener("click", () => this.toggleChat());
    }
    init() {
        this.currentFlow = "inicio";
        this.messagesContainer.innerHTML = "";
        this.showFlow("inicio");
    }
    toggleChat() {
        this.container.classList.toggle("chatbot-hidden");
        if (!this.container.classList.contains("chatbot-hidden")) {
            this.inputField.focus();
        }
    }
    showFlow(flowName) {
        const flow = this.config.flows[flowName];
        if (!flow) return;
        this.currentFlow = flowName;
        this.addMessage(flow.mensagem, "bot");
        if (flow.opcoes) {
            this.showOptions(flow.opcoes);
        } else if (flow.acao === "faq" && flow.faq_id) {
            const faq = this.config.faq.find(f => f.id === flow.faq_id);
            if (faq) {
                setTimeout(() => {
                    this.addMessage(faq.resposta, "bot");
                    this.addBackButton();
                }, 500);
            }
        }
    }
    showOptions(opcoes) {
        const optionsDiv = document.createElement("div");
        optionsDiv.className = "options";
        opcoes.forEach(opcao => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.textContent = opcao.texto;
            btn.addEventListener("click", () => {
                this.addMessage(opcao.texto, "user");
                if (opcao.proximo) {
                    setTimeout(() => this.showFlow(opcao.proximo), 500);
                } else if (opcao.acao === "faq" && opcao.faq_id) {
                    const faq = this.config.faq.find(f => f.id === opcao.faq_id);
                    if (faq) {
                        setTimeout(() => {
                            this.addMessage(faq.resposta, "bot");
                            this.addBackButton();
                        }, 500);
                    }
                }
            });
            optionsDiv.appendChild(btn);
        });
        this.messagesContainer.appendChild(optionsDiv);
        this.scrollToBottom();
    }
    addBackButton() {
        const backDiv = document.createElement("div");
        backDiv.className = "options";
        const backBtn = document.createElement("button");
        backBtn.className = "option-btn";
        backBtn.textContent = "← Voltar ao menu";
        backBtn.addEventListener("click", () => this.init());
        backDiv.appendChild(backBtn);
        this.messagesContainer.appendChild(backDiv);
        this.scrollToBottom();
    }
    handleUserInput() {
        const message = this.inputField.value.trim();
        if (!message) return;
        this.addMessage(message, "user");
        this.inputField.value = "";
        const intent = this.detectIntent(message);
        if (intent) {
            const faq = this.config.faq.find(f => f.id === intent.faq_id);
            if (faq) {
                setTimeout(() => {
                    this.addMessage(faq.resposta, "bot");
                    this.addBackButton();
                }, 500);
            }
        } else {
            setTimeout(() => {
                this.addMessage("Desculpe, não entendi sua pergunta. Como posso te ajudar?", "bot");
                this.addBackButton();
            }, 500);
        }
    }
    detectIntent(message) {
        const normalizedMessage = message.toLowerCase().trim();
        for (const intentConfig of this.config.intents) {
            for (const sample of intentConfig.samples) {
                if (normalizedMessage.includes(sample)) {
                    return intentConfig;
                }
            }
        }
        return null;
    }
    addMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}`;
        const content = document.createElement("div");
        content.className = "message-content";
        content.textContent = text;
        messageDiv.appendChild(content);
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const chatbot = new Robotinic(botConfig);
});