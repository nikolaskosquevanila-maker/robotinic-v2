const botConfig = {
    nome: "Robotinic",
    faq: [
        "marcas",
        "financiamento",
        "entrada_usada",
        "agendamento_revisao",
        "seguro",
        "atendente"
    ],
    intents: [
        {
            pattern: "Qual é a marca do moto?",
            sample: "Me fale sobre as marcas de motos disponíveis."
        },
        {
            pattern: "Como funciona o financiamento?",
            sample: "Tô pensando em financiar uma moto, como que faz?"
        }
    ],
    flows: {
        conversationTree: {
            start: "Qual é a sua dúvida sobre motos?",
            nodes: {
                marcas: {
                    question: "Sobre quais marcas você gostaria de saber?",
                    answers: ["Marca A", "Marca B"]
                },
                financiamento: {
                    question: "Você gostaria de saber sobre as opções de financiamento?",
                    answers: ["Sim", "Não"]
                }
            }
        }
    }
};

module.exports = botConfig;