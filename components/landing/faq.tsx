"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
    {
        question: "How does Math Flow's AI help me learn math?",
        answer:
        "Math Flow's AI assistant understands your math problems and provides personalized help through interactive conversations. It can create step-by-step solutions, generate flashcards for studying, and visualize problems with graphs to help you understand concepts better.",
    },
    {
        question: "What types of math problems can Math Flow help with?",
        answer:
        "Math Flow can help with algebra, calculus, geometry, trigonometry, statistics, and more. Our AI can solve equations, create function graphs, generate study flashcards, and provide detailed step-by-step explanations for complex mathematical concepts.",
    },
    {
        question: "How do the flashcards work for studying?",
        answer:
        "Our AI generates personalized flashcards based on any math topic you're studying. You can choose the difficulty level (easy, medium, or hard) and the number of cards. The system tracks your progress and helps you master concepts through spaced repetition.",
    },
    {
        question: "Can I visualize my math problems with graphs?",
        answer:
        "Yes! Math Flow can create various types of graphs including function graphs, bar charts, line charts, scatter plots, histograms, and even polar coordinate graphs. This helps you visualize mathematical concepts and understand relationships between variables.",
    },
    {
        question: "What's included in the free plan vs. the Pro plan?",
        answer:
        "The free plan includes 5 AI messages per day, 2 flashcards, 2 graphs, and 1 step-by-step solution. The Pro plan offers unlimited AI messages, unlimited flashcards, unlimited graphs, unlimited step-by-step solutions, and priority support for $10/month.",
    },
    {
        question: "Is my math data and progress secure?",
        answer:
        "Absolutely. Math Flow uses enterprise-grade security and follows strict privacy standards. Your math problems, solutions, and learning progress are never shared with third parties, and you have full control over your data.",
    },
    {
        question: "Can Math Flow help with homework and test preparation?",
        answer:
        "Yes! Math Flow is perfect for homework help and test prep. You can ask for step-by-step solutions to understand problem-solving methods, create flashcards to review key concepts, and generate practice problems to test your knowledge.",
    }
]

export function FAQSection() {
    return (
        <section id="faq" className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto mb-16 text-center">
                  <h1 className="text-center text-4xl lg:text-5xl mb-3">Frequently asked questions</h1>
                  <p>
                    Everything you need to know about Math Flow. Can&apos;t find what you&apos;re looking for?
                  </p>
                </div>

                <div className="mx-auto max-w-3xl">
                    <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b border-zinc-200 last:border-b-0">
                                <AccordionTrigger className="text-left font-medium text-lg cursor-pointer text-black hover:text-neutral-700 py-6">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="pb-6">
                                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
